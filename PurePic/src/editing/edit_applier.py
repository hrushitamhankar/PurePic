import cv2
import numpy as np

# -------------------------------------------------
# Utility
# -------------------------------------------------

def normalize_mask(mask):

    mask = mask.astype(
        np.float32
    ) / 255.0

    return cv2.merge([
        mask,
        mask,
        mask
    ])

# -------------------------------------------------
# Exposure
# -------------------------------------------------

def apply_exposure(
    image,
    value
):

    gamma = 1.0 - (value * 0.35)

    gamma = max(
        0.3,
        gamma
    )

    inv_gamma = 1.0 / gamma

    table = np.array([

        ((i / 255.0) ** inv_gamma) * 255

        for i in np.arange(0, 256)

    ]).astype("uint8")

    return cv2.LUT(
        image,
        table
    )

# -------------------------------------------------
# Contrast
# -------------------------------------------------

def apply_contrast(
    image,
    value
):

    alpha = 1.0 + (
        value / 100.0
    )

    result = cv2.convertScaleAbs(
        image,
        alpha=alpha,
        beta=0
    )

    return result

# -------------------------------------------------
# Saturation
# -------------------------------------------------

def apply_saturation(
    image,
    value
):

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    hsv = hsv.astype(
        np.float32
    )

    hsv[:, :, 1] *= (
        1 + value / 100.0
    )

    hsv[:, :, 1] = np.clip(
        hsv[:, :, 1],
        0,
        255
    )

    hsv = hsv.astype(
        np.uint8
    )

    return cv2.cvtColor(
        hsv,
        cv2.COLOR_HSV2BGR
    )

# -------------------------------------------------
# Temperature
# -------------------------------------------------

def apply_temperature(
    image,
    value
):

    result = image.astype(
        np.float32
    )

    # BGR
    result[:, :, 2] += value
    result[:, :, 0] -= value * 0.5

    result = np.clip(
        result,
        0,
        255
    )

    return result.astype(
        np.uint8
    )

# -------------------------------------------------
# Shadows
# -------------------------------------------------

def apply_shadows(
    image,
    value
):

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    hsv = hsv.astype(
        np.float32
    )

    dark_mask = hsv[:, :, 2] < 100

    hsv[:, :, 2][dark_mask] *= (
        1 + value / 100.0
    )

    hsv[:, :, 2] = np.clip(
        hsv[:, :, 2],
        0,
        255
    )

    hsv = hsv.astype(
        np.uint8
    )

    return cv2.cvtColor(
        hsv,
        cv2.COLOR_HSV2BGR
    )

# -------------------------------------------------
# Highlights
# -------------------------------------------------

def apply_highlights(
    image,
    value
):

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    hsv = hsv.astype(
        np.float32
    )

    bright_mask = hsv[:, :, 2] > 170

    hsv[:, :, 2][bright_mask] *= (
        1 + value / 100.0
    )

    hsv[:, :, 2] = np.clip(
        hsv[:, :, 2],
        0,
        255
    )

    hsv = hsv.astype(
        np.uint8
    )

    return cv2.cvtColor(
        hsv,
        cv2.COLOR_HSV2BGR
    )

# -------------------------------------------------
# Main Engine
# -------------------------------------------------

def apply_lightroom_edits(
    image,
    edits
):

    output = image.copy()

    for edit in edits:

        slider = edit["slider"]

        value = edit["value"]

        # -----------------------------------------

        if slider == "Exposure":

            output = apply_exposure(
                output,
                value
            )

        # -----------------------------------------

        elif slider == "Contrast":

            output = apply_contrast(
                output,
                value
            )

        # -----------------------------------------

        elif slider == "Saturation":

            output = apply_saturation(
                output,
                value
            )

        # -----------------------------------------

        elif slider == "Temperature":

            output = apply_temperature(
                output,
                value
            )

        # -----------------------------------------

        elif slider == "Shadows":

            output = apply_shadows(
                output,
                value
            )

        # -----------------------------------------

        elif slider == "Highlights":

            output = apply_highlights(
                output,
                value
            )

    return output