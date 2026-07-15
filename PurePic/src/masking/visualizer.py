import cv2
import numpy as np

# -------------------------------------------------
# Utility
# -------------------------------------------------

def apply_overlay(

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
# Create Gradient Mask
# -------------------------------------------------

def create_left_gradient(h, w):

    gradient = np.tile(

        np.linspace(1, 0, w),

        (h, 1)
    )

    return gradient

def create_right_gradient(h, w):

    gradient = np.tile(

        np.linspace(0, 1, w),

        (h, 1)
    )

    return gradient

# -------------------------------------------------
# Face Region Mask
# -------------------------------------------------

def create_face_mask(

    image,

    face_bbox
):

    h, w = image.shape[:2]

    mask = np.zeros(
        (h, w),
        dtype=np.float32
    )

    if face_bbox is None:

        return mask

    x1, y1, x2, y2 = face_bbox

    # ---------------------------------------------
    # Draw Ellipse
    # ---------------------------------------------

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

        (81, 81),

        0
    )

    return mask

# -------------------------------------------------
# Subject Isolation Mask
# -------------------------------------------------

def create_subject_isolation_mask(

    image
):

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
# Main Visualizer
# -------------------------------------------------

def visualize_masks(

    image,

    top_masks,

    scene_data
):

    output = image.copy()

    h, w = image.shape[:2]

    # -------------------------------------------------
    # Scene Data
    # -------------------------------------------------

    face_bbox = scene_data.get(
        "face_bbox"
    )

    light_direction = scene_data.get(
        "light_direction"
    )

    # -------------------------------------------------
    # Apply Masks
    # -------------------------------------------------

    for mask_name, score in top_masks:

        # =================================================
        # FACE MASK
        # =================================================

        if mask_name == "face_mask":

            face_mask = create_face_mask(

                image,

                face_bbox
            )

            output = apply_overlay(

                output,

                face_mask,

                color=(0, 255, 0),

                alpha=0.35
            )

        # =================================================
        # LEFT LIGHT MASK
        # =================================================

        elif mask_name == "left_light_mask":

            gradient = create_left_gradient(
                h,
                w
            )

            output = apply_overlay(

                output,

                gradient,

                color=(0, 165, 255),

                alpha=0.25
            )

        # =================================================
        # RIGHT LIGHT MASK
        # =================================================

        elif mask_name == "right_light_mask":

            gradient = create_right_gradient(
                h,
                w
            )

            output = apply_overlay(

                output,

                gradient,

                color=(255, 140, 0),

                alpha=0.25
            )

        # =================================================
        # SUBJECT MASK
        # =================================================

        elif mask_name == "subject_mask":

            isolation = create_subject_isolation_mask(
                image
            )

            output = apply_overlay(

                output,

                isolation,

                color=(255, 255, 0),

                alpha=0.20
            )

        # =================================================
        # BACKGROUND MASK
        # =================================================

        elif mask_name == "background_mask":

            bg_mask = 1 - create_subject_isolation_mask(
                image
            )

            output = apply_overlay(

                output,

                bg_mask,

                color=(255, 0, 0),

                alpha=0.15
            )

        # =================================================
        # WARMTH MASK
        # =================================================

        elif mask_name == "warmth_mask":

            warm_mask = np.ones(
                (h, w),
                dtype=np.float32
            )

            output = apply_overlay(

                output,

                warm_mask,

                color=(0, 140, 255),

                alpha=0.12
            )

        # =================================================
        # CINEMATIC MASK
        # =================================================

        elif mask_name == "cinematic_mask":

            vignette = np.zeros(
                (h, w),
                dtype=np.float32
            )

            cv2.circle(

                vignette,

                (w // 2, h // 2),

                min(h, w) // 3,

                1,

                -1
            )

            vignette = cv2.GaussianBlur(

                vignette,

                (201, 201),

                0
            )

            vignette = 1 - vignette

            output = apply_overlay(

                output,

                vignette,

                color=(0, 0, 0),

                alpha=0.25
            )

    return output