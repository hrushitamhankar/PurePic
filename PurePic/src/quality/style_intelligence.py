import cv2
import numpy as np
from src.quality.sharpness import load_preview_raw


# -------------------------------------------------
# LOAD IMAGE
# -------------------------------------------------
def load_img(path):
    img = load_preview_raw(path)
    if img is None:
        return None
    return img


# -------------------------------------------------
# LOW KEY DETECTION (dark artistic photos)
# -------------------------------------------------
def detect_lowkey(img):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    mean_light = np.mean(gray)
    bright_pixels = np.sum(gray > 180) / gray.size

    # dark overall but bright subject exists
    if mean_light < 70 and bright_pixels > 0.02:
        return True

    return False


# -------------------------------------------------
# SUBJECT ISOLATION (NatGeo look)
# -------------------------------------------------
def detect_subject_isolation(img):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    center = gray[
        gray.shape[0]//4:3*gray.shape[0]//4,
        gray.shape[1]//4:3*gray.shape[1]//4
    ]

    edge = gray.copy()
    edge[gray.shape[0]//4:3*gray.shape[0]//4,
         gray.shape[1]//4:3*gray.shape[1]//4] = 0

    if np.mean(center) > np.mean(edge) + 15:
        return True

    return False


# -------------------------------------------------
# MOTION / FLIGHT DETECTION
# -------------------------------------------------
def detect_action_frame(img):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 160)

    edge_density = np.sum(edges > 0) / edges.size

    # wings / motion creates complex edges
    return edge_density > 0.06


# -------------------------------------------------
# MASTER STYLE INTELLIGENCE
# -------------------------------------------------
def style_intelligence(image_path):

    img = load_img(image_path)
    if img is None:
        return False, False, False

    lowkey = detect_lowkey(img)
    isolation = detect_subject_isolation(img)
    action = detect_action_frame(img)

    strong_artistic = lowkey or isolation
    wildlife_action = action

    return strong_artistic, wildlife_action, lowkey
