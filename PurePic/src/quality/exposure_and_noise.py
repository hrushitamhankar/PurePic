import cv2
import numpy as np
import rawpy
import os


# -------------------------------------------------
# IMAGE LOADER (RAW + JPG)
# -------------------------------------------------
def load_image(path):

    ext = os.path.splitext(path)[1].lower()

    if ext in [".cr2", ".nef", ".arw", ".dng"]:
        try:
            with rawpy.imread(path) as raw:
                rgb = raw.postprocess()
                img = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        except:
            return None
    else:
        img = cv2.imread(path)

    return img


# -------------------------------------------------
# NOISE + EXPOSURE ANALYSIS
# -------------------------------------------------
def exposure_noise_score(image_path):
    """
    RETURNS:
        noise_value (float)
        exposure_label (str)
    """

    img = load_image(image_path)

    if img is None:
        return 0.0, "unknown"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # ---------- NOISE ----------
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    noise_value = float(np.mean((gray - blur) ** 2))

    # ---------- EXPOSURE ----------
    mean_brightness = np.mean(gray)

    if mean_brightness < 70:
        exposure = "under"
    elif mean_brightness > 190:
        exposure = "over"
    else:
        exposure = "normal"

    return noise_value, exposure
