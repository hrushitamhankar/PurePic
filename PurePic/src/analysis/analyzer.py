import cv2
import numpy as np

# Existing stable modules
from src.quality.sharpness import compute_quality
from src.quality.exposure_and_noise import exposure_noise_score
from src.quality.subject_intelligence import subject_intelligence
from src.quality.intent_detection import detect_photographer_intent

# Temp adapter
from src.analysis.utils import save_temp_image, cleanup_temp_image


# -------------------------------------------------
# Helpers
# -------------------------------------------------

def normalize(value, min_val, max_val):
    """
    Safely normalize value to 0–1
    """
    try:
        value = float(value)
        return max(0.0, min((value - min_val) / (max_val - min_val + 1e-6), 1.0))
    except:
        return 0.0


def safe_extract(data, default=0):
    """
    Handles tuple / list / int / float safely
    """

    # tuple or list
    if isinstance(data, (tuple, list)):
        return data[0]

    # dict
    if isinstance(data, dict):
        return default

    return data


def compute_brightness(gray):
    return gray.mean() / 255.0


def compute_contrast(gray):
    return min(gray.std() / 128.0, 1.0)


# -------------------------------------------------
# Main Analyzer
# -------------------------------------------------

def analyze_image(image):

    temp_path = save_temp_image(image)

    try:

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # -------------------------------------------------
        # SHARPNESS
        # -------------------------------------------------

        sharpness_data = compute_quality(temp_path)

        sharpness_raw = safe_extract(sharpness_data)

        sharpness = normalize(sharpness_raw, 0, 100)

        # -------------------------------------------------
        # EXPOSURE / NOISE
        # -------------------------------------------------

        exposure_data = exposure_noise_score(temp_path)

        brightness = compute_brightness(gray)

        # -------------------------------------------------
        # CONTRAST
        # -------------------------------------------------

        contrast = compute_contrast(gray)

        # -------------------------------------------------
        # SUBJECT INTELLIGENCE
        # -------------------------------------------------

        subject_data = subject_intelligence(temp_path)

        # CASE 1 → dict
        if isinstance(subject_data, dict):

            subject_score_raw = subject_data.get("subject_score", 0)

            is_strong_subject = subject_data.get(
                "strong_subject",
                False
            )

        # CASE 2 → tuple/list
        elif isinstance(subject_data, (tuple, list)):

            subject_score_raw = subject_data[0]

            if len(subject_data) > 1:
                is_strong_subject = bool(subject_data[1])
            else:
                is_strong_subject = False

        # CASE 3 → single number
        else:

            subject_score_raw = subject_data

            is_strong_subject = subject_score_raw > 50

        #if already normalized
        if subject_score_raw <= 1:
            subject_score = float(subject_score_raw)
        else:
            subject_score = normalize(subject_score_raw, 0, 100)
        # Recompute consistently
        is_strong_subject = subject_score > 0.5
        
        # -------------------------------------------------
        # INTENT DETECTION
        # -------------------------------------------------

        intent_data = detect_photographer_intent(temp_path)

        if isinstance(intent_data, (tuple, list)):
            intent_idx = intent_data[0]
        else:
            intent_idx = intent_data

        # Map class index → label
        intent_map = {
            0: "general",
            1: "portrait",
            2: "wildlife",
            3: "event"
        }

        intent = intent_map.get(intent_idx, "unknown")

        # -------------------------------------------------
        # FINAL STRUCTURED OUTPUT
        # -------------------------------------------------

        analysis = {

            "subject_score": round(subject_score, 3),

            "is_strong_subject": is_strong_subject,

            "sharpness": round(sharpness, 3),

            "brightness": round(brightness, 3),

            "contrast": round(contrast, 3),

            "intent": intent,

            "exposure_data": exposure_data
        }

        return analysis

    finally:

        cleanup_temp_image(temp_path)