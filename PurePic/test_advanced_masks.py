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
# Analyze Target
# -------------------------------------------------

analysis = analyze_image(target)

# -------------------------------------------------
# Compare Styles
# -------------------------------------------------

style_results = compare_styles(
    reference,
    target
)

style_diff = style_results["style_diff"]

# -------------------------------------------------
# Compute Advanced Scores
# -------------------------------------------------

scores = compute_advanced_mask_scores(
    analysis,
    style_diff
)

# -------------------------------------------------
# Print Scores
# -------------------------------------------------

print("\n--- ADVANCED MASK SCORES ---\n")

for k, v in scores.items():
    print(f"{k}: {v}")

# -------------------------------------------------
# Top Masks
# -------------------------------------------------

top_masks = get_top_masks(scores)

print("\n--- TOP RECOMMENDATIONS ---\n")

for name, score in top_masks:
    print(f"{name}: {score}")