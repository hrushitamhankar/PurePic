import os
import csv
import shutil
from src.quality.final_quality import final_evaluation


# -------------------------------------------------------------
# PATH HANDLING
# -------------------------------------------------------------
SCRIPT_ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_ROOT)

OUTPUT_ROOT = os.path.join(PROJECT_ROOT, "outputs")

FOLDERS = {
    "good": os.path.join(OUTPUT_ROOT, "good"),
    "ok": os.path.join(OUTPUT_ROOT, "ok"),
    "bad": os.path.join(OUTPUT_ROOT, "bad"),
    "artistic_keep": os.path.join(OUTPUT_ROOT, "artistic_keep"),
    "wildlife_keep": os.path.join(OUTPUT_ROOT, "wildlife_keep"),
}

CSV_REPORT = os.path.join(OUTPUT_ROOT, "report.csv")

VALID_EXT = [".jpg", ".jpeg", ".png", ".cr2", ".nef", ".arw", ".dng"]


os.makedirs(OUTPUT_ROOT, exist_ok=True)
for folder in FOLDERS.values():
    os.makedirs(folder, exist_ok=True)


# -------------------------------------------------------------
# CLEAN PATH
# -------------------------------------------------------------
def clean_path(path_str):
    return path_str.strip().strip('"').strip("'")


# -------------------------------------------------------------
# OUTPUT FOLDER
# -------------------------------------------------------------
def choose_output_folder(final_label):
    return FOLDERS.get(final_label.lower(), FOLDERS["bad"])


# -------------------------------------------------------------
# HUMAN-LIKE RELATIVE RANKING
# -------------------------------------------------------------
def assign_labels_by_rank(all_results):
    """
    Assign labels based on ranking inside THIS shoot.
    This mimics human photo selection.
    """

    all_results.sort(
        key=lambda x: x[2]["final_score"],
        reverse=True
    )

    total = len(all_results)

    for i, (_, _, result) in enumerate(all_results):

        ratio = i / total

        # Top images = artistic keep
        if ratio < 0.15:
            result["final_label"] = "artistic_keep"

        # Strong keepers
        elif ratio < 0.40:
            result["final_label"] = "good"

        # Usable frames
        elif ratio < 0.75:
            result["final_label"] = "ok"

        # Rest rejected
        else:
            result["final_label"] = "bad"

    return all_results


# -------------------------------------------------------------
# BATCH SCAN
# -------------------------------------------------------------
def scan_folder(folder_path):

    folder_path = os.path.abspath(clean_path(folder_path))

    print("\n📸 PUREPIC BATCH SCANNING STARTED...\n")

    if not os.path.isdir(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return

    all_results = []

    # ---------------- FIRST PASS (EVALUATE ONLY)
    for file in os.listdir(folder_path):

        img_path = os.path.join(folder_path, file)

        if not os.path.isfile(img_path):
            continue

        ext = os.path.splitext(file)[1].lower()
        if ext not in VALID_EXT:
            continue

        print(f"Processing: {file} ...")

        try:
            result = final_evaluation(img_path)
            all_results.append((file, img_path, result))

        except Exception as e:
            print(f"❌ Error processing {file}: {e}")

    # ---------------- SECOND PASS (HUMAN RANKING)
    all_results = assign_labels_by_rank(all_results)

    # ---------------- WRITE OUTPUTS
    with open(CSV_REPORT, "w", newline="", encoding="utf-8") as csv_file:

        writer = csv.writer(csv_file)
        writer.writerow([
            "filename", "final_label", "final_score",
            "technical_score", "aesthetic_score",
            "sharpness", "blur", "noise", "exposure",
            "artistic", "moody_wildlife", "lowkey"
        ])

        for file, img_path, result in all_results:

            dest_folder = choose_output_folder(result["final_label"])
            dest_path = os.path.join(dest_folder, file)

            shutil.copy2(img_path, dest_path)

            writer.writerow([
                file,
                result["final_label"],
                result["final_score"],
                result["technical_score"],
                result["aesthetic_score"],
                result["sharpness"],
                result["blur"],
                result["noise"],
                result["exposure"],
                result["artistic"],
                result["moody_wildlife"],
                result["lowkey"]
            ])

    print("\n🎉 PUREPIC BATCH COMPLETE!")
    print(f"📄 CSV Report: {CSV_REPORT}")
    print(f"📁 Sorted Output: {OUTPUT_ROOT}")


# -------------------------------------------------------------
# RUNNER
# -------------------------------------------------------------
if __name__ == "__main__":
    folder_input = input("Enter folder path to scan: ").strip()
    scan_folder(folder_input)
