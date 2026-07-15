import cv2
import numpy as np

# ---------------------------------------------------
# Soft Feather Mask
# ---------------------------------------------------

def feather_mask(

    mask,

    blur_size=81
):

    # Ensure odd kernel
    if blur_size % 2 == 0:

        blur_size += 1

    blurred = cv2.GaussianBlur(

        mask,

        (blur_size, blur_size),

        0
    )

    normalized = blurred.astype(
        np.float32
    ) / 255.0

    return normalized

# ---------------------------------------------------
# Protect Highlights
# ---------------------------------------------------

def highlight_rolloff(

    image,

    strength=0.7
):

    image_float = image.astype(
        np.float32
    ) / 255.0

    rolled = np.power(

        image_float,

        strength
    )

    rolled = np.clip(

        rolled,

        0,

        1
    )

    return (
        rolled * 255
    ).astype(np.uint8)

# ---------------------------------------------------
# Cinematic Contrast Curve
# ---------------------------------------------------

def cinematic_curve(

    image
):

    image_float = image.astype(
        np.float32
    ) / 255.0

    curved = np.where(

        image_float < 0.5,

        2 * image_float * image_float,

        1 - np.power(
            -2 * image_float + 2,
            2
        ) / 2
    )

    curved = np.clip(

        curved,

        0,

        1
    )

    return (
        curved * 255
    ).astype(np.uint8)

# ---------------------------------------------------
# Preserve Skin Tones
# ---------------------------------------------------

def preserve_skin_tones(

    image,

    max_saturation=1.15
):

    hsv = cv2.cvtColor(

        image,

        cv2.COLOR_BGR2HSV
    )

    hsv = hsv.astype(
        np.float32
    )

    hsv[:, :, 1] *= max_saturation

    hsv[:, :, 1] = np.clip(

        hsv[:, :, 1],

        0,

        255
    )

    hsv = hsv.astype(np.uint8)

    result = cv2.cvtColor(

        hsv,

        cv2.COLOR_HSV2BGR
    )

    return result