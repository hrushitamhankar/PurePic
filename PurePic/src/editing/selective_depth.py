import cv2
import numpy as np

# ---------------------------------------------------
# Reduce Green Dominance
# ---------------------------------------------------

def reduce_green_dominance(

    image,

    reduction=0.90
):

    hsv = cv2.cvtColor(

        image,

        cv2.COLOR_BGR2HSV
    )

    hsv = hsv.astype(
        np.float32
    )

    hue = hsv[:, :, 0]
    sat = hsv[:, :, 1]

    # Green range

    green_mask = (

        (hue > 35)
        &
        (hue < 95)
    )

    sat[green_mask] *= reduction

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
# Add Subject Contrast
# ---------------------------------------------------

def add_subject_pop(

    image
):

    blurred = cv2.GaussianBlur(

        image,

        (0, 0),

        8
    )

    sharpened = cv2.addWeighted(

        image,

        1.12,

        blurred,

        -0.12,

        0
    )

    sharpened = np.clip(

        sharpened,

        0,

        255
    )

    return sharpened.astype(np.uint8)

# ---------------------------------------------------
# Cinematic Density
# ---------------------------------------------------

def cinematic_density(

    image
):

    img = image.astype(
        np.float32
    ) / 255.0

    img *= 0.97

    img = np.clip(

        img,

        0,

        1
    )

    return (
        img * 255
    ).astype(np.uint8)