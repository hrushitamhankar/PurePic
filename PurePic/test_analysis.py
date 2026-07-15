import cv2
import sys
import os

BASE_DIR = os.path.dirname(__file__)
SRC_PATH = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_PATH)

from analysis.analyzer import analyze_image

img = cv2.imread("target.jpg")

if img is None:
    print("Error loading image")
    exit()

analysis = analyze_image(img)

print("\n--- ANALYSIS OUTPUT ---\n")

for k, v in analysis.items():
    print(f"{k}: {v}")