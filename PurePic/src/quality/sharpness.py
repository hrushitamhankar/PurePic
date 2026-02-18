import cv2
import numpy as np
import rawpy
import os


# -------------------------------------------------
# RAW + NORMAL IMAGE LOADER
# -------------------------------------------------
def load_preview_raw(path):

    ext = os.path.splitext(path)[1].lower()

    if ext in [".cr2", ".nef", ".arw", ".dng"]:
        try:
            with rawpy.imread(path) as raw:
                rgb = raw.postprocess()
                return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        except:
            return None

    return cv2.imread(path)


def load_gray(image_source):

    if isinstance(image_source, np.ndarray):
        return cv2.cvtColor(image_source, cv2.COLOR_BGR2GRAY)

    img = load_preview_raw(image_source)

    if img is None:
        return None

    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


# -------------------------------------------------
# MOTION BLUR DETECTOR
# -------------------------------------------------
def detect_motion_blur(gray):

    gx = cv2.Sobel(gray, cv2.CV_64F, 1, 0)
    gy = cv2.Sobel(gray, cv2.CV_64F, 0, 1)

    var_x = gx.var()
    var_y = gy.var()

    return var_x < 40 and var_y < 40


# -------------------------------------------------
# MAIN QUALITY FUNCTION
# -------------------------------------------------
def compute_quality(image_source):
    """
    RETURNS:
        sharpness_value (float)
        blur_type (str)
    """

    gray = load_gray(image_source)

    if gray is None:
        return 0.0, "unknown"

    # Laplacian sharpness
    sharpness_value = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # Blur classification
    if detect_motion_blur(gray):
        blur_type = "motion"
    elif sharpness_value < 60:
        blur_type = "soft"
    else:
        blur_type = "none"

    return sharpness_value, blur_type
