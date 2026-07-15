from src.editing.style_applier import (
    apply_style_preset
)

# -------------------------------------------------
# Sample Associated Masks
# -------------------------------------------------

associated_masks = [

    {
        "mask": "face_mask",

        "mask_strength": 0.91,

        "region": "Face Enhancement",

        "edits": [

            {
                "slider": "Exposure",

                "value": 0.3
            },

            {
                "slider": "Texture",

                "value": -20
            }
        ]
    },

    {
        "mask": "highlight_mask",

        "mask_strength": 0.74,

        "region": "Highlight Region",

        "edits": [

            {
                "slider": "Highlights",

                "value": 20
            }
        ]
    }
]

# -------------------------------------------------
# Apply Style
# -------------------------------------------------

results = apply_style_preset(

    associated_masks,

    style_name="bridal_luxury"
)

# -------------------------------------------------
# Print Results
# -------------------------------------------------

print("\n--- STYLE APPLIED RESULTS ---\n")

for item in results:

    print(f"\nMask: {item['mask']}")

    print(f"Style: {item['style']}")

    for edit in item["final_edits"]:

        print(
            f'  • {edit["slider"]}: {edit["value"]}'
        )