import cv2
import numpy as np
from src.quality.sharpness import load_preview_raw


# -------------------------------------------------
# LOAD IMAGE
# -------------------------------------------------
def load_img(path):
    img = load_preview_raw(path)
    return img


# -------------------------------------------------
# MOMENT SCORE
# -------------------------------------------------
def moment_score(image_path):

    img = load_img(image_path)
    if img is None:
        return 0.0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # edges represent pose complexity
    edges = cv2.Canny(gray, 70, 150)

    edge_density = np.sum(edges > 0) / edges.size

    # center importance (subjects usually centered)
    h, w = gray.shape
    center = edges[h//4:3*h//4, w//4:3*w//4]

    center_density = np.sum(center > 0) / center.size

    # motion/action heuristic
    score = (edge_density * 0.6 + center_density * 0.4) * 100

    return float(score)
