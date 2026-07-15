import cv2
import sys
import os
import numpy as np

BASE_DIR = os.path.dirname(__file__)

SRC_PATH = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_PATH)

from analysis.analyzer import analyze_image

from analysis.style_analyzer import compare_styles

from masking.advanced_mask_selector import (
    compute_advanced_mask_scores,
    get_top_masks
)

from masking.advanced_region_detector import (
    detect_advanced_regions
)

# -------------------------------------------------
# Load Images
# -------------------------------------------------

reference = cv2.imread("reference.jpg")

target = cv2.imread("target.jpg")

if reference is None:
    print("Reference image not found")
    exit()

if target is None:
    print("Target image not found")
    exit()

# -------------------------------------------------
# Analyze
# -------------------------------------------------

analysis = analyze_image(target)

# -------------------------------------------------
# Style Comparison
# -------------------------------------------------

style_results = compare_styles(
    reference,
    target
)

style_diff = style_results["style_diff"]

# -------------------------------------------------
# Advanced Mask Scores
# -------------------------------------------------

scores = compute_advanced_mask_scores(
    analysis,
    style_diff
)

top_masks = get_top_masks(scores)

# -------------------------------------------------
# Detect Regions
# -------------------------------------------------

regions = detect_advanced_regions(
    target,
    top_masks
)

# -------------------------------------------------
# Save Debug Outputs
# -------------------------------------------------

for name, data in regions.items():

    mask = data["mask"]

    debug = (mask * 255).astype(np.uint8)

    cv2.imwrite(f"{name}.jpg", debug)

print("\nAdvanced regions generated successfully.")