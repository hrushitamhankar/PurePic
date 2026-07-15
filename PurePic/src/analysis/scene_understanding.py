import cv2
import numpy as np

# -------------------------------------------------
# Mediapipe Loader
# -------------------------------------------------

def create_face_detector():

    try:
        import mediapipe as mp

        detector = mp.solutions.face_detection.FaceDetection(
            model_selection=1,
            min_detection_confidence=0.5
        )

        return detector

    except Exception as e:

        print(
            "MediaPipe face detector unavailable:",
            e
        )

        return None


# -------------------------------------------------
# Utility
# -------------------------------------------------

def clamp(value):

    return max(
        0,
        min(value, 1)
    )


# -------------------------------------------------
# Light Direction Estimation
# -------------------------------------------------

def estimate_light_direction(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    h, w = gray.shape

    left_half = gray[:, :w // 2]
    right_half = gray[:, w // 2:]

    left_brightness = np.mean(
        left_half
    )

    right_brightness = np.mean(
        right_half
    )

    if left_brightness > right_brightness:

        return "left"

    elif right_brightness > left_brightness:

        return "right"

    return "balanced"


# -------------------------------------------------
# Subject Position
# -------------------------------------------------

def estimate_subject_position(
    face_bbox,
    width
):

    if face_bbox is None:
        return "unknown"

    x1, y1, x2, y2 = face_bbox

    center_x = (
        x1 + x2
    ) / 2

    ratio = center_x / width

    if ratio < 0.33:
        return "left"

    elif ratio < 0.66:
        return "center"

    return "right"


# -------------------------------------------------
# Background Complexity
# -------------------------------------------------

def estimate_background_complexity(
    image
):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    edges = cv2.Canny(
        gray,
        100,
        200
    )

    complexity = (
        np.mean(edges) / 255
    )

    return float(
        round(
            complexity,
            3
        )
    )


# -------------------------------------------------
# Main Scene Understanding
# -------------------------------------------------

def understand_scene(image):

    h, w = image.shape[:2]

    face_detected = False
    face_bbox = None

    # ---------------------------------------------
    # Face Detection
    # ---------------------------------------------

    face_detector = create_face_detector()

    if face_detector is not None:

        try:

            rgb = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2RGB
            )

            results = face_detector.process(
                rgb
            )

            if results.detections:

                detection = (
                    results.detections[0]
                )

                bbox = (
                    detection
                    .location_data
                    .relative_bounding_box
                )

                x = int(
                    bbox.xmin * w
                )

                y = int(
                    bbox.ymin * h
                )

                bw = int(
                    bbox.width * w
                )

                bh = int(
                    bbox.height * h
                )

                x2 = x + bw
                y2 = y + bh

                face_bbox = [
                    x,
                    y,
                    x2,
                    y2
                ]

                face_detected = True

        except Exception as e:

            print(
                "Face detection failed:",
                e
            )

    # ---------------------------------------------
    # Lighting
    # ---------------------------------------------

    light_direction = (
        estimate_light_direction(
            image
        )
    )

    # ---------------------------------------------
    # Subject Position
    # ---------------------------------------------

    subject_position = (
        estimate_subject_position(
            face_bbox,
            w
        )
    )

    # ---------------------------------------------
    # Background Complexity
    # ---------------------------------------------

    background_complexity = (
        estimate_background_complexity(
            image
        )
    )

    # ---------------------------------------------
    # Output
    # ---------------------------------------------

    return {

        "face_detected":
            face_detected,

        "face_bbox":
            face_bbox,

        "light_direction":
            light_direction,

        "subject_position":
            subject_position,

        "background_complexity":
            background_complexity
    }