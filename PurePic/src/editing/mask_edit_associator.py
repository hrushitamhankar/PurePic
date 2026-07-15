# -------------------------------------------------
# Associate Semantic Masks with Lightroom Edits
# -------------------------------------------------

def associate_masks_with_edits(

    masks,

    intelligent_edits,

    lightroom_edits
):

    final_results = []

    # -------------------------------------------------
    # Region Mapping
    # -------------------------------------------------

    region_mapping = {

        "skin_region":
            "Skin Region",

        "highlight_region":
            "Highlight Region",

        "dark_region":
            "Dark Region",

        "texture_region":
            "Texture Region"
    }

    # -------------------------------------------------
    # Process Masks
    # -------------------------------------------------

    for mask_name, mask_array in masks.items():

        if mask_name not in region_mapping:

            continue

        target_region = region_mapping[
            mask_name
        ]

        matched_sliders = []

        # ---------------------------------------------
        # Find Matching Lightroom Sliders
        # ---------------------------------------------

        for item in lightroom_edits:

            if item["region"] == target_region:

                matched_sliders = item[
                    "lightroom_sliders"
                ]

                break

        # ---------------------------------------------
        # Build Final Object
        # ---------------------------------------------

        final_results.append({

            "mask_name":
                mask_name,

            "mask":
                mask_array,

            "region":
                target_region,

            "edits":
                matched_sliders
        })

    return final_results