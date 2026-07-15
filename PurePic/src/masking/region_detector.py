import cv2
import numpy as np


# -------------------------------------------------
# Utility
# -------------------------------------------------

def normalize_map(arr):

    arr = arr.astype(np.float32)

    arr -= arr.min()

    if arr.max() > 0:
        arr /= arr.max()

    return arr


# -------------------------------------------------
# Subject Region
# -------------------------------------------------

def generate_subject_mask(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    h, w = gray.shape

    # ---------------------------------------------
    # Sharpness / Edge map
    # ---------------------------------------------

    lap = cv2.Laplacian(gray, cv2.CV_64F)

    sharpness = np.abs(lap)

    sharpness = normalize_map(sharpness)

    # ---------------------------------------------
    # Center Bias
    # ---------------------------------------------

    y, x = np.ogrid[:h, :w]

    center_y = h / 2
    center_x = w / 2

    distance = np.sqrt(
        (x - center_x) ** 2 +
        (y - center_y) ** 2
    )

    distance = normalize_map(distance)

    center_bias = 1 - distance

    # ---------------------------------------------
    # Combine
    # ---------------------------------------------

    combined = (
        sharpness * 0.6 +
        center_bias * 0.4
    )

    # ---------------------------------------------
    # Threshold
    # ---------------------------------------------

    mask = (combined > 0.45).astype(np.uint8)

    # ---------------------------------------------
    # Smooth
    # ---------------------------------------------

    mask = cv2.GaussianBlur(
        mask.astype(np.float32),
        (21, 21),
        0
    )

    mask = normalize_map(mask)

    return mask


# -------------------------------------------------
# Background Region
# -------------------------------------------------

def generate_background_mask(subject_mask):

    background = 1 - subject_mask

    background = normalize_map(background)

    return background


# -------------------------------------------------
# Bright Region
# -------------------------------------------------

def generate_brightness_mask(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    brightness = gray.astype(np.float32) / 255.0

    mask = (brightness > 0.7).astype(np.float32)

    mask = cv2.GaussianBlur(mask, (31, 31), 0)

    mask = normalize_map(mask)

    return mask


# -------------------------------------------------
# Main Region Detector
# -------------------------------------------------

def detect_regions(image):

    subject_mask = generate_subject_mask(image)

    background_mask = generate_background_mask(
        subject_mask
    )

    brightness_mask = generate_brightness_mask(
        image
    )

    return {

        "subject_mask": subject_mask,

        "background_mask": background_mask,

        "brightness_mask": brightness_mask
    }