# -------------------------------------------------
# PurePic Mask Scoring Engine
# -------------------------------------------------

def clamp(value, min_val=0.0, max_val=1.0):
    return max(min_val, min(value, max_val))


# -------------------------------------------------
# Main Scoring Function
# -------------------------------------------------

def compute_mask_scores(analysis):

    subject_score = analysis["subject_score"]
    brightness = analysis["brightness"]
    contrast = analysis["contrast"]
    sharpness = analysis["sharpness"]
    intent = analysis["intent"]

    # -------------------------------------------------
    # SUBJECT MASK SCORE
    # -------------------------------------------------
    #
    # Strong subject + sharp image
    #

    subject_mask_score = (
        subject_score * 0.7 +
        sharpness * 0.3
    )

    # -------------------------------------------------
    # BACKGROUND MASK SCORE
    # -------------------------------------------------
    #
    # Strong subject + darker image
    #

    background_mask_score = (
        subject_score * 0.6 +
        (1 - brightness) * 0.4
    )

    # -------------------------------------------------
    # RADIAL MASK SCORE
    # -------------------------------------------------
    #
    # Strong subject + low brightness
    # usually benefits from glow/light focus
    #

    radial_mask_score = (
        subject_score * 0.5 +
        (1 - brightness) * 0.5
    )

    # -------------------------------------------------
    # LUMINANCE MASK SCORE
    # -------------------------------------------------
    #
    # Low contrast images benefit more
    #

    luminance_mask_score = (
        1 - contrast
    )

    # -------------------------------------------------
    # LINEAR GRADIENT SCORE
    # -------------------------------------------------
    #
    # General scenes / landscapes
    #

    if intent == "general":
        linear_gradient_score = 0.5 + ((1 - contrast) * 0.3)
    else:
        linear_gradient_score = 0.2

    # -------------------------------------------------
    # SKY MASK SCORE (future placeholder)
    # -------------------------------------------------

    sky_mask_score = 0.1

    # -------------------------------------------------
    # Clamp values
    # -------------------------------------------------

    scores = {

        "subject_mask":
            round(clamp(subject_mask_score), 3),

        "background_mask":
            round(clamp(background_mask_score), 3),

        "radial_mask":
            round(clamp(radial_mask_score), 3),

        "luminance_mask":
            round(clamp(luminance_mask_score), 3),

        "linear_gradient":
            round(clamp(linear_gradient_score), 3),

        "sky_mask":
            round(clamp(sky_mask_score), 3)
    }

    return scores


# -------------------------------------------------
# Ranking Function
# -------------------------------------------------

def get_top_masks(mask_scores, top_k=3):

    sorted_masks = sorted(
        mask_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return sorted_masks[:top_k]