import cv2
import numpy as np

# ---------------------------------------------------
# Blend Original + Edited
# ---------------------------------------------------

def blend_with_original(

    original,

    edited,

    strength=0.72
):

    original = original.astype(
        np.float32
    )

    edited = edited.astype(
        np.float32
    )

    blended = cv2.addWeighted(

        original,

        1.0 - strength,

        edited,

        strength,

        0
    )

    blended = np.clip(

        blended,

        0,

        255
    )

    return blended.astype(np.uint8)