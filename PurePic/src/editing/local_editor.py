import cv2
import numpy as np

from editing.tone_mapper import (

    feather_mask,

    highlight_rolloff,

    cinematic_curve,

    preserve_skin_tones
)

from editing.color_grader import (

    apply_teal_orange_grade,

    apply_matte_look,

    apply_film_fade,

    apply_bloom
)

from editing.slider_scaler import (
    scale_slider
)

from editing.color_protection import (

    compress_highlights,

    protect_saturation,

    recover_skin
)

from editing.film_balancer import (

    neutralize_green_cast,

    restore_black_depth,

    soften_highlights,

    luxury_warmth
)

from editing.tone_curve import (

    apply_cinematic_curve,

    protect_skin_highlights,

    apply_soft_contrast
)

from editing.render_strength import (
    blend_with_original
)

from editing.selective_depth import (

    reduce_green_dominance,

    add_subject_pop,

    cinematic_density
)

# ---------------------------------------------------
# Apply Exposure
# ---------------------------------------------------

def apply_exposure(

    image,

    value
):

    factor = 1.0 + (value * 0.15)

    result = image.astype(
        np.float32
    ) * factor

    result = np.clip(
        result,
        0,
        255
    )

    return result.astype(np.uint8)

# ---------------------------------------------------
# Apply Contrast
# ---------------------------------------------------

def apply_contrast(

    image,

    value
):

    factor = 1.0 + (value * 0.02)

    result = image.astype(
        np.float32
    )

    result = (
        (result - 127.5) * factor
    ) + 127.5

    result = np.clip(
        result,
        0,
        255
    )

    return result.astype(np.uint8)

# ---------------------------------------------------
# Apply Highlights
# ---------------------------------------------------

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

    hsv[:, :, 2] += value

    hsv[:, :, 2] = np.clip(

        hsv[:, :, 2],

        0,

        255
    )

    hsv = hsv.astype(np.uint8)

    result = cv2.cvtColor(

        hsv,

        cv2.COLOR_HSV2BGR
    )

    return result

# ---------------------------------------------------
# Apply Saturation
# ---------------------------------------------------

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
        1.0 + (value * 0.01)
    )

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

# ---------------------------------------------------
# Apply Warmth
# ---------------------------------------------------

def apply_temperature(

    image,

    value
):

    result = image.astype(
        np.float32
    )

    result[:, :, 2] += value * 0.8
    result[:, :, 0] -= value * 0.3

    result = np.clip(

        result,

        0,

        255
    )

    return result.astype(np.uint8)

# ---------------------------------------------------
# Apply Clarity
# ---------------------------------------------------

def apply_clarity(

    image,

    value
):

    blur = cv2.GaussianBlur(

        image,

        (0, 0),

        3
    )

    sharpened = cv2.addWeighted(

        image,

        1.0 + (value * 0.02),

        blur,

        -(value * 0.02),

        0
    )

    sharpened = np.clip(

        sharpened,

        0,

        255
    )

    return sharpened.astype(np.uint8)

# ---------------------------------------------------
# Apply Texture
# ---------------------------------------------------

def apply_texture(

    image,

    value
):

    gray = cv2.cvtColor(

        image,

        cv2.COLOR_BGR2GRAY
    )

    edges = cv2.Laplacian(

        gray,

        cv2.CV_64F
    )

    edges = np.absolute(edges)

    edges = np.clip(

        edges,

        0,

        255
    ).astype(np.uint8)

    edges = cv2.cvtColor(

        edges,

        cv2.COLOR_GRAY2BGR
    )

    result = cv2.addWeighted(

        image,

        1.0,

        edges,

        value * 0.01,

        0
    )

    result = np.clip(

        result,

        0,

        255
    )

    return result.astype(np.uint8)

# ---------------------------------------------------
# Apply Local Lightroom Edits
# ---------------------------------------------------

