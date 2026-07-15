from editing.style_presets import (
    STYLE_PRESETS
)

# -------------------------------------------------
# Merge Lightroom Sliders + Style Philosophy
# -------------------------------------------------

def apply_style_preset(

    associated_masks,

    style_name="cinematic"
):

    # ---------------------------------------------
    # Get Style Preset
    # ---------------------------------------------

    preset = STYLE_PRESETS.get(

        style_name,

        {}
    )

    styled_output = []

    # ---------------------------------------------
    # Process Each Region
    # ---------------------------------------------

    for item in associated_masks:

        # -----------------------------------------
        # Existing Lightroom Sliders
        # -----------------------------------------

        updated_sliders = list(

            item["lightroom_sliders"]
        )

        # -----------------------------------------
        # Existing Slider Names
        # -----------------------------------------

        existing_sliders = [

            slider["slider"]

            for slider in updated_sliders
        ]

        # -----------------------------------------
        # Inject Style Sliders
        # -----------------------------------------

        for slider_name, value in preset.items():

            if slider_name not in existing_sliders:

                updated_sliders.append({

                    "slider":
                        slider_name,

                    "value":
                        value
                })

        # -----------------------------------------
        # Final Styled Object
        # -----------------------------------------

        styled_output.append({

            "region":
                item["region"],

            "style":
                style_name,

            "lightroom_sliders":
                updated_sliders
        })

    return styled_output