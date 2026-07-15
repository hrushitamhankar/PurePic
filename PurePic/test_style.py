import cv2
import sys
import os

BASE_DIR = os.path.dirname(__file__)

SRC_PATH = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_PATH)

from analysis.style_analyzer import compare_styles


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
# Compare Styles
# -------------------------------------------------

results = compare_styles(
    reference,
    target
)

# -------------------------------------------------
# Print Results
# -------------------------------------------------

print("\n--- STYLE DIFFERENCE ---\n")

for k, v in results["style_diff"].items():
    print(f"{k}: {v}")