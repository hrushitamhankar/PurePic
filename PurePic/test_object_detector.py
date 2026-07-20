"""
======================================================
PurePic Object Detector Test
======================================================
"""

import os
import sys
import cv2

# ---------------------------------------------------
# Add src to python path
# ---------------------------------------------------

BASE_DIR = os.path.dirname(__file__)

SRC_DIR = os.path.join(BASE_DIR, "src")

sys.path.append(SRC_DIR)

# ---------------------------------------------------
# Import Detector
# ---------------------------------------------------

from analysis.object_detector import (
    detect_objects,
    _detector
)

# ---------------------------------------------------
# Test Image
# ---------------------------------------------------

IMAGE_PATH = "sample.jpg"

# Change to your image

# IMAGE_PATH = "images/test.jpg"

# ---------------------------------------------------
# Output Directories
# ---------------------------------------------------

OUTPUT_DIR = "outputs"

VISUALIZATION_DIR = os.path.join(
    OUTPUT_DIR,
    "object_detection"
)

os.makedirs(
    VISUALIZATION_DIR,
    exist_ok=True
)

# ---------------------------------------------------
# Load Image
# ---------------------------------------------------

image = cv2.imread(IMAGE_PATH)

if image is None:

    raise FileNotFoundError(

        f"\nCannot load image:\n{IMAGE_PATH}"

    )

print("\nImage Loaded Successfully")

# ---------------------------------------------------
# Run Detection
# ---------------------------------------------------

results = detect_objects(image)

objects = results["objects"]

summary = results["summary"]

visualization = results["visualization"]

# ---------------------------------------------------
# Print Summary
# ---------------------------------------------------

print("\n==============================")

print("Detection Summary")

print("==============================")

print("Objects Found :", summary["num_objects"])

print("Primary Subject :", summary["primary_subject"])

print("Classes :", summary["classes"])

# ---------------------------------------------------
# Print Individual Objects
# ---------------------------------------------------

print("\n==============================")

print("Detected Objects")

print("==============================")

for i, obj in enumerate(objects):

    print(f"\nObject #{i+1}")

    print("-------------------------")

    print("Class      :", obj.class_name)

    print("Confidence :", round(obj.confidence,3))

    print("BBox       :", obj.bbox)

    print("Center     :", obj.center)

    print("Area       :", round(obj.area,4))

    print("Primary    :", obj.is_primary_subject)

# ---------------------------------------------------
# Save Visualization
# ---------------------------------------------------

visualization_path = os.path.join(

    VISUALIZATION_DIR,

    "detections.jpg"

)

cv2.imwrite(

    visualization_path,

    visualization

)

print("\nVisualization Saved")

print(visualization_path)

# ---------------------------------------------------
# Save Crops
# ---------------------------------------------------

_detector.save_crops(

    objects,

    os.path.join(

        VISUALIZATION_DIR,

        "crops"

    )

)

print("Object Crops Saved")

# ---------------------------------------------------
# Save Masks
# ---------------------------------------------------

_detector.save_masks(

    objects,

    os.path.join(

        VISUALIZATION_DIR,

        "masks"

    )

)

print("Masks Saved")

# ---------------------------------------------------
# Display Image
# ---------------------------------------------------

cv2.imshow(

    "PurePic Object Detection",

    visualization

)

print("\nPress any key to exit...")

cv2.waitKey(0)

cv2.destroyAllWindows()

print("\nDone.")