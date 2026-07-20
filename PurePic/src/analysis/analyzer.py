import cv2
import numpy as np

# ==========================================================
# Technical Analysis Modules
# ==========================================================

from src.quality.sharpness import compute_quality
from src.quality.exposure_and_noise import exposure_noise_score
from src.quality.subject_intelligence import subject_intelligence
from src.quality.intent_detection import detect_photographer_intent

# ==========================================================
# Analysis Modules
# ==========================================================

from src.analysis.object_detector import detect_objects
from src.analysis.scene_understanding import understand_scene

# ==========================================================
# Temporary Image Adapter
# ==========================================================

from src.analysis.utils import (
    save_temp_image,
    cleanup_temp_image
)


# ==========================================================
# Utility Functions
# ==========================================================

def normalize(value, min_val, max_val):
    """
    Normalize any value to range [0,1]
    """

    try:

        value = float(value)

        return max(

            0.0,

            min(

                (value - min_val) /
                (max_val - min_val + 1e-6),

                1.0

            )

        )

    except Exception:

        return 0.0


def safe_extract(data, default=0):
    """
    Safely extract first numeric value.
    """

    if isinstance(data, (tuple, list)):

        return data[0]

    if isinstance(data, dict):

        return default

    return data


def compute_brightness(gray):

    return gray.mean() / 255.0


def compute_contrast(gray):

    return min(

        gray.std() / 128.0,

        1.0

    )


# ==========================================================
# Technical Analysis
# ==========================================================

def run_technical_analysis(

    image,

    temp_path

):

    gray = cv2.cvtColor(

        image,

        cv2.COLOR_BGR2GRAY

    )

    # ----------------------------------------
    # Sharpness
    # ----------------------------------------

    sharpness_raw = safe_extract(

        compute_quality(

            temp_path

        )

    )

    sharpness = normalize(

        sharpness_raw,

        0,

        100

    )

    # ----------------------------------------
    # Exposure
    # ----------------------------------------

    exposure_data = exposure_noise_score(

        temp_path

    )

    # ----------------------------------------
    # Brightness
    # ----------------------------------------

    brightness = compute_brightness(

        gray

    )

    # ----------------------------------------
    # Contrast
    # ----------------------------------------

    contrast = compute_contrast(

        gray

    )

    return {

        "sharpness":

            round(

                sharpness,

                3

            ),

        "brightness":

            round(

                brightness,

                3

            ),

        "contrast":

            round(

                contrast,

                3

            ),

        "exposure":

            exposure_data

    }


# ==========================================================
# Subject Analysis
# ==========================================================

def run_subject_analysis(

    temp_path

):

    subject_data = subject_intelligence(

        temp_path

    )

    if isinstance(

        subject_data,

        dict

    ):

        score_raw = subject_data.get(

            "subject_score",

            0

        )

    elif isinstance(

        subject_data,

        (tuple, list)

    ):

        score_raw = subject_data[0]

    else:

        score_raw = subject_data

    if score_raw <= 1:

        score = float(score_raw)

    else:

        score = normalize(

            score_raw,

            0,

            100

        )

    return {

        "score":

            round(

                score,

                3

            ),

        "strong":

            score > 0.5

    }


# ==========================================================
# Intent Analysis
# ==========================================================

def run_intent_analysis(

    temp_path

):

    intent_raw = detect_photographer_intent(

        temp_path

    )

    if isinstance(

        intent_raw,

        (tuple, list)

    ):

        intent_raw = intent_raw[0]

    intent_map = {

        0: "general",

        1: "portrait",

        2: "wildlife",

        3: "event"

    }

    return {

        "label":

            intent_map.get(

                intent_raw,

                "unknown"

            ),

        "class":

            int(intent_raw)

    }
    
# ==========================================================
# Object Analysis
# ==========================================================

def run_object_analysis(
    image
):
    """
    Runs YOLO object detection once.
    Returns complete object analysis.
    """

    try:

        objects = detect_objects(
            image
        )

        return objects

    except Exception as e:

        print(
            "[Analyzer] Object Detection Error:",
            e
        )

        return {

            "objects": [],

            "summary": {

                "count": 0,

                "primary_subject": None

            }

        }


# ==========================================================
# Scene Analysis
# ==========================================================

def run_scene_analysis(
    image,
    object_results
):
    """
    Scene understanding.

    IMPORTANT:
    Does NOT run YOLO again.
    Uses object_results from analyzer.
    """

    try:

        scene = understand_scene(

            image=image,

            object_results=object_results

        )

        return scene

    except Exception as e:

        print(
            "[Analyzer] Scene Understanding Error:",
            e
        )

        return {

            "scene_type": "unknown",

            "environment": "unknown",

            "lighting_type": "unknown",

            "camera_distance": "unknown",

            "composition": "unknown",

            "dominant_subject": None,

            "editing_priority": [],

            "face_detected": False,

            "background_complexity": 0,

            "light_direction": "balanced"

        }


