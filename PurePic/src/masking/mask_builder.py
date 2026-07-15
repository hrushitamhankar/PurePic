from masking.mask_schema import (
    create_mask_object
)

# -------------------------------------------------
# Build Structured Masks
# -------------------------------------------------

def build_masks(

    top_masks,

    scene_data
):

    masks = []

    # -------------------------------------------------
    # Scene Data
    # -------------------------------------------------

    face_bbox = scene_data.get(
        "face_bbox"
    )

    light_direction = scene_data.get(
        "light_direction"
    )

    # -------------------------------------------------
    # Build Masks
    # -------------------------------------------------

    for mask_name, score in top_masks:

        # =================================================
        # FACE MASK
        # =================================================

        if mask_name == "face_mask":

            if face_bbox is None:
                continue

            masks.append(

                create_mask_object(

                    mask_type="face_mask",

                    confidence=score,

                    color=[0, 255, 0],

                    region_type="ellipse",

                    region_data={

                        "bbox": face_bbox
                    },

                    instructions=[

                        "Increase exposure slightly",

                        "Add skin warmth",

                        "Increase facial clarity"
                    ]
                )
            )

        # =================================================
        # LEFT LIGHT MASK
        # =================================================

        elif mask_name == "left_light_mask":

            masks.append(

                create_mask_object(

                    mask_type="left_light_mask",

                    confidence=score,

                    color=[255, 180, 0],

                    region_type="gradient_left",

                    region_data={

                        "direction": "left"
                    },

                    instructions=[

                        "Enhance cinematic side light",

                        "Increase glow",

                        "Boost highlights"
                    ]
                )
            )

        # =================================================
        # RIGHT LIGHT MASK
        # =================================================

        elif mask_name == "right_light_mask":

            masks.append(

                create_mask_object(

                    mask_type="right_light_mask",

                    confidence=score,

                    color=[255, 140, 0],

                    region_type="gradient_right",

                    region_data={

                        "direction": "right"
                    },

                    instructions=[

                        "Enhance side lighting",

                        "Increase warm highlights"
                    ]
                )
            )

        # =================================================
        # SUBJECT MASK
        # =================================================

        elif mask_name == "subject_mask":

            masks.append(

                create_mask_object(

                    mask_type="subject_mask",

                    confidence=score,

                    color=[255, 255, 0],

                    region_type="radial",

                    region_data={

                        "focus": "subject"
                    },

                    instructions=[

                        "Increase subject clarity",

                        "Enhance texture",

                        "Slightly increase contrast"
                    ]
                )
            )

        # =================================================
        # BACKGROUND MASK
        # =================================================

        elif mask_name == "background_mask":

            masks.append(

                create_mask_object(

                    mask_type="background_mask",

                    confidence=score,

                    color=[0, 0, 255],

                    region_type="inverse_subject",

                    region_data={

                        "focus": "background"
                    },

                    instructions=[

                        "Darken background",

                        "Reduce distractions",

                        "Lower saturation slightly"
                    ]
                )
            )

        # =================================================
        # CINEMATIC MASK
        # =================================================

        elif mask_name == "cinematic_mask":

            masks.append(

                create_mask_object(

                    mask_type="cinematic_mask",

                    confidence=score,

                    color=[120, 0, 255],

                    region_type="vignette",

                    region_data={

                        "strength": 0.7
                    },

                    instructions=[

                        "Add cinematic depth",

                        "Increase edge darkness",

                        "Focus attention on subject"
                    ]
                )
            )

    return masks