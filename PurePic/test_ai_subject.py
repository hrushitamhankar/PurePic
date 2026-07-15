import cv2
import sys
import os
import numpy as np

BASE_DIR = os.path.dirname(__file__)

SRC_PATH = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_PATH)

from masking.ai_subject_detector import (
    detect_subject_mask
)

# -------------------------------------------------
# Load Image
# -------------------------------------------------

img = cv2.imread("target.jpg")

if img is None:
    print("Image not found")
    exit()

# -------------------------------------------------
# Detect Subject
# -------------------------------------------------

mask = detect_subject_mask(img)

# -------------------------------------------------
# Save Output
# -------------------------------------------------

debug = (mask * 255).astype(np.uint8)

cv2.imwrite(
    "ai_subject_mask.jpg",
    debug
)

print("\nAI subject mask generated.")