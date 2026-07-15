import cv2
import numpy as np

# ---------------------------------------------------
# Cinematic RGB Curve
# ---------------------------------------------------

def apply_cinematic_curve(image):

    lut = np.arange(
        256,
        dtype=np.float32
    )

    # Soft S-Curve

    normalized = lut / 255.0

    curved = (

        normalized ** 0.92
    )

    curved = curved * 255

    lut = np.clip(

        curved,

        0,

        255
    ).astype(np.uint8)

    result = cv2.LUT(
        image,
        lut
    )

    return result

# ---------------------------------------------------
# Protect Skin Highlights
# ---------------------------------------------------

def protect_skin_highlights(image):

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    hsv = hsv.astype(np.float32)

    # reduce saturation in very bright areas

    value = hsv[:, :, 2]
    sat = hsv[:, :, 1]

    bright_mask = value > 210

    sat[bright_mask] *= 0.82

    hsv[:, :, 1] = sat

    hsv = np.clip(
        hsv,
        0,
        255
    ).astype(np.uint8)

    result = cv2.cvtColor(
        hsv,
        cv2.COLOR_HSV2BGR
    )

    return result

# ---------------------------------------------------
# Soft Film Contrast
# ---------------------------------------------------

def apply_soft_contrast(image):

    img = image.astype(
        np.float32
    ) / 255.0

    contrasted = (

        (img - 0.5) * 0.92
        + 0.5
    )

    contrasted = np.clip(

        contrasted,

        0,

        1
    )

    return (
        contrasted * 255
    ).astype(np.uint8)