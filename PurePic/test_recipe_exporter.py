from src.exporters.recipe_exporter import (
    export_recipe
)

# -------------------------------------------------
# Sample Styled Results
# -------------------------------------------------

styled_results = [

    {
        "mask": "face_mask",

        "mask_strength": 0.91,

        "region": "Face Enhancement",

        "style": "bridal_luxury",

        "final_edits": [

            {
                "slider": "Exposure",

                "value": 0.3
            },

            {
                "slider": "Texture",

                "value": -20
            },

            {
                "slider": "Temperature",

                "value": 15
            }
        ]
    }
]

# -------------------------------------------------
# Export
# -------------------------------------------------

path = export_recipe(
    styled_results
)

print("\nRecipe exported:\n")

print(path)