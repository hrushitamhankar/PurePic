import cv2
from src.quality.image_loader import load_raw


def compute_quality(image_source):

    img = load_raw(image_source)
    if img is None:
        return 0.0, "unknown"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()

    if sharpness < 40:
        blur = "soft"
    else:
        blur = "none"

    return float(sharpness), blur
