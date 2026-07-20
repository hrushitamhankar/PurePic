"""
=========================================================
PurePic Scene Understanding Engine V2

This module DOES NOT run object detection.

It receives object detection results from analyzer.py
and performs semantic reasoning.

Responsibilities

✓ Face Detection
✓ Light Direction
✓ Lighting Type
✓ Subject Position
✓ Background Complexity
✓ Scene Classification
✓ Composition
✓ Camera Distance
✓ Editing Priorities

=========================================================
"""

import cv2
import numpy as np

# ---------------------------------------------------------
# MediaPipe Face Detector
# ---------------------------------------------------------

_FACE_DETECTOR = None


def get_face_detector():

    global _FACE_DETECTOR

    if _FACE_DETECTOR is not None:
        return _FACE_DETECTOR

    try:

        import mediapipe as mp

        _FACE_DETECTOR = (
            mp.solutions.face_detection.FaceDetection(
                model_selection=1,
                min_detection_confidence=0.5
            )
        )

    except Exception as e:

        print(
            "[Scene] MediaPipe unavailable:",
            e
        )

        _FACE_DETECTOR = None

    return _FACE_DETECTOR


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def clamp(value):

    return max(
        0.0,
        min(float(value), 1.0)
    )


def estimate_brightness(image):

    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    return clamp(
        np.mean(hsv[:, :, 2]) / 255
    )


