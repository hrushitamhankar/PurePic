import cv2
import numpy as np

SUBJECT_FEATHER_KERNEL = (31, 31)
BACKGROUND_FEATHER_KERNEL = (41, 41)

# -------------------------------------------------
# Overlay Utility
# -------------------------------------------------

def blend_overlay(

    image,

    mask,

    color,

    alpha=0.12
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
        # SEGMENTATION SUBJECT
        # =================================================

        elif region_type == "segmentation":

            binary_mask = region_data.get("binary_mask")

            if binary_mask is None:

                m = radial_subject_mask(
                    image
                )

                output = blend_overlay(

                    output,

                    m,

                    color,

                    opacity
                )

            else:

                if binary_mask.dtype != np.float32:
                    binary_mask = binary_mask.astype(np.float32)

                original_h, original_w = binary_mask.shape[:2]

                # Resize mask if needed
                if binary_mask.shape[:2] != image.shape[:2]:

                    binary_mask = cv2.resize(
                        binary_mask,
                        (image.shape[1], image.shape[0]),
                        interpolation=cv2.INTER_NEAREST
                    )

                display_mask = cv2.GaussianBlur(
                    binary_mask,
                    SUBJECT_FEATHER_KERNEL,
                    0
                )

                output = blend_overlay(
                    output,
                    display_mask,
                    color,
                    opacity
                )

                # ---------------------------------------
                # Generate contour from resized mask
                # ---------------------------------------

                display_mask_uint8 = (display_mask > 0.5).astype(np.uint8)

                contours, _ = cv2.findContours(

                    display_mask_uint8,

                    cv2.RETR_EXTERNAL,

                    cv2.CHAIN_APPROX_SIMPLE
                )

                if contours:

                    largest = max(
                        contours,
                        key=cv2.contourArea
                    )

                    epsilon = 0.002 * cv2.arcLength(largest, True)
                    largest = cv2.approxPolyDP(
                        largest,
                        epsilon,
                        True
                    )

                    thickness = max(
                        1,
                        image.shape[0] // 1800
                    )

                    cv2.drawContours(

                        output,

                        [largest],

                        -1,

                        (255,255,255),

                        thickness,

                        cv2.LINE_AA
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
        # INVERSE SUBJECT
        # =================================================

        elif region_type == "inverse_subject":

            binary_mask = region_data.get("binary_mask")

            if binary_mask is None:
                background_mask = radial_subject_mask(image)
            else:
                if binary_mask.dtype != np.float32:
                    binary_mask = binary_mask.astype(np.float32)

                # Resize mask to match the original image
                if binary_mask.shape[:2] != image.shape[:2]:
                    binary_mask = cv2.resize(
                        binary_mask,
                        (image.shape[1], image.shape[0]),  # (width, height)
                        interpolation=cv2.INTER_NEAREST
                    )

                display_mask = cv2.GaussianBlur(
                    binary_mask,
                    SUBJECT_FEATHER_KERNEL,
                    0
                )

            output = blend_overlay(

                output,

                display_mask,

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