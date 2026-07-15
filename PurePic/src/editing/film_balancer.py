import cv2
import numpy as np

# ---------------------------------------------------
# Neutralize Green Cast
# ---------------------------------------------------

def neutralize_green_cast(

    image,

    strength=0.08
):

    result = image.astype(
        np.float32
    )

    # Reduce green slightly
    result[:, :, 1] *= (
        1.0 - strength
    )

    # Slightly boost red warmth
    result[:, :, 2] *= (
        1.0 + strength * 0.3
    )

    result = np.clip(

        result,

        0,

        255
    )

    return result.astype(np.uint8)

# ---------------------------------------------------
# Restore Black Depth
# ---------------------------------------------------

def restore_black_depth(

    image,

    gamma=1.08
):

    normalized = image.astype(
        np.float32
    ) / 255.0

    corrected = np.power(

        normalized,

        gamma
    )

    corrected = np.clip(

        corrected,

        0,

        1
    )

    return (
        corrected * 255
    ).astype(np.uint8)

# ---------------------------------------------------
# Soft Highlight Recovery
# ---------------------------------------------------

def soften_highlights(

    image,

    threshold=210
):

    result = image.astype(
        np.float32
    )

    mask = result > threshold

    result[mask] *= 0.96

    result = np.clip(

        result,

        0,

        255
    )

    return result.astype(np.uint8)

# ---------------------------------------------------
# Add Luxury Warmth
# ---------------------------------------------------

def luxury_warmth(

    image
):

    result = image.astype(
        np.float32
    )

    # Warm cinematic skin
    result[:, :, 2] *= 1.03

    # Slight gold tone
    result[:, :, 1] *= 1.01

    result = np.clip(

        result,

        0,

        255
    )

    return result.astype(np.uint8)