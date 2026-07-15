import cv2
import numpy as np

# -------------------------------------------------
# Skin Region Detection
# -------------------------------------------------

def detect_skin_regions(image):

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    lower = np.array([0, 30, 60])
    upper = np.array([25, 180, 255])

    mask = cv2.inRange(
        hsv,
        lower,
        upper
    )

    mask = cv2.GaussianBlur(
        mask,
        (11, 11),
        0
    )

    return mask

# -------------------------------------------------
# Highlight Detection
# -------------------------------------------------

def detect_highlight_regions(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    _, mask = cv2.threshold(

        gray,

        210,

        255,

        cv2.THRESH_BINARY
    )

    mask = cv2.GaussianBlur(

        mask,

        (9, 9),

        0
    )

    return mask

# -------------------------------------------------
# Background Darkness Detection
# -------------------------------------------------

def detect_dark_regions(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    _, mask = cv2.threshold(

        gray,

        60,

        255,

        cv2.THRESH_BINARY_INV
    )

    mask = cv2.GaussianBlur(

        mask,

        (21, 21),

        0
    )

    return mask

# -------------------------------------------------
# Texture Region Detection
# -------------------------------------------------

def detect_texture_regions(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    laplacian = cv2.Laplacian(
        gray,
        cv2.CV_64F
    )

    laplacian = np.absolute(
        laplacian
    )

    laplacian = np.uint8(
        laplacian
    )

    _, mask = cv2.threshold(

        laplacian,

        35,

        255,

        cv2.THRESH_BINARY
    )

    mask = cv2.GaussianBlur(

        mask,

        (7, 7),

        0
    )

    return mask

# -------------------------------------------------
# Main Semantic Extraction
# -------------------------------------------------

def extract_semantic_regions(image):

    return {

        "skin_region":

            detect_skin_regions(image),

        "highlight_region":

            detect_highlight_regions(image),

        "dark_region":

            detect_dark_regions(image),

        "texture_region":

            detect_texture_regions(image)
    }