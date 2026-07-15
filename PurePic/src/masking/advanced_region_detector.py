import cv2
import numpy as np
from masking.ai_subject_detector import detect_subject_mask

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

def generate_subject_region(image):

    return detect_subject_mask(image)


# -------------------------------------------------
# Luminance Region
# -------------------------------------------------

def generate_luminance_region(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    luminance = gray.astype(np.float32) / 255.0

    luminance = cv2.GaussianBlur(
        luminance,
        (31, 31),
        0
    )

    luminance = normalize_map(luminance)

    return luminance


# -------------------------------------------------
# Warmth Region
# -------------------------------------------------

def generate_warmth_region(image):

    b, g, r = cv2.split(image)

    warmth = (
        r.astype(np.float32) -
        b.astype(np.float32)
    )

    warmth = normalize_map(warmth)

    warmth = cv2.GaussianBlur(
        warmth,
        (31, 31),
        0
    )

    warmth = normalize_map(warmth)

    return warmth


# -------------------------------------------------
# Radial Focus Region
# -------------------------------------------------

def generate_radial_region(image):

    h, w = image.shape[:2]

    y, x = np.ogrid[:h, :w]

    center_y = h / 2
    center_x = w / 2

    distance = np.sqrt(
        (x - center_x) ** 2 +
        (y - center_y) ** 2
    )

    distance = normalize_map(distance)

    radial = 1 - distance

    radial = cv2.GaussianBlur(
        radial,
        (101, 101),
        0
    )

    radial = normalize_map(radial)

    return radial


# -------------------------------------------------
# Main Detector
# -------------------------------------------------

def detect_advanced_regions(
    image,
    top_masks
):

    regions = {}

    # ---------------------------------------------
    # Generate only needed regions
    # ---------------------------------------------

    for mask_name, score in top_masks:

        # -----------------------------------------
        # Subject
        # -----------------------------------------

        if mask_name == "subject_mask":

            regions["subject_mask"] = {
                "mask": generate_subject_region(image),
                "color": [0, 255, 0],
                "opacity": 0.45
            }

        # -----------------------------------------
        # Luminance
        # -----------------------------------------

        elif mask_name == "luminance_mask":

            regions["luminance_mask"] = {
                "mask": generate_luminance_region(image),
                "color": [255, 255, 0],
                "opacity": 0.40
            }

        # -----------------------------------------
        # Warmth
        # -----------------------------------------

        elif mask_name == "warmth_mask":

            regions["warmth_mask"] = {
                "mask": generate_warmth_region(image),
                "color": [255, 120, 0],
                "opacity": 0.35
            }

        # -----------------------------------------
        # Radial
        # -----------------------------------------

        elif mask_name == "radial_mask":

            regions["radial_mask"] = {
                "mask": generate_radial_region(image),
                "color": [255, 0, 255],
                "opacity": 0.30
            }

    return regions