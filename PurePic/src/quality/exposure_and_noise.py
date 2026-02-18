import cv2
import numpy as np
from src.quality.image_loader import load_raw


def exposure_noise_score(image_source):

    img = load_raw(image_source)
    if img is None:
        return 0.0, "unknown"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    brightness = np.mean(gray)

    if brightness < 60:
        exposure = "dark"
    elif brightness > 190:
        exposure = "bright"
    else:
        exposure = "normal"

    noise = cv2.Laplacian(gray, cv2.CV_64F).var()

    return float(noise), exposure
