import cv2
import os

from src.analysis.semantic_regions import (
    extract_semantic_regions
)

# -----------------------------------
# IMAGE PATH
# -----------------------------------

IMAGE_PATH = "target.jpg"

# -----------------------------------
# LOAD IMAGE
# -----------------------------------

image = cv2.imread(
    IMAGE_PATH
)

if image is None:

    raise Exception(
        f"Could not load image: {IMAGE_PATH}"
    )

# -----------------------------------
# CREATE OUTPUT DIRECTORY
# -----------------------------------

os.makedirs(
    "outputs",
    exist_ok=True
)

# -----------------------------------
# EXTRACT SEMANTIC REGIONS
# -----------------------------------

regions = extract_semantic_regions(
    image
)

print("\n--- SEMANTIC REGIONS ---\n")

# -----------------------------------
# SAVE EACH REGION
# -----------------------------------

for region_name, mask in regions.items():

    print(region_name)

    save_path = (
        f"outputs/{region_name}.jpg"
    )

    cv2.imwrite(
        save_path,
        mask
    )

    print(
        f"Saved: {save_path}"
    )

print("\nSemantic region extraction complete.\n")