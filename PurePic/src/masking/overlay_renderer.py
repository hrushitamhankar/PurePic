import cv2
import numpy as np

# -------------------------------------------------
# Overlay Utility
# -------------------------------------------------

def blend_overlay(

    image,

    mask,

    color,

    alpha=0.35
):

    overlay = image.copy()

    colored = np.zeros_like(image)

    colored[:] = color

    mask_3ch = cv2.merge([
        mask,
        mask,
        mask
    ])

    overlay = np.where(

        mask_3ch > 0,

        cv2.addWeighted(

            image,

            1 - alpha,

            colored,

            alpha,

            0
        ),

        image
    )

    return overlay.astype(np.uint8)

# -------------------------------------------------
# Ellipse Mask
# -------------------------------------------------

def ellipse_mask(

    image,

    bbox
):

    h, w = image.shape[:2]

    mask = np.zeros(
        (h, w),
        dtype=np.float32
    )

    x1, y1, x2, y2 = bbox

    center_x = int((x1 + x2) / 2)
    center_y = int((y1 + y2) / 2)

    axis_x = int((x2 - x1) * 0.6)
    axis_y = int((y2 - y1) * 0.8)

    cv2.ellipse(

        mask,

        (center_x, center_y),

        (axis_x, axis_y),

        0,

        0,

        360,

        1,

        -1
    )

    mask = cv2.GaussianBlur(

        mask,

        (91, 91),

        0
    )

    return mask

# -------------------------------------------------
# Left Gradient
# -------------------------------------------------

def left_gradient_mask(h, w):

    gradient = np.tile(

        np.linspace(1, 0, w),

        (h, 1)
    )

    return gradient.astype(np.float32)

# -------------------------------------------------
# Right Gradient
# -------------------------------------------------

def right_gradient_mask(h, w):

    gradient = np.tile(

        np.linspace(0, 1, w),

        (h, 1)
    )

    return gradient.astype(np.float32)

# -------------------------------------------------
# Radial Subject Mask
# -------------------------------------------------

def radial_subject_mask(image):

    h, w = image.shape[:2]

    mask = np.zeros(
        (h, w),
        dtype=np.float32
    )

    center_x = w // 2
    center_y = h // 2

    radius = min(h, w) // 3

    cv2.circle(

        mask,

        (center_x, center_y),

        radius,

        1,

        -1
    )

    mask = cv2.GaussianBlur(

        mask,

        (151, 151),

        0
    )

    return mask

# -------------------------------------------------
# Vignette Mask
# -------------------------------------------------

def vignette_mask(image):

    h, w = image.shape[:2]

    mask = np.zeros(
        (h, w),
        dtype=np.float32
    )

    cv2.circle(

        mask,

        (w // 2, h // 2),

        min(h, w) // 3,

        1,

        -1
    )

    mask = cv2.GaussianBlur(

        mask,

        (201, 201),

        0
    )

    mask = 1 - mask

    return mask

# -------------------------------------------------
# Main Renderer
# -------------------------------------------------

def render_overlays(

    image,

    structured_masks
):

    output = image.copy()

    h, w = image.shape[:2]

    # -------------------------------------------------
    # Render Each Mask
    # -------------------------------------------------

    for mask in structured_masks:

        mask_type = mask["mask_type"]

        color = tuple(
            mask["overlay"]["color"]
        )

        opacity = mask["overlay"]["opacity"]

        region = mask["region"]

        region_type = region["type"]

        region_data = region["data"]

        # =================================================
        # FACE MASK
        # =================================================

        if region_type == "ellipse":

            bbox = region_data["bbox"]

            m = ellipse_mask(
                image,
                bbox
            )

            output = blend_overlay(

                output,

                m,

                color,

                opacity
            )

        # =================================================
        # LEFT GRADIENT
        # =================================================

        elif region_type == "gradient_left":

            m = left_gradient_mask(
                h,
                w
            )

            output = blend_overlay(

                output,

                m,

                color,

                opacity
            )

        # =================================================
        # RIGHT GRADIENT
        # =================================================

        elif region_type == "gradient_right":

            m = right_gradient_mask(
                h,
                w
            )

            output = blend_overlay(

                output,

                m,

                color,

                opacity
            )

        # =================================================
        # RADIAL SUBJECT
        # =================================================

        elif region_type == "radial":

            m = radial_subject_mask(
                image
            )

            output = blend_overlay(

                output,

                m,

                color,

                opacity
            )

        # =================================================
        # VIGNETTE
        # =================================================

        elif region_type == "vignette":

            m = vignette_mask(
                image
            )

            output = blend_overlay(

                output,

                m,

                color,

                opacity
            )

    return output