def apply_masked_lightroom_edits(

    image,

    editable_masks
):

    # -----------------------------------------------
    # Preserve Original
    # -----------------------------------------------

    original_image = image.copy()

    # -----------------------------------------------
    # Working Copy
    # -----------------------------------------------

    edited = image.copy()

    # -----------------------------------------------
    # Process Each Mask
    # -----------------------------------------------

    for item in editable_masks:

        mask = item["mask"]

        edits = item["edits"]

        # -------------------------------------------
        # Feather Mask
        # -------------------------------------------

        mask_float = feather_mask(
            mask
        )

        mask_float = np.expand_dims(

            mask_float,

            axis=-1
        )

        local_edit = edited.copy()

        # -------------------------------------------
        # Apply Lightroom Sliders
        # -------------------------------------------

        for slider in edits:

            slider_name = slider["slider"]
            raw_value = slider["value"]

            value = scale_slider(

             slider_name,

             raw_value
            )

            # ---------------------------------------
            # Exposure
            # ---------------------------------------

            if slider_name == "Exposure":

                local_edit = apply_exposure(

                    local_edit,

                    value
                )

            # ---------------------------------------
            # Contrast
            # ---------------------------------------

            elif slider_name == "Contrast":

                local_edit = apply_contrast(

                    local_edit,

                    value
                )

            # ---------------------------------------
            # Highlights
            # ---------------------------------------

            elif slider_name == "Highlights":

                local_edit = apply_highlights(

                    local_edit,

                    value
                )

            # ---------------------------------------
            # Saturation / Vibrance
            # ---------------------------------------

            elif slider_name in [

                "Saturation",

                "Vibrance"
            ]:

                local_edit = apply_saturation(

                    local_edit,

                    value
                )

            # ---------------------------------------
            # Temperature
            # ---------------------------------------

            elif slider_name == "Temperature":

                local_edit = apply_temperature(

                    local_edit,

                    value
                )

            # ---------------------------------------
            # Clarity
            # ---------------------------------------

            elif slider_name == "Clarity":

                local_edit = apply_clarity(

                    local_edit,

                    value
                )

            # ---------------------------------------
            # Texture
            # ---------------------------------------

            elif slider_name == "Texture":

                local_edit = apply_texture(

                    local_edit,

                    value
                )

        # -------------------------------------------
        # Blend Local Edit
        # -------------------------------------------

        edited = (

            edited * (1 - mask_float)

            +

            local_edit * mask_float
        )

        edited = np.clip(

            edited,

            0,

            255
        ).astype(np.uint8)

    # -----------------------------------------------
    # Final Cinematic Polish
    # -----------------------------------------------

    edited = highlight_rolloff(

        edited,

        strength=0.85
    )

    edited = cinematic_curve(
        edited
    )

    edited = preserve_skin_tones(
        edited
    )
    
    edited = apply_teal_orange_grade(
        edited,
        strength=0.25
    )

    edited = apply_matte_look(
        edited,
        lift=12
    )

    edited = apply_film_fade(
        edited,
        fade_strength=0.04
    )

    edited = apply_bloom(
        edited,
        intensity=0.08
    )
    
    edited = compress_highlights(
        edited
    )

    edited = protect_saturation(
        edited
    )

    edited = recover_skin(
        edited
    )
    
    edited = neutralize_green_cast(
        edited
    )

    edited = restore_black_depth(
        edited
    )

    edited = soften_highlights(
        edited
    )

    edited = luxury_warmth(
        edited
    )
    
    edited = apply_cinematic_curve(
        edited
    )

    edited = protect_skin_highlights(
        edited
    )

    edited = apply_soft_contrast(
        edited
    )
    
    edited = reduce_green_dominance(
        edited
    )

    edited = add_subject_pop(
        edited
    )

    edited = cinematic_density(
        edited
    )
    
    edited = blend_with_original(

        original_image,

        edited,

        strength=0.68
    )
    return edited