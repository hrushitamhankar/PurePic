import cv2
import numpy as np

# ---------------------------------------------------
# Protect Highlights
# ---------------------------------------------------

def compress_highlights(

    image,

    threshold=215,

    compression=0.55
):

    result = image.astype(
        np.float32
    )

    bright_mask = result > threshold

    result[bright_mask] = (

        threshold +

        (result[bright_mask] - threshold)

        * compression
    )

    result = np.clip(

        result,

        0,

        255
    )

    return result.astype(np.uint8)

# ---------------------------------------------------
# Protect Saturation
# ---------------------------------------------------

def protect_saturation(

    image,

    max_sat=185
):

    hsv = cv2.cvtColor(

        image,

        cv2.COLOR_BGR2HSV
    )

    hsv = hsv.astype(
        np.float32
    )

    saturation = hsv[:, :, 1]

    saturation = np.minimum(

        saturation,

        max_sat
    )

    hsv[:, :, 1] = saturation

    hsv = hsv.astype(np.uint8)

    result = cv2.cvtColor(

        hsv,

        cv2.COLOR_HSV2BGR
    )

    return result

# ---------------------------------------------------
# Skin Tone Recovery
# ---------------------------------------------------

def recover_skin(

    image
):

    result = image.astype(
        np.float32
    )

    # Reduce red dominance
    result[:, :, 2] *= 0.96

    # Slight warmth balance
    result[:, :, 1] *= 1.01

    result = np.clip(

        result,

        0,

        255
    )

    return result.astype(np.uint8)