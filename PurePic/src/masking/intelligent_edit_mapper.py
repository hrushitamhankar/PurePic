def map_intelligent_edits(
    semantic_regions,
    style_data,
    scene_data
):

    recommendations = []

    # -----------------------------------
    # STYLE VALUES
    # -----------------------------------

    warmth_diff = style_data.get(
        "warmth_diff",
        0
    )

    contrast_diff = style_data.get(
        "contrast_diff",
        0
    )

    brightness_diff = style_data.get(
        "brightness_diff",
        0
    )

    sharpness_diff = style_data.get(
        "sharpness_diff",
        0
    )

    saturation_diff = style_data.get(
        "saturation_diff",
        0
    )

    # -----------------------------------
    # SCENE VALUES
    # -----------------------------------

    face_detected = scene_data.get(
        "face_detected",
        False
    )

    light_direction = scene_data.get(
        "light_direction",
        "unknown"
    )

    # -----------------------------------
    # SKIN REGION
    # -----------------------------------

    if "skin_region" in semantic_regions:

        edits = []

        if warmth_diff > 10:

            edits.append(
                "Increase Temperature (+15)"
            )

            edits.append(
                "Increase Vibrance (+10)"
            )

        if brightness_diff > 0:

            edits.append(
                "Increase Exposure (+0.3)"
            )

        if contrast_diff > 0:

            edits.append(
                "Increase Contrast (+10)"
            )

        edits.append(
            "Reduce Texture (-10)"
        )

        recommendations.append({

            "region": "Skin Region",

            "edits": edits
        })

    # -----------------------------------
    # HIGHLIGHT REGION
    # -----------------------------------

    if "highlight_region" in semantic_regions:

        edits = []

        edits.append(
            "Increase Highlights (+20)"
        )

        edits.append(
            "Increase Clarity (+15)"
        )

        edits.append(
            "Increase Sharpening (+20)"
        )

        if sharpness_diff > 0:

            edits.append(
                "Enhance Detail"
            )

        recommendations.append({

            "region": "Highlight Region",

            "edits": edits
        })

    # -----------------------------------
    # DARK REGION
    # -----------------------------------

    if "dark_region" in semantic_regions:

        edits = []

        edits.append(
            "Deepen Shadows (-20)"
        )

        edits.append(
            "Add Cinematic Contrast"
        )

        edits.append(
            "Reduce Blacks (-10)"
        )

        recommendations.append({

            "region": "Dark Region",

            "edits": edits
        })

    # -----------------------------------
    # TEXTURE REGION
    # -----------------------------------

    if "texture_region" in semantic_regions:

        edits = []

        edits.append(
            "Increase Texture (+20)"
        )

        edits.append(
            "Increase Clarity (+10)"
        )

        edits.append(
            "Enhance Fine Details"
        )

        recommendations.append({

            "region": "Texture Region",

            "edits": edits
        })

    # -----------------------------------
    # FACE-AWARE EDITS
    # -----------------------------------

    if face_detected:

        recommendations.append({

            "region": "Face Enhancement",

            "edits": [

                "Brighten Face Slightly",

                "Enhance Eyes",

                "Smooth Skin",

                "Increase Facial Contrast"
            ]
        })

    # -----------------------------------
    # LIGHT DIRECTION LOGIC
    # -----------------------------------

    if light_direction == "left":

        recommendations.append({

            "region": "Lighting",

            "edits": [

                "Enhance Left-side Rim Light",

                "Maintain Directional Shadows"
            ]
        })

    return recommendations