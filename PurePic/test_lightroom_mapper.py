from src.editing.lightroom_mapper import (
    convert_to_lightroom_format
)

sample_edits = [

    {
        "region": "Face Enhancement",

        "edits": [
            "Brighten Face Slightly",
            "Enhance Eyes",
            "Smooth Skin"
        ]
    },

    {
        "region": "Highlight Region",

        "edits": [
            "Increase Highlights (+20)",
            "Increase Clarity (+15)"
        ]
    }
]

results = convert_to_lightroom_format(
    sample_edits
)

print("\n--- LIGHTROOM FORMAT ---\n")

for item in results:

    print(item["region"])

    for slider in item["lightroom_sliders"]:

        print(
            f'  • {slider["slider"]}: {slider["value"]}'
        )

    print()