from src.editing.mask_edit_associator import (
    associate_masks_with_edits
)

masks = {
    "face_mask": 0.91,
    "highlight_mask": 0.74,
    "texture_mask": 0.68
}

lightroom_edits = [

    {
        "region": "Face Enhancement",

        "lightroom_sliders": [

            {
                "slider": "Exposure",
                "value": 0.3
            },

            {
                "slider": "Texture",
                "value": -20
            },

            {
                "slider": "Clarity",
                "value": 15
            }
        ]
    },

    {
        "region": "Highlight Region",

        "lightroom_sliders": [

            {
                "slider": "Highlights",
                "value": 20
            },

            {
                "slider": "Clarity",
                "value": 15
            }
        ]
    }
]

results = associate_masks_with_edits(
    masks,
    [],
    lightroom_edits
)

print("\n--- FINAL MASK + EDIT SYSTEM ---\n")

for item in results:

    print(
        f'{item["mask"]}'
    )

    print(
        f'Strength: {item["mask_strength"]}'
    )

    print(
        f'Region: {item["region"]}'
    )

    for edit in item["edits"]:

        print(
            f'  • {edit["slider"]}: {edit["value"]}'
        )

    print()