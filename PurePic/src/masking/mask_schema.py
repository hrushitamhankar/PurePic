# -------------------------------------------------
# PurePic Universal Mask Schema
# -------------------------------------------------

def create_mask_object(

    mask_type,

    confidence,

    color,

    region_type,

    region_data,

    instructions
):

    return {

        # -----------------------------------------
        # Basic Info
        # -----------------------------------------

        "mask_type":

            mask_type,

        "confidence":

            float(round(confidence, 3)),

        # -----------------------------------------
        # Visualization
        # -----------------------------------------

        "overlay": {

            "color":

                color,

            "opacity":

                0.12
        },

        # -----------------------------------------
        # Region Data
        # -----------------------------------------

        "region": {

            "type":

                region_type,

            "data":

                region_data
        },

        # -----------------------------------------
        # Lightroom Guidance
        # -----------------------------------------

        "instructions":

            instructions
    }