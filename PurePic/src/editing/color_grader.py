import cv2
import numpy as np

# ---------------------------------------------------
# Teal Orange Cinematic Grade
# ---------------------------------------------------

def apply_teal_orange_grade(

    image,

    strength=0.3
):

    img = image.astype(
        np.float32
    ) / 255.0

    b, g, r = cv2.split(img)

    # Shadows → teal
    b += strength * 0.08
    g += strength * 0.04

    # Highlights → warm
    r += strength * 0.08

    graded = cv2.merge([

        b,

        g,

        r
    ])

    graded = np.clip(

        graded,

        0,

        1
    )

    return (
        graded * 255
    ).astype(np.uint8)

# ---------------------------------------------------
# Matte Film Look
# ---------------------------------------------------

def apply_matte_look(

    image,

    lift=18
):

    lut = np.arange(
        256,
        dtype=np.uint8
    )

    lut = np.clip(

        ((lut / 255.0) ** 0.92)
        * 255
        + lift,

        0,

        255
    ).astype(np.uint8)

    result = cv2.LUT(
        image,
        lut
    )

    return result

# ---------------------------------------------------
# Film Fade
# ---------------------------------------------------

def apply_film_fade(

    image,

    fade_strength=0.08
):

    img = image.astype(
        np.float32
    ) / 255.0

    faded = img * (
        1 - fade_strength
    ) + fade_strength

    faded = np.clip(

        faded,

        0,

        1
    )

    return (
        faded * 255
    ).astype(np.uint8)

# ---------------------------------------------------
# Soft Bloom
# ---------------------------------------------------

def apply_bloom(

    image,

    intensity=0.15
):

    blur = cv2.GaussianBlur(

        image,

        (0, 0),

        15
    )

    bloomed = cv2.addWeighted(

        image,

        1.0,

        blur,

        intensity,

        0
    )

    bloomed = np.clip(

        bloomed,

        0,

        255
    )

    return bloomed.astype(np.uint8)