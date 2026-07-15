import cv2
import sys
import os

# Add src path properly
BASE_DIR = os.path.dirname(__file__)
SRC_PATH = os.path.join(BASE_DIR, "src")
sys.path.append(SRC_PATH)

from editing.pipeline import apply_style

ref = cv2.imread("reference.jpg")
tgt = cv2.imread("target.jpg")

print("Loaded:", ref is not None, tgt is not None)

output = apply_style(ref, tgt)

cv2.imwrite("output.jpg", output)

print("Done. Output saved.")