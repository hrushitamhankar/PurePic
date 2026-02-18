import cv2
import numpy as np
from src.quality.image_loader import load_preview


# -------------------------------------------------
# EYE / FOCUS REGION DETECTION
# -------------------------------------------------
def detect_eye_focus(image_source):
    """
    Estimates whether viewer attention area is sharp.
    Works for portraits, wildlife, events.
    Returns score (0–100).
    """

    img = load_preview(image_source)
    if img is None:
        return 0.0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # global sharpness
    lap = cv2.Laplacian(gray, cv2.CV_64F)
    sharp_map = np.abs(lap)

    global_mean = np.mean(sharp_map)
    if global_mean == 0:
        return 0.0

    # central attention region
    h, w = gray.shape
    roi = sharp_map[h//3:2*h//3, w//3:2*w//3]

    focus_ratio = np.mean(roi) / global_mean

    score = np.clip(focus_ratio * 40, 0, 100)

    return float(score)
