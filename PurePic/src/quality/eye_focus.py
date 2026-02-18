import cv2
import numpy as np
from src.quality.sharpness import load_preview_raw


# -------------------------------------------------
# LOAD IMAGE
# -------------------------------------------------
def load_img(path):
    return load_preview_raw(path)


# -------------------------------------------------
# LOCAL SHARPNESS MAP
# -------------------------------------------------
def local_sharpness(gray):

    lap = cv2.Laplacian(gray, cv2.CV_64F)
    sharp_map = np.abs(lap)

    return sharp_map


# -------------------------------------------------
# EYE FOCUS SCORE
# -------------------------------------------------
def eye_focus_score(image_path):

    img = load_img(image_path)
    if img is None:
        return 0.0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    sharp_map = local_sharpness(gray)

    h, w = gray.shape

    # photographers usually place subject near center thirds
    roi = sharp_map[h//3:2*h//3, w//3:2*w//3]

    center_sharp = np.mean(roi)
    global_sharp = np.mean(sharp_map)

    # eye tends to be sharper than surroundings
    if global_sharp == 0:
        return 0.0

    ratio = center_sharp / global_sharp

    return float(ratio * 10)
