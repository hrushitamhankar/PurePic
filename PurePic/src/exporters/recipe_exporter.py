import json
import os

# -------------------------------------------------
# Export PurePic Recipe
# -------------------------------------------------

def export_recipe(

    styled_results,

    output_path="outputs/purepic_recipe.json"
):

    # ---------------------------------------------
    # Create Output Directory
    # ---------------------------------------------

    os.makedirs(

        "outputs",

        exist_ok=True
    )

    # ---------------------------------------------
    # Build Recipe
    # ---------------------------------------------

    recipe = {

        "purepic_version":
            "1.0",

        "recipe_type":
            "ai_edit_recipe",

        "masks":
            styled_results
    }

    # ---------------------------------------------
    # Save JSON
    # ---------------------------------------------

    with open(

        output_path,

        "w"

    ) as f:

        json.dump(

            recipe,

            f,

            indent=4
        )

    return output_path