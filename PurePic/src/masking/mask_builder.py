from masking.mask_schema import (
    create_mask_object
)

# -------------------------------------------------
# Build Structured Masks
# -------------------------------------------------

def build_masks(

    top_masks,

    scene_data,
    
    analysis
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
    # Primary Subject
    # -------------------------------------------------

    detected_objects = []

    if isinstance(analysis, dict):

        objects_payload = analysis.get(
            "objects",
            []
        )

        if isinstance(objects_payload, dict):
            detected_objects = objects_payload.get(
                "objects",
                []
            )
        elif isinstance(objects_payload, (list, tuple)):
            detected_objects = list(objects_payload)

    primary_subject = None

    for obj in detected_objects:

        if getattr(obj, "is_primary_subject", False):
            primary_subject = obj
            break

    if primary_subject is None and detected_objects:
        primary_subject = detected_objects[0]

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

            subject_region_type = "radial"
            subject_region_data = {
                "focus": "subject"
            }

            if primary_subject is not None:

                binary_mask = getattr(
                    primary_subject,
                    "binary_mask",
                    None
                )

                if binary_mask is not None:

                    subject_region_type = "segmentation"
                    subject_region_data = {
                        "binary_mask": binary_mask,
                        "contour": getattr(
                            primary_subject,
                            "contour",
                            None
                        )
                    }

            masks.append(

                create_mask_object(

                    mask_type="subject_mask",

                    confidence=score,

                    color=[255, 255, 0],

                    region_type=subject_region_type,

                    region_data=subject_region_data,

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

            background_region_data = {
                "focus": "background"
            }

            if primary_subject is not None:

                binary_mask = getattr(
                    primary_subject,
                    "binary_mask",
                    None
                )

                if binary_mask is not None:

                    background_region_data = {
                        "binary_mask": binary_mask,
                        "contour": getattr(
                            primary_subject,
                            "contour",
                            None
                        )
                    }

            masks.append(

                create_mask_object(

                    mask_type="background_mask",

                    confidence=score,

                    color=[0, 0, 255],

                    region_type="inverse_subject",

                    region_data=background_region_data,

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