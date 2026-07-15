import cv2
import sys
import os

BASE_DIR = os.path.dirname(__file__)
SRC_PATH = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_PATH)

from analysis.analyzer import analyze_image

from masking.mask_selector import (
    compute_mask_scores,
    get_top_masks
)

from masking.instruction_generator import (
    generate_instructions
)

# -------------------------------------------------
# Load image
# -------------------------------------------------

img = cv2.imread("target.jpg")

if img is None:
    print("Error loading image")
    exit()

# -------------------------------------------------
# Analyze image
# -------------------------------------------------

analysis = analyze_image(img)

print("\n--- ANALYSIS ---\n")

for k, v in analysis.items():
    print(f"{k}: {v}")

# -------------------------------------------------
# Mask scores
# -------------------------------------------------

mask_scores = compute_mask_scores(analysis)

print("\n--- MASK SCORES ---\n")

for k, v in mask_scores.items():
    print(f"{k}: {v}")

# -------------------------------------------------
# Top masks
# -------------------------------------------------

top_masks = get_top_masks(mask_scores)

print("\n--- TOP MASKS ---\n")

for name, score in top_masks:
    print(f"{name}: {score}")

# -------------------------------------------------
# Instructions
# -------------------------------------------------

instructions = generate_instructions(
    top_masks,
    analysis
)

print("\n--- EDITING INSTRUCTIONS ---\n")

for item in instructions:

    print(f"\n{item['mask']} ({item['score']})")

    for step in item["steps"]:
        print(f"  → {step}")