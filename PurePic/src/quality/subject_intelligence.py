"""
PUREPIC — SUBJECT INTELLIGENCE
Stable interface version
"""

import cv2
import numpy as np
import rawpy
import os


# -------------------------------------------------------------
# IMAGE LOADER (RAW + JPG)
# -------------------------------------------------------------
def load_image_any(path):

    ext = os.path.splitext(path)[1].lower()

    # RAW formats
    if ext in [".cr2", ".nef", ".arw", ".dng"]:
        try:
            with rawpy.imread(path) as raw:
                rgb = raw.postprocess(
                    use_camera_wb=True,
                    no_auto_bright=True,
                    output_bps=8
                )
                return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        except Exception:
            return None

    return cv2.imread(path)


# -------------------------------------------------------------
# BASIC SUBJECT ESTIMATION
# (lightweight — no new AI added)
# -------------------------------------------------------------
def subject_score(image_path):
    """
    Returns numeric subject strength estimate.
    Higher = stronger subject presence.
    """

    img = load_image_any(image_path)
    if img is None:
        return 10.0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Edge density heuristic
    edges = cv2.Canny(gray, 60, 120)
    edge_ratio = np.sum(edges > 0) / edges.size

    # Normalize into usable range
    score = edge_ratio * 100

    # Clamp
    score = max(5.0, min(score, 60.0))

    return float(score)


# -------------------------------------------------------------
# PUREPIC PIPELINE WRAPPER (CRITICAL)
# -------------------------------------------------------------
def subject_intelligence(image_path):
    """
    FINAL API used by final_quality.py

    ALWAYS returns:
        (subject_score_value, strong_subject_bool)
    """

    score = subject_score(image_path)

    # ensure python float (avoid numpy unpack errors)
    score = float(score)

    # Human-like strong subject decision
    strong_subject = score >= 12.0

    return score, strong_subject
