import cv2

from src.analysis.semantic_regions import (
    extract_semantic_regions
)

from src.analysis.scene_understanding import (
    understand_scene
)

from src.analysis.style_analyzer import (
    compare_styles
)

from src.masking.intelligent_edit_mapper import (
    map_intelligent_edits
)

# -----------------------------------
# LOAD IMAGES
# -----------------------------------

target = cv2.imread(
    "target.jpg"
)

reference = cv2.imread(
    "reference.jpg"
)

# -----------------------------------
# ANALYSIS
# -----------------------------------

semantic_regions = extract_semantic_regions(
    target
)

scene_data = understand_scene(
    target
)

style_data = compare_styles(
    reference,
    target
)

# -----------------------------------
# AI EDIT MAPPING
# -----------------------------------

results = map_intelligent_edits(

    semantic_regions,

    style_data,

    scene_data
)

# -----------------------------------
# PRINT RESULTS
# -----------------------------------

print("\n--- INTELLIGENT EDITS ---\n")

for item in results:

    print(f"\n{item['region']}")

    for edit in item["edits"]:

        print(f"  • {edit}")