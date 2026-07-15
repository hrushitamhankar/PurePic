def convert_to_lightroom_format(edit_list):

    lightroom_edits = []

    slider_map = {
        "Increase Exposure (+0.4)": {
            "slider": "Exposure",
            "value": 0.4
        },

        "Increase Clarity (+15)": {
            "slider": "Clarity",
            "value": 15
        },

        "Increase Texture (+20)": {
            "slider": "Texture",
            "value": 20
        },

        "Reduce Texture (-10)": {
            "slider": "Texture",
            "value": -10
        },

        "Increase Highlights (+20)": {
            "slider": "Highlights",
            "value": 20
        },

        "Deepen Shadows (-20)": {
            "slider": "Shadows",
            "value": -20
        },

        "Reduce Blacks (-10)": {
            "slider": "Blacks",
            "value": -10
        },

        "Increase Sharpening (+20)": {
            "slider": "Sharpening",
            "value": 20
        },

        "Brighten Face Slightly": {
            "slider": "Exposure",
            "value": 0.3
        },

        "Smooth Skin": {
            "slider": "Texture",
            "value": -20
        },

        "Enhance Eyes": {
            "slider": "Clarity",
            "value": 15
        },

        "Increase Facial Contrast": {
            "slider": "Contrast",
            "value": 10
        }
    }

    for item in edit_list:

        region_name = item["region"]

        converted = []

        for edit in item["edits"]:

            if edit in slider_map:

                converted.append(
                    slider_map[edit]
                )

        lightroom_edits.append({
            "region": region_name,
            "lightroom_sliders": converted
        })

    return lightroom_edits