def clamp(value):

    return max(
        0.0,
        min(float(value), 1.0)
    )


def select_advanced_masks(

    analysis,

    style_diff,

    scene_data
):

    masks = {}

    # -------------------------------------------------
    # ANALYSIS DATA
    # -------------------------------------------------

    subject_score = analysis.get(
        "subject_score",
        0
    )

    brightness = analysis.get(
        "brightness",
        0
    )

    contrast = analysis.get(
        "contrast",
        0
    )

    sharpness = analysis.get(
        "sharpness",
        0
    )

    # -------------------------------------------------
    # STYLE DIFFERENCE
    # -------------------------------------------------

    warmth_diff = abs(

        style_diff.get(
            "warmth_diff",
            0
        )
    )

    saturation_diff = abs(

        style_diff.get(
            "saturation_diff",
            0
        )
    )

    # -------------------------------------------------
    # SCENE UNDERSTANDING
    # -------------------------------------------------

    face_detected = scene_data.get(
        "face_detected",
        False
    )

    light_direction = scene_data.get(
        "light_direction",
        "balanced"
    )

    subject_position = scene_data.get(
        "subject_position",
        "center"
    )

    background_complexity = scene_data.get(
        "background_complexity",
        0.5
    )

    # =================================================
    # SUBJECT MASK
    # =================================================

    subject_mask = (

        subject_score * 0.6 +

        sharpness * 0.2 +

        (1 - background_complexity) * 0.2
    )

    masks["subject_mask"] = float(
        round(
            clamp(subject_mask),
            3
        )
    )

    # =================================================
    # FACE MASK
    # =================================================

    if face_detected:

        face_mask = (

            0.7 +

            brightness * 0.1 +

            sharpness * 0.2
        )

        masks["face_mask"] = float(
            round(
                clamp(face_mask),
                3
            )
        )

    # =================================================
    # BACKGROUND MASK
    # =================================================

    background_mask = (

        (1 - subject_score) * 0.3 +

        contrast * 0.2 +

        (1 - background_complexity) * 0.5
    )

    masks["background_mask"] = float(
        round(
            clamp(background_mask),
            3
        )
    )

    # =================================================
    # RADIAL MASK
    # =================================================

    radial_mask = (

        subject_score * 0.5 +

        brightness * 0.2 +

        (1 - background_complexity) * 0.3
    )

    masks["radial_mask"] = float(
        round(
            clamp(radial_mask),
            3
        )
    )

    # =================================================
    # LUMINANCE MASK
    # =================================================

    luminance_mask = (

        contrast * 0.5 +

        brightness * 0.5
    )

    masks["luminance_mask"] = float(
        round(
            clamp(luminance_mask),
            3
        )
    )

    # =================================================
    # WARMTH MASK
    # =================================================

    warmth_mask = (

        warmth_diff / 100
    )

    masks["warmth_mask"] = float(
        round(
            clamp(warmth_mask),
            3
        )
    )

    # =================================================
    # LINEAR GRADIENT MASK
    # =================================================

    linear_gradient = (

        contrast * 0.3 +

        saturation_diff * 0.3 +

        brightness * 0.4
    )

    masks["linear_gradient"] = float(
        round(
            clamp(linear_gradient),
            3
        )
    )

    # =================================================
    # LIGHT DIRECTION MASKS
    # =================================================

    if light_direction == "left":

        masks["left_light_mask"] = 0.88

    elif light_direction == "right":

        masks["right_light_mask"] = 0.88

    # =================================================
    # SUBJECT ISOLATION MASK
    # =================================================

    if background_complexity < 0.1:

        isolation_score = (

            1 - background_complexity
        )

        masks["subject_isolation_mask"] = float(
            round(
                clamp(isolation_score),
                3
            )
        )

    # =================================================
    # CINEMATIC MASK
    # =================================================

    cinematic_score = (

        (1 - brightness) * 0.4 +

        contrast * 0.3 +

        (1 - background_complexity) * 0.3
    )

    masks["cinematic_mask"] = float(
        round(
            clamp(cinematic_score),
            3
        )
    )

    # =================================================
    # SORT MASKS
    # =================================================

    sorted_masks = dict(

        sorted(

            masks.items(),

            key=lambda x: x[1],

            reverse=True
        )
    )

    return sorted_masks