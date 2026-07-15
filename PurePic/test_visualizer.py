import cv2
import sys
import os

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

from masking.visualizer import (
    generate_visualization
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
# Analysis
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
# Region Detection
# -------------------------------------------------

regions = detect_advanced_regions(
    target,
    top_masks
)

# -------------------------------------------------
# Visualization
# -------------------------------------------------

visual = generate_visualization(
    target,
    regions
)

# -------------------------------------------------
# Save Output
# -------------------------------------------------

cv2.imwrite(
    "visualized_masks.jpg",
    visual
)

print("\nVisualization generated successfully.")