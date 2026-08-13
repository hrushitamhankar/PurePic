"""
purepic_server.py — Flutter ↔ Python bridge for PurePic Sort.

Communication protocol: newline-delimited JSON over stdin/stdout.

Flutter → Python commands:
  {"cmd": "scan",  "input": "<path>", "output": "<path>"}
  {"cmd": "cancel"}

Python → Flutter messages:
  {"type": "scan_result", "total": 2486, "files": ["IMG_001.CR3", ...]}
  {"type": "progress",    "index": 1, "total": 2486, "file": "IMG_001.CR3",
                          "label": "artistic_keep", "score": 0.94,
                          "technical": 78.2, "aesthetic": 91.0}
  {"type": "complete",    "total": 2486, "counts": {...}, "output_dir": "..."}
  {"type": "error",       "message": "..."}
  {"type": "log",         "message": "..."}
"""

import sys
import os

# ── Silence ALL TensorFlow / oneDNN / ABSL noise BEFORE any import ───────────
os.environ["TF_CPP_MIN_LOG_LEVEL"]    = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"]   = "0"
os.environ["ABSL_MIN_LOG_LEVEL"]       = "3"
os.environ["GLOG_minloglevel"]         = "3"
os.environ["OPENCV_LOG_LEVEL"]         = "ERROR"
os.environ["PYTHONWARNINGS"]           = "ignore"
os.environ["TF_SILENCE_DEBUG_LOGS"]   = "1"

# Redirect stderr to devnull so Flutter never sees TF startup spam
import io
sys.stderr = open(os.devnull, "w")

import json
import shutil
import traceback

# ── Ensure project root is on sys.path ───────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# ── Import backend ────────────────────────────────────────────────────────────
from src.quality.final_quality import final_evaluation

# ── Supported extensions (mirrors purepic_batch.py) ──────────────────────────
VALID_EXT = {
    ".jpg", ".jpeg", ".png", ".bmp", ".webp",
    ".tif", ".tiff", ".heic", ".heif",
    ".cr2", ".cr3", ".nef", ".arw",
    ".dng", ".orf", ".raf", ".rw2",
}

# ── Output subfolder names ────────────────────────────────────────────────────
LABEL_FOLDERS = {
    "artistic_keep": "artistic_keep",
    "good":          "good",
    "ok":            "ok",
    "reject":        "reject",
}

_cancelled = False


def emit(obj: dict):
    """Write one JSON line to stdout, flush immediately."""
    sys.stdout.write(json.dumps(obj) + "\n")
    sys.stdout.flush()


def log(msg: str):
    emit({"type": "log", "message": msg})


def collect_images(folder: str) -> list[str]:
    """Return sorted list of supported image paths in folder."""
    paths = []
    for entry in os.scandir(folder):
        if entry.is_file():
            ext = os.path.splitext(entry.name)[1].lower()
            if ext in VALID_EXT:
                paths.append(entry.path)
    paths.sort()
    return paths


def process_scan(input_dir: str, output_dir: str):
    """
    Scan input_dir, evaluate every image, copy to output_dir subfolders,
    stream progress to Flutter.
    """
    global _cancelled
    _cancelled = False

    # ── Validate input ────────────────────────────────────────────────────────
    if not os.path.isdir(input_dir):
        emit({"type": "error", "message": f"Input folder not found: {input_dir}"})
        return

    # ── Collect images ────────────────────────────────────────────────────────
    log("Scanning folder...")
    image_paths = collect_images(input_dir)
    total = len(image_paths)

    if total == 0:
        emit({"type": "error", "message": "No supported images found in the input folder."})
        return

    # Send scan result so Flutter can show "2486 Images Found"
    emit({
        "type": "scan_result",
        "total": total,
        "files": [os.path.basename(p) for p in image_paths],
    })

    # ── Create output subfolders ──────────────────────────────────────────────
    log("Preparing AI engine...")
    for subfolder in LABEL_FOLDERS.values():
        os.makedirs(os.path.join(output_dir, subfolder), exist_ok=True)

    # ── Process each image ────────────────────────────────────────────────────
    counts = {"artistic_keep": 0, "good": 0, "ok": 0, "reject": 0}

    for index, img_path in enumerate(image_paths, start=1):
        if _cancelled:
            emit({"type": "cancelled"})
            return

        filename = os.path.basename(img_path)

        try:
            result = final_evaluation(img_path)

            label   = result.get("final_label", "reject")
            score   = float(result.get("final_score", 0.0))
            tech    = float(result.get("technical_score", 0.0))
            aes     = float(result.get("aesthetic_score", 0.0))
            conf    = float(result.get("confidence", 0.0))

            # Normalise score to 0–1 for Flutter
            score_norm = round(min(max(score / 100.0, 0.0), 1.0), 4)
            conf_norm  = round(min(max(conf  / 100.0, 0.0), 1.0), 4)

            dest_subfolder = LABEL_FOLDERS.get(label, "reject")
            dest_path = os.path.join(output_dir, dest_subfolder, filename)
            shutil.copy2(img_path, dest_path)

            counts[label] = counts.get(label, 0) + 1

            emit({
                "type":       "progress",
                "index":      index,
                "total":      total,
                "file":       filename,
                "file_path":  img_path,          # full path for Flutter preview
                "dest_path":  dest_path,         # sorted destination
                "label":      label,
                "score":      score_norm,
                "confidence": conf_norm,
                "technical":  round(tech, 2),
                "aesthetic":  round(aes, 2),
            })

        except Exception as exc:
            emit({
                "type":    "progress_error",
                "index":   index,
                "total":   total,
                "file":    filename,
                "message": str(exc),
            })
            # Continue processing remaining images even on single failure

    # ── Done ──────────────────────────────────────────────────────────────────
    emit({
        "type":       "complete",
        "total":      total,
        "counts":     counts,
        "output_dir": output_dir,
    })


def main():
    """Read JSON commands from stdin, one per line."""
    log("PurePic Sort engine ready.")

    for raw_line in sys.stdin:
        raw_line = raw_line.strip()
        if not raw_line:
            continue

        try:
            cmd = json.loads(raw_line)
        except json.JSONDecodeError as exc:
            emit({"type": "error", "message": f"Bad command JSON: {exc}"})
            continue

        action = cmd.get("cmd", "")

        if action == "scan":
            input_dir  = cmd.get("input", "").strip()
            output_dir = cmd.get("output", "").strip()
            if not input_dir or not output_dir:
                emit({"type": "error", "message": "Both 'input' and 'output' paths are required."})
                continue
            try:
                process_scan(input_dir, output_dir)
            except Exception as exc:
                traceback.print_exc(file=sys.stderr)
                emit({"type": "error", "message": str(exc)})

        elif action == "cancel":
            global _cancelled
            _cancelled = True
            log("Cancellation requested.")

        else:
            emit({"type": "error", "message": f"Unknown command: {action}"})


if __name__ == "__main__":
    main()
