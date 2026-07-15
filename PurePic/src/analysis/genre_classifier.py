import numpy as np


# -------------------------------------------------
# Main Genre Classifier
# -------------------------------------------------

def classify_genre(
    scene_data,
    semantic_regions,
    metadata=None
):
    """
    Returns:
    {
        "genre": "portrait",
        "confidence": 0.85,
        "secondary_genres": [],
        "reasoning": [...]
    }
    """

    if metadata is None:
        metadata = {}

    reasoning = []

    face_detected = scene_data.get(
        "face_detected",
        False
    )

    subject_position = scene_data.get(
        "subject_position",
        "unknown"
    )

    background_complexity = scene_data.get(
        "background_complexity",
        0
    )

    # -------------------------------------------------
    # Region Sizes
    # -------------------------------------------------

    skin_ratio = calculate_region_ratio(
        semantic_regions,
        "skin_region"
    )

    highlight_ratio = calculate_region_ratio(
        semantic_regions,
        "highlight_region"
    )

    texture_ratio = calculate_region_ratio(
        semantic_regions,
        "texture_region"
    )

    dark_ratio = calculate_region_ratio(
        semantic_regions,
        "dark_region"
    )

    # -------------------------------------------------
    # Portrait
    # -------------------------------------------------

    if (
        face_detected and
        skin_ratio > 0.02
    ):

        reasoning.extend([
            "face_detected",
            "skin_region_present"
        ])

        confidence = 0.75

        if subject_position == "center":
            confidence += 0.1
            reasoning.append(
                "center_subject"
            )

        return {
            "genre": "portrait",
            "confidence": round(
                min(confidence, 0.95),
                2
            ),
            "secondary_genres": [],
            "reasoning": reasoning
        }

    # -------------------------------------------------
    # Landscape
    # -------------------------------------------------

    if (
        not face_detected and
        background_complexity > 0.35
    ):

        reasoning.extend([
            "no_face",
            "complex_background"
        ])

        return {
            "genre": "landscape",
            "confidence": 0.72,
            "secondary_genres": [],
            "reasoning": reasoning
        }

    # -------------------------------------------------
    # Wildlife
    # -------------------------------------------------

    if (
        not face_detected and
        texture_ratio > 0.25 and
        background_complexity > 0.20
    ):

        reasoning.extend([
            "high_texture",
            "natural_scene"
        ])

        return {
            "genre": "wildlife",
            "confidence": 0.65,
            "secondary_genres": [
                "nature"
            ],
            "reasoning": reasoning
        }

    # -------------------------------------------------
    # Product
    # -------------------------------------------------

    if (
        not face_detected and
        subject_position == "center" and
        background_complexity < 0.12
    ):

        reasoning.extend([
            "simple_background",
            "center_subject"
        ])

        return {
            "genre": "product",
            "confidence": 0.68,
            "secondary_genres": [],
            "reasoning": reasoning
        }

    # -------------------------------------------------
    # Architecture
    # -------------------------------------------------

    if (
        not face_detected and
        texture_ratio > 0.15 and
        dark_ratio < 0.15 and
        background_complexity > 0.30
    ):

        reasoning.extend([
            "high_detail_scene",
            "structured_environment"
        ])

        return {
            "genre": "architecture",
            "confidence": 0.60,
            "secondary_genres": [],
            "reasoning": reasoning
        }

    # -------------------------------------------------
    # Food
    # -------------------------------------------------

    if (
        highlight_ratio > 0.15 and
        background_complexity < 0.20 and
        subject_position == "center"
    ):

        reasoning.extend([
            "bright_subject",
            "isolated_subject"
        ])

        return {
            "genre": "food",
            "confidence": 0.55,
            "secondary_genres": [],
            "reasoning": reasoning
        }

    # -------------------------------------------------
    # Street
    # -------------------------------------------------

    if (
        background_complexity > 0.40 and
        dark_ratio > 0.20
    ):

        reasoning.extend([
            "complex_scene",
            "deep_shadows"
        ])

        return {
            "genre": "street",
            "confidence": 0.55,
            "secondary_genres": [],
            "reasoning": reasoning
        }

    # -------------------------------------------------
    # Fallback
    # -------------------------------------------------

    return {
        "genre": "unknown",
        "confidence": 0.30,
        "secondary_genres": [],
        "reasoning": [
            "insufficient_information"
        ]
    }


# -------------------------------------------------
# Utility
# -------------------------------------------------

def calculate_region_ratio(
    semantic_regions,
    region_name
):

    if region_name not in semantic_regions:
        return 0

    mask = semantic_regions[
        region_name
    ]

    if mask is None:
        return 0

    total_pixels = mask.size

    if total_pixels == 0:
        return 0

    active_pixels = np.count_nonzero(
        mask
    )

    return active_pixels / total_pixels