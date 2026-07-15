import sys
import os

# ---------------------------------------------------
# Add src folder to Python path
# ---------------------------------------------------

sys.path.append(
    os.path.abspath("src")
)

# ---------------------------------------------------
# Imports
# ---------------------------------------------------

import cv2

from editing.local_editor import (
    apply_masked_lightroom_edits
)

from analysis.semantic_regions import (
    extract_semantic_regions
)

from masking.intelligent_edit_mapper import (
    map_intelligent_edits
)

from editing.lightroom_mapper import (
    convert_to_lightroom_format
)

from editing.mask_edit_associator import (
    associate_masks_with_edits
)

from editing.style_applier import (
    apply_style_preset
)

# ---------------------------------------------------
# Load image
# ---------------------------------------------------

image = cv2.imread(
    "target.jpg"
)

if image is None:

    raise ValueError(
        "Could not load target image."
    )

# ---------------------------------------------------
# Extract semantic regions
# ---------------------------------------------------

regions = extract_semantic_regions(
    image
)

print("\n--- SEMANTIC REGIONS ---\n")

for name in regions.keys():

    print(name)

# ---------------------------------------------------
# Generate intelligent edits
# ---------------------------------------------------

intelligent_edits = map_intelligent_edits(

    semantic_regions=regions,

    style_data={},

    scene_data={}
)

print("\n--- INTELLIGENT EDITS ---\n")

for item in intelligent_edits:

    print(item["region"])

# ---------------------------------------------------
# Convert to Lightroom sliders
# ---------------------------------------------------

lightroom_edits = convert_to_lightroom_format(
    intelligent_edits
)

# ---------------------------------------------------
# Apply style preset
# ---------------------------------------------------

styled_edits = apply_style_preset(

    lightroom_edits,

    style_name="bridal_luxury"
)

# ---------------------------------------------------
# Associate masks + edits
# ---------------------------------------------------

mask_edit_data = associate_masks_with_edits(

    masks=regions,

    intelligent_edits=intelligent_edits,

    lightroom_edits=styled_edits
)

print("\n--- MASK ASSOCIATION ---\n")

for item in mask_edit_data:

    print(item["mask_name"])

# ---------------------------------------------------
# Build editable masks
# ---------------------------------------------------

editable_masks = []

for item in mask_edit_data:

    editable_masks.append({

        "mask":
            item["mask"],

        "edits":
            item["edits"]
    })

# ---------------------------------------------------
# Apply local masked edits
# ---------------------------------------------------

result = apply_masked_lightroom_edits(

    image,

    editable_masks
)

# ---------------------------------------------------
# Save final result
# ---------------------------------------------------

os.makedirs(
    "outputs",
    exist_ok=True
)

output_path = (
    "outputs/local_edit_result.jpg"
)

cv2.imwrite(
    output_path,
    result
)

print("\nSaved:")
print(output_path)