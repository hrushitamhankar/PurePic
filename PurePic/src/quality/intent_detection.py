import cv2
import numpy as np
from src.quality.image_loader import load_preview


def detect_photographer_intent(image_source):

    img = load_preview(image_source)
    if img is None:
        return 0, False

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    h, w = gray.shape

    center = gray[h//4:3*h//4, w//4:3*w//4]

    center_sharp = cv2.Laplacian(center, cv2.CV_64F).var()
    global_sharp = cv2.Laplacian(gray, cv2.CV_64F).var()

    gradient = cv2.GaussianBlur(gray, (21,21), 0)
    smoothness = np.std(gray - gradient)

    intentional = False
    bonus = 0

    if center_sharp > global_sharp * 0.9:
        intentional = True
        bonus += 10

    if smoothness < 18:
        intentional = True
        bonus += 6

    bonus = min(bonus, 20)

    return bonus, intentional
