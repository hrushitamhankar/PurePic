import cv2
import sys
import os

BASE_DIR = os.path.dirname(__file__)

SRC_PATH = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_PATH)

from pipeline.full_pipeline import (
    run_pipeline
)

# -------------------------------------------------
# Run Full Pipeline
# -------------------------------------------------

results = run_pipeline(

    target_image_path="target.jpg",

    reference_image_path="reference.jpg"
)

# -------------------------------------------------
# Print Analysis
# -------------------------------------------------

print("\n--- ANALYSIS ---\n")

for k, v in results["analysis"].items():
    print(f"{k}: {v}")

# -------------------------------------------------
# Print Style Diff
# -------------------------------------------------

print("\n--- STYLE DIFFERENCE ---\n")

if results["style_diff"] is not None:

    for k, v in results["style_diff"].items():
        print(f"{k}: {v}")

# -------------------------------------------------
# Print Top Masks
# -------------------------------------------------

print("\n--- TOP MASKS ---\n")

for name, score in results["top_masks"]:
    print(f"{name}: {score}")

# -------------------------------------------------
# Print Instructions
# -------------------------------------------------

print("\n--- INSTRUCTIONS ---\n")

for instruction in results["instructions"]:

    print(instruction)

# -------------------------------------------------
# Save Visualization
# -------------------------------------------------

cv2.imwrite(
    "pipeline_output.jpg",
    results["visualization"]
)

print("\nPipeline visualization saved.")