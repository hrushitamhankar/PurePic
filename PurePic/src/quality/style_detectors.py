import cv2
import numpy as np

def detect_lowkey(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark_ratio = np.mean(gray < 40)
    return dark_ratio > 0.60

def detect_artistic_contrast(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    L = lab[:, :, 0]
    contrast = np.std(L)
    return contrast > 22

def detect_moody_wildlife(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    v = hsv[:, :, 2]

    dark_regions = np.mean(v < 50)
    subject_brightness = np.mean(v > 150)

    return dark_regions > 0.55 and subject_brightness > 0.15

# -------------------------------------------------------------
# PUBLIC STYLE API (USED BY final_quality.py)
# -------------------------------------------------------------
def detect_style(image_path):
    """
    Unified style detector wrapper.
    Returns dictionary of style flags.
    """

    try:
        lowkey = detect_lowkey(image_path)
    except:
        lowkey = False

    try:
        artistic = detect_artistic_contrast(image_path)
    except:
        artistic = False

    try:
        moody = detect_moody_wildlife(image_path)
    except:
        moody = False

    return {
        "lowkey": lowkey,
        "artistic": artistic,
        "moody_wildlife": moody
    }
