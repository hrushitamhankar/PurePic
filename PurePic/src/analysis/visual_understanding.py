import numpy as np


# -------------------------------------------------
# Utility
# -------------------------------------------------

def calculate_region_ratio(
    semantic_regions,
    region_name
):

    if region_name not in semantic_regions:
        return 0.0

    mask = semantic_regions[region_name]

    if mask is None:
        return 0.0

    return float(
        np.count_nonzero(mask)
        / mask.size
    )


# -------------------------------------------------
# Main Visual Understanding
# -------------------------------------------------

def understand_visual_content(

    scene_data,
    semantic_regions,
    technical_data=None,
    aesthetic_data=None
):

    if technical_data is None:
        technical_data = {}

    if aesthetic_data is None:
        aesthetic_data = {}

    skin_ratio = calculate_region_ratio(
        semantic_regions,
        "skin_region"
    )

    texture_ratio = calculate_region_ratio(
        semantic_regions,
        "texture_region"
    )

    dark_ratio = calculate_region_ratio(
        semantic_regions,
        "dark_region"
    )

    highlight_ratio = calculate_region_ratio(
        semantic_regions,
        "highlight_region"
    )

    face_detected = scene_data.get(
        "face_detected",
        False
    )

    background_complexity = scene_data.get(
        "background_complexity",
        0
    )

    subject_position = scene_data.get(
        "subject_position",
        "unknown"
    )

    # -----------------------------------------
    # Candidate Genres
    # -----------------------------------------

    candidates = {}

    # Portrait candidate
    portrait_score = 0.0

    if face_detected:
        portrait_score += 0.5

    portrait_score += (
        skin_ratio * 2.0
    )

    if subject_position == "center":
        portrait_score += 0.2

    candidates["portrait"] = round(
        portrait_score,
        3
    )

    # Landscape candidate
    landscape_score = 0.0

    if not face_detected:
        landscape_score += 0.3

    landscape_score += (
        background_complexity
    )

    candidates["landscape"] = round(
        landscape_score,
        3
    )

    # Wildlife candidate
    wildlife_score = 0.0

    wildlife_score += (
        texture_ratio
    )

    wildlife_score += (
        background_complexity * 0.5
    )

    candidates["wildlife"] = round(
        wildlife_score,
        3
    )

    # Architecture candidate
    architecture_score = (
        background_complexity
        + texture_ratio
        - skin_ratio
    )

    candidates["architecture"] = round(
        architecture_score,
        3
    )

    # Product candidate
    product_score = 0.0

    if subject_position == "center":
        product_score += 0.3

    if background_complexity < 0.15:
        product_score += 0.4

    candidates["product"] = round(
        product_score,
        3
    )

    # -----------------------------------------
    # Sort Candidates
    # -----------------------------------------

    sorted_candidates = sorted(
        candidates.items(),
        key=lambda x: x[1],
        reverse=True
    )

    primary_genre = (
        sorted_candidates[0][0]
    )

    confidence = (
        sorted_candidates[0][1]
    )

    return {

        "primary_genre":
            primary_genre,

        "confidence":
            round(
                confidence,
                3
            ),

        "candidate_scores":
            candidates,

        "scene_context": {

            "face_detected":
                face_detected,

            "subject_position":
                subject_position,

            "background_complexity":
                background_complexity,

            "skin_ratio":
                round(
                    skin_ratio,
                    3
                ),

            "texture_ratio":
                round(
                    texture_ratio,
                    3
                ),

            "dark_ratio":
                round(
                    dark_ratio,
                    3
                ),

            "highlight_ratio":
                round(
                    highlight_ratio,
                    3
                )
        }
    }