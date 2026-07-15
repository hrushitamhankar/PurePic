def generate_instructions(top_masks):

    instructions = []

    for mask_name, score in top_masks:

        # -------------------------------------------------
        # Subject Mask
        # -------------------------------------------------

        if mask_name == "subject_mask":

            instructions.append({

                "mask": "Subject Mask",

                "score": float(score),

                "adjustments": [

                    "Increase Exposure (+0.4)",

                    "Increase Clarity (+15)",

                    "Increase Texture (+10)"
                ]
            })

        # -------------------------------------------------
        # Background Mask
        # -------------------------------------------------

        elif mask_name == "background_mask":

            instructions.append({

                "mask": "Background Mask",

                "score": float(score),

                "adjustments": [

                    "Reduce Exposure (-0.5)",

                    "Reduce Saturation (-10)",

                    "Add slight blur effect"
                ]
            })

        # -------------------------------------------------
        # Radial Mask
        # -------------------------------------------------

        elif mask_name == "radial_mask":

            instructions.append({

                "mask": "Radial Mask",

                "score": float(score),

                "adjustments": [

                    "Add soft radial glow",

                    "Increase Exposure (+0.3)",

                    "Set Feather to High"
                ]
            })

        # -------------------------------------------------
        # Luminance Mask
        # -------------------------------------------------

        elif mask_name == "luminance_mask":

            instructions.append({

                "mask": "Luminance Mask",

                "score": float(score),

                "adjustments": [

                    "Enhance bright regions",

                    "Increase Contrast (+10)"
                ]
            })

        # -------------------------------------------------
        # Warmth Mask
        # -------------------------------------------------

        elif mask_name == "warmth_mask":

            instructions.append({

                "mask": "Warmth Mask",

                "score": float(score),

                "adjustments": [

                    "Increase Temperature",

                    "Increase Vibrance",

                    "Enhance warm tones"
                ]
            })

        # -------------------------------------------------
        # Linear Gradient
        # -------------------------------------------------

        elif mask_name == "linear_gradient":

            instructions.append({

                "mask": "Linear Gradient",

                "score": float(score),

                "adjustments": [

                    "Darken edges slightly",

                    "Increase depth",

                    "Add cinematic contrast"
                ]
            })

    return instructions