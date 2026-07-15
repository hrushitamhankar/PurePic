import cv2
import sys
import os
import numpy as np

BASE_DIR = os.path.dirname(__file__)
SRC_PATH = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_PATH)

from masking.region_detector import detect_regions

# -------------------------------------------------
# Load image
# -------------------------------------------------

img = cv2.imread("target.jpg")

if img is None:
    print("Error loading image")
    exit()

# -------------------------------------------------
# Detect regions
# -------------------------------------------------

regions = detect_regions(img)

# -------------------------------------------------
# Save masks for debugging
# -------------------------------------------------

for name, mask in regions.items():

    debug_img = (mask * 255).astype(np.uint8)

    cv2.imwrite(f"{name}.jpg", debug_img)

print("\nRegion masks generated successfully.")