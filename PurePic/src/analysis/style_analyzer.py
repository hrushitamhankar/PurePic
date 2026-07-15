import cv2
import numpy as np

from src.analysis.analyzer import analyze_image


# -------------------------------------------------
# Color Statistics
# -------------------------------------------------

def compute_color_stats(image):

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    h, s, v = cv2.split(hsv)

    avg_saturation = np.mean(s) / 255.0

    avg_brightness = np.mean(v) / 255.0

    # ---------------------------------------------
    # Warmth Approximation
    # Higher red tones = warmer image
    # ---------------------------------------------

    b, g, r = cv2.split(image)

    warmth = np.mean(
        r.astype(np.float32) -
        b.astype(np.float32)
    )

    return {

        "saturation": round(avg_saturation, 3),

        "brightness": round(avg_brightness, 3),

        "warmth": round(float(warmth), 3)
    }


# -------------------------------------------------
# Style Comparison Engine
# -------------------------------------------------

def compare_styles(reference_image, target_image):

    # ---------------------------------------------
    # Analyze Both Images
    # ---------------------------------------------

    ref_analysis = analyze_image(reference_image)

    tgt_analysis = analyze_image(target_image)

    # ---------------------------------------------
    # Color Statistics
    # ---------------------------------------------

    ref_color = compute_color_stats(reference_image)

    tgt_color = compute_color_stats(target_image)

    # ---------------------------------------------
    # Compute Style Differences
    # ---------------------------------------------

    style_diff = {

        # -----------------------------------------
        # Brightness Difference
        # + value → target should become brighter
        # -----------------------------------------

        "brightness_diff":

            round(
                ref_analysis["brightness"] -
                tgt_analysis["brightness"],
                3
            ),

        # -----------------------------------------
        # Contrast Difference
        # -----------------------------------------

        "contrast_diff":

            round(
                ref_analysis["contrast"] -
                tgt_analysis["contrast"],
                3
            ),

        # -----------------------------------------
        # Sharpness Difference
        # -----------------------------------------

        "sharpness_diff":

            round(
                ref_analysis["sharpness"] -
                tgt_analysis["sharpness"],
                3
            ),

        # -----------------------------------------
        # Subject Emphasis Difference
        # -----------------------------------------

        "subject_diff":

            round(
                ref_analysis["subject_score"] -
                tgt_analysis["subject_score"],
                3
            ),

        # -----------------------------------------
        # Saturation Difference
        # -----------------------------------------

        "saturation_diff":

            round(
                ref_color["saturation"] -
                tgt_color["saturation"],
                3
            ),

        # -----------------------------------------
        # Warmth Difference
        # -----------------------------------------

        "warmth_diff":

            round(
                ref_color["warmth"] -
                tgt_color["warmth"],
                3
            )
    }

    # ---------------------------------------------
    # Final Output
    # ---------------------------------------------

    return {

        "reference_analysis": ref_analysis,

        "target_analysis": tgt_analysis,

        "reference_color": ref_color,

        "target_color": tgt_color,

        "style_diff": style_diff
    }