# ==========================================================
# Unified Analysis Builder
# ==========================================================

def build_analysis(

    technical,

    subject,

    intent,

    objects,

    scene

):
    """
    Creates the unified analysis dictionary.

    Every future module should use this
    instead of individual dictionaries.
    """

    analysis = {

        # -------------------------------------
        # Technical Quality
        # -------------------------------------

        "technical": technical,

        # -------------------------------------
        # Subject Intelligence
        # -------------------------------------

        "subject": subject,

        # -------------------------------------
        # Photographer Intent
        # -------------------------------------

        "intent": intent,

        # -------------------------------------
        # Object Detection
        # -------------------------------------

        "objects": objects,

        # -------------------------------------
        # Scene Understanding
        # -------------------------------------

        "scene": scene

    }

    return analysis


# ==========================================================
# Convenience Getters
# ==========================================================

def get_sharpness(analysis):

    return analysis["technical"]["sharpness"]


def get_brightness(analysis):

    return analysis["technical"]["brightness"]


def get_contrast(analysis):

    return analysis["technical"]["contrast"]


def get_subject_score(analysis):

    return analysis["subject"]["score"]


def is_strong_subject(analysis):

    return analysis["subject"]["strong"]


def get_intent(analysis):

    return analysis["intent"]["label"]


def get_objects(analysis):

    return analysis["objects"]


def get_scene(analysis):

    return analysis["scene"]

# ==========================================================
# Main Analysis Engine
# ==========================================================

def analyze_image(image):
    """
    PurePic Analysis Engine V2

    Pipeline:

        Image
          │
          ▼
    Technical Analysis
          │
          ▼
    Subject Analysis
          │
          ▼
    Intent Detection
          │
          ▼
    Object Detection (YOLO)
          │
          ▼
    Scene Understanding
          │
          ▼
    Unified Analysis Dictionary
    """

    temp_path = save_temp_image(image)

    try:

        # -------------------------------------------------
        # Technical
        # -------------------------------------------------

        technical = run_technical_analysis(

            image,

            temp_path

        )

        # -------------------------------------------------
        # Subject
        # -------------------------------------------------

        subject = run_subject_analysis(

            temp_path

        )

        # -------------------------------------------------
        # Intent
        # -------------------------------------------------

        intent = run_intent_analysis(

            temp_path

        )

        # -------------------------------------------------
        # Object Detection
        # -------------------------------------------------

        object_results = run_object_analysis(

            image

        )

        # -------------------------------------------------
        # Scene Understanding
        # -------------------------------------------------

        scene = run_scene_analysis(

            image,

            object_results

        )

        # -------------------------------------------------
        # Build Unified Analysis
        # -------------------------------------------------

        analysis = build_analysis(

            technical,

            subject,

            intent,

            object_results,

            scene

        )

        return analysis

    finally:

        cleanup_temp_image(

            temp_path

        )


# ==========================================================
# Debug Helper
# ==========================================================

def print_analysis_summary(

    analysis

):
    """
    Pretty console output
    """

    print("\n==============================")
    print(" PurePic Analysis Summary")
    print("==============================")

    print("\nTechnical")

    print(
        f"  Sharpness : {analysis['technical']['sharpness']}"
    )

    print(
        f"  Brightness: {analysis['technical']['brightness']}"
    )

    print(
        f"  Contrast  : {analysis['technical']['contrast']}"
    )

    print("\nSubject")

    print(
        f"  Score     : {analysis['subject']['score']}"
    )

    print(
        f"  Strong    : {analysis['subject']['strong']}"
    )

    print("\nIntent")

    print(
        f"  {analysis['intent']['label']}"
    )

    print("\nObjects")

    print(
        f"  Count     : {analysis['objects']['summary'].get('count',0)}"
    )

    print(
        f"  Primary   : {analysis['objects']['summary'].get('primary_subject')}"
    )

    print("\nScene")

    print(
        f"  Type      : {analysis['scene'].get('scene_type')}"
    )

    print(
        f"  Environment: {analysis['scene'].get('environment')}"
    )

    print(
        f"  Lighting  : {analysis['scene'].get('lighting_type')}"
    )

    print(
        f"  Distance  : {analysis['scene'].get('camera_distance')}"
    )

    print("==============================\n")


# ==========================================================
# Standalone Test
# ==========================================================

if __name__ == "__main__":

    image = cv2.imread("sample.jpg")

    if image is None:

        raise FileNotFoundError(

            "sample.jpg not found."

        )

    result = analyze_image(

        image

    )

    print_analysis_summary(

        result

    )