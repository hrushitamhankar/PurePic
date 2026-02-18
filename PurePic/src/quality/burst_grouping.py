import cv2
import numpy as np
from src.quality.image_loader import load_preview


def image_signature(path):

    img = load_preview(path)
    if img is None:
        return None

    img = cv2.resize(img, (64,64))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    return gray.flatten().astype(np.float32)


def signature_distance(a, b):
    if a is None or b is None:
        return 9999
    return np.linalg.norm(a - b)


def group_bursts(image_jobs, threshold=2200):

    groups = []
    current = []
    prev_sig = None

    for file, path in image_jobs:

        sig = image_signature(path)

        if prev_sig is None:
            current.append((file, path, sig))
            prev_sig = sig
            continue

        if signature_distance(prev_sig, sig) < threshold:
            current.append((file, path, sig))
        else:
            groups.append(current)
            current = [(file, path, sig)]

        prev_sig = sig

    if current:
        groups.append(current)

    return groups
