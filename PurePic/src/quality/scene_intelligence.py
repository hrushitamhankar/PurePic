import cv2
import numpy as np
from .subject_intelligence import subject_intelligence


def detect_scene_type(image_path):

    subject_score, strong_subject = subject_intelligence(image_path)

    img = cv2.imread(image_path)
    if img is None:
        return "unknown"

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # contrast measurement
    contrast = gray.std()

    # edge density
    edges = cv2.Canny(gray, 80, 160)
    edge_density = edges.mean()

    # ---- HEURISTICS ----

    # Portrait → strong subject + low edges + soft contrast
    if strong_subject and edge_density < 18 and contrast < 55:
        return "portrait"

    # Wildlife / action
    if strong_subject and edge_density > 25:
        return "action"

    # Landscape
    if strong_subject is False and edge_density < 15:
        return "landscape"

    return "general"
