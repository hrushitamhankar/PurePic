from utils.image_io import load_image

# -------------------------------------------------
# Analysis
# -------------------------------------------------

from analysis.analyzer import (
    analyze_image
)

# -------------------------------------------------
# Style Analysis
# -------------------------------------------------

from analysis.style_analyzer import (
    compare_styles
)

# -------------------------------------------------
# Advanced Mask Selection
# -------------------------------------------------

from masking.advanced_mask_selector import (
    select_advanced_masks
)

# -------------------------------------------------
# Structured Mask Builder
# -------------------------------------------------

from masking.mask_builder import (
    build_masks
)

# -------------------------------------------------
# Visualization
# -------------------------------------------------

from masking.overlay_renderer import (
    render_overlays
)

# -------------------------------------------------
# Full PurePic Pipeline
# -------------------------------------------------

def run_pipeline(

    target_image_path,

    reference_image_path=None
):

    # =================================================
    # LOAD IMAGES
    # =================================================

    target_image = load_image(
        target_image_path
    )

    reference_image = None

    if reference_image_path is not None:

        reference_image = load_image(
            reference_image_path
        )

    # =================================================
    # IMAGE ANALYSIS
    # =================================================

    analysis = analyze_image(
        target_image
    )

    # =================================================
    # SCENE DATA
    #
    # Analyzer V2 already performs scene understanding.
    # Keep a local alias for compatibility.
    # =================================================

    scene_data = analysis.get(
        "scene",
        {}
    )

    # =================================================
    # STYLE COMPARISON
    # =================================================

    style_diff = {}

    if reference_image is not None:

        style_diff = compare_styles(

            target_image,

            reference_image
        )

    # =================================================
    # ADVANCED MASK SELECTION
    # =================================================

    mask_scores = select_advanced_masks(

        analysis,

        style_diff

    )

    # =================================================
    # TOP MASKS
    # =================================================

    top_masks = sorted(

        mask_scores.items(),

        key=lambda x: x[1],

        reverse=True

    )[:6]

    # =================================================
    # STRUCTURED MASK OBJECTS
    # =================================================

    structured_masks = build_masks(

        top_masks,

        scene_data

    )

    # =================================================
    # VISUALIZATION
    # =================================================

    visualization = render_overlays(

        target_image,

        structured_masks

    )

    # =================================================
    # FINAL OUTPUT
    # =================================================

    return {

        # ---------------------------------------------
        # Complete Analysis
        # ---------------------------------------------

        "analysis": analysis,

        # ---------------------------------------------
        # Scene (Compatibility)
        # ---------------------------------------------

        "scene_data": scene_data,

        # ---------------------------------------------
        # Style Difference
        # ---------------------------------------------

        "style_diff": style_diff,

        # ---------------------------------------------
        # Raw Mask Scores
        # ---------------------------------------------

        "mask_scores": mask_scores,

        # ---------------------------------------------
        # Top Masks
        # ---------------------------------------------

        "top_masks": top_masks,

        # ---------------------------------------------
        # Structured Masks
        # ---------------------------------------------

        "structured_masks": structured_masks,

        # ---------------------------------------------
        # Visualization
        # ---------------------------------------------

        "visualization": visualization

    }