import cv2
import numpy as np
from src.quality.image_loader import load_preview


def subject_intelligence(image_source):

    img = load_preview(image_source)
    if img is None:
        return 0.0, False

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, 80, 160)

    edge_density = np.mean(edges > 0)

    h, w = gray.shape
    center = edges[h//4:3*h//4, w//4:3*w//4]
    center_density = np.mean(center > 0)

    score = (center_density * 0.7 + edge_density * 0.3) * 100

    return float(score), score > 15
