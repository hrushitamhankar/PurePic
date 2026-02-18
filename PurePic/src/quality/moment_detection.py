import cv2
import numpy as np
from src.quality.image_loader import load_preview


# -------------------------------------------------
# MOMENT DETECTION
# -------------------------------------------------
def detect_moment(image_source):
    """
    Detects action / gesture / visual activity.
    Returns score 0–100.
    """

    img = load_preview(image_source)
    if img is None:
        return 0.0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, 70, 150)

    edge_density = np.mean(edges > 0)

    h, w = gray.shape
    center = edges[h//4:3*h//4, w//4:3*w//4]
    center_density = np.mean(center > 0)

    score = (edge_density * 0.6 + center_density * 0.4) * 100

    return float(score)