def estimate_background_complexity(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    edges = cv2.Canny(
        gray,
        80,
        180
    )

    return round(
        float(np.mean(edges) / 255),
        3
    )


def estimate_light_direction(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    h, w = gray.shape

    left = np.mean(gray[:, :w // 2])
    right = np.mean(gray[:, w // 2:])

    diff = abs(left - right)

    if diff < 6:
        return "balanced"

    if left > right:
        return "left"

    return "right"


def classify_lighting(brightness):

    if brightness > 0.80:
        return "bright"

    if brightness > 0.60:
        return "daylight"

    if brightness > 0.35:
        return "normal"

    if brightness > 0.20:
        return "low_light"

    return "night"


# ---------------------------------------------------------
# Face Detection
# ---------------------------------------------------------

def detect_face(image):

    detector = get_face_detector()

    if detector is None:
        return False, None

    h, w = image.shape[:2]

    rgb = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    results = detector.process(rgb)

    if not results.detections:
        return False, None

    bbox = (
        results.detections[0]
        .location_data
        .relative_bounding_box
    )

    x1 = int(bbox.xmin * w)
    y1 = int(bbox.ymin * h)

    bw = int(bbox.width * w)
    bh = int(bbox.height * h)

    return True, [
        x1,
        y1,
        x1 + bw,
        y1 + bh
    ]


# ---------------------------------------------------------
# Subject Position
# ---------------------------------------------------------

def estimate_subject_position(
    bbox,
    width
):

    if bbox is None:
        return "unknown"

    x1, _, x2, _ = bbox

    cx = (x1 + x2) / 2

    ratio = cx / width

    if ratio < 0.33:
        return "left"

    elif ratio < 0.66:
        return "center"

    return "right"

# ==========================================================
# Scene Categories
# ==========================================================

WILDLIFE_CLASSES = {
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
    "deer",
    "fox",
    "wolf",
    "owl",
    "eagle",
    "duck",
    "lizard",
    "snake"
}

VEHICLE_CLASSES = {
    "car",
    "truck",
    "bus",
    "motorcycle",
    "bicycle",
    "boat",
    "airplane",
    "train"
}

PERSON_CLASSES = {
    "person"
}

FOOD_CLASSES = {
    "banana",
    "apple",
    "orange",
    "pizza",
    "cake",
    "sandwich",
    "hot dog",
    "donut"
}


# ==========================================================
# Scene Classification
# ==========================================================

def classify_scene(objects):

    if len(objects) == 0:
        return "unknown"

    classes = {
        obj.class_name.lower()
        for obj in objects
    }

    if classes & PERSON_CLASSES:
        return "portrait"

    if classes & WILDLIFE_CLASSES:
        return "wildlife"

    if classes & VEHICLE_CLASSES:
        return "vehicle"

    if classes & FOOD_CLASSES:
        return "food"

    return "general"


# ==========================================================
# Environment Classification
# ==========================================================

def classify_environment(
    scene_type,
    brightness,
    background_complexity
):

    if scene_type == "wildlife":
        return "outdoor"

    if scene_type == "vehicle":
        return "urban"

    if scene_type == "food":
        return "indoor"

    if scene_type == "portrait":

        if background_complexity < 0.15:
            return "studio"

        return "outdoor"

    if brightness < 0.18:
        return "night"

    return "unknown"


# ==========================================================
# Composition
# ==========================================================

def estimate_composition(objects):

    count = len(objects)

    if count == 0:
        return "unknown"

    if count == 1:
        return "single_subject"

    if count <= 3:
        return "multiple_subjects"

    return "crowded"


# ==========================================================
# Dominant Subject
# ==========================================================

def dominant_subject(objects):

    if len(objects) == 0:
        return None

    for obj in objects:

        if obj.is_primary_subject:
            return obj

    return max(
        objects,
        key=lambda x: x.area
    )


# ==========================================================
# Camera Distance
# ==========================================================

def estimate_camera_distance(objects):

    primary = dominant_subject(objects)

    if primary is None:
        return "unknown"

    area = primary.area

    if area > 0.60:
        return "macro"

    elif area > 0.35:
        return "close_up"

    elif area > 0.15:
        return "medium"

    elif area > 0.05:
        return "wide"

    return "telephoto"


# ==========================================================
# Object Statistics
# ==========================================================

def object_statistics(objects):

    if len(objects) == 0:

        return {

            "count": 0,

            "largest_area": 0,

            "average_confidence": 0,

            "classes": []
        }

    return {

        "count": len(objects),

        "largest_area": round(

            max(
                obj.area
                for obj in objects
            ),

            3
        ),

        "average_confidence": round(

            np.mean(
                [
                    obj.confidence
                    for obj in objects
                ]
            ),

            3
        ),

        "classes": [

            obj.class_name

            for obj in objects

        ]
    }


# ==========================================================
# Editing Priority Generator
# ==========================================================

def generate_editing_priority(

    scene_type,

    dominant,

    camera_distance,

    face_detected

):

    priority = []

    if face_detected:

        priority.extend([

            "eyes",

            "skin",

            "face",

            "hair"

        ])

    elif scene_type == "wildlife":

        priority.extend([

            "eyes",

            "head",

            "subject",

            "fur_or_feathers"

        ])

    elif scene_type == "vehicle":

        priority.extend([

            "paint",

            "body",

            "glass",

            "wheels"

        ])

    elif scene_type == "food":

        priority.extend([

            "texture",

            "color",

            "subject"

        ])

    else:

        priority.append(

            "subject"

        )

    if camera_distance == "macro":

        priority.insert(

            0,

            "details"

        )

    priority.append(

        "background"

    )

    return priority
# ==========================================================
# Main Scene Understanding
# ==========================================================

def understand_scene(
    image,
    object_results
):
    """
    PurePic Scene Understanding Engine V2

    Parameters
    ----------
    image : np.ndarray
        Input BGR image

    object_results : dict
        Output from detect_objects()

    Returns
    -------
    dict
        Semantic scene understanding results.
    """

    height, width = image.shape[:2]

    # ------------------------------------------------------
    # Objects
    # ------------------------------------------------------

    objects = object_results.get(
        "objects",
        []
    )

    summary = object_results.get(
        "summary",
        {}
    )

    # ------------------------------------------------------
    # Face Detection
    # ------------------------------------------------------

    face_detected, face_bbox = detect_face(
        image
    )

    # ------------------------------------------------------
    # Low-Level Analysis
    # ------------------------------------------------------

    brightness = estimate_brightness(
        image
    )

    lighting_type = classify_lighting(
        brightness
    )

    light_direction = estimate_light_direction(
        image
    )

    background_complexity = estimate_background_complexity(
        image
    )

    # ------------------------------------------------------
    # Subject Position
    # ------------------------------------------------------

    if face_detected:

        subject_position = estimate_subject_position(
            face_bbox,
            width
        )

    else:

        primary = dominant_subject(
            objects
        )

        if primary is not None:

            subject_position = estimate_subject_position(
                primary.bbox,
                width
            )

        else:

            subject_position = "unknown"

    # ------------------------------------------------------
    # Scene Reasoning
    # ------------------------------------------------------

    scene_type = classify_scene(
        objects
    )

    environment = classify_environment(

        scene_type,

        brightness,

        background_complexity

    )

    composition = estimate_composition(
        objects
    )

    camera_distance = estimate_camera_distance(
        objects
    )

    primary = dominant_subject(
        objects
    )

    dominant_name = None

    if primary is not None:

        dominant_name = primary.class_name

    stats = object_statistics(
        objects
    )

    editing_priority = generate_editing_priority(

        scene_type,

        dominant_name,

        camera_distance,

        face_detected

    )

    # ------------------------------------------------------
    # Final Output
    # ------------------------------------------------------

    return {

        # ------------------------------
        # Face
        # ------------------------------

        "face_detected": face_detected,

        "face_bbox": face_bbox,

        # ------------------------------
        # Lighting
        # ------------------------------

        "brightness": round(
            brightness,
            3
        ),

        "lighting_type": lighting_type,

        "light_direction": light_direction,

        # ------------------------------
        # Scene
        # ------------------------------

        "scene_type": scene_type,

        "environment": environment,

        "composition": composition,

        "camera_distance": camera_distance,

        "dominant_subject": dominant_name,

        "subject_position": subject_position,

        # ------------------------------
        # Background
        # ------------------------------

        "background_complexity": background_complexity,

        # ------------------------------
        # Object Information
        # ------------------------------

        "object_statistics": stats,

        "object_summary": summary,

        # ------------------------------
        # Editing
        # ------------------------------

        "editing_priority": editing_priority

    }


# ==========================================================
# Standalone Test
# ==========================================================

if __name__ == "__main__":

    import cv2

    from src.analysis.object_detector import detect_objects

    image = cv2.imread("sample.jpg")

    if image is None:

        raise FileNotFoundError(
            "sample.jpg not found."
        )

    object_results = detect_objects(
        image
    )

    result = understand_scene(

        image,

        object_results

    )

    from pprint import pprint

    pprint(result)