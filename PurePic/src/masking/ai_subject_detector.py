import cv2
import numpy as np

from ultralytics import YOLO


# -------------------------------------------------
# Load YOLO Segmentation Model
# -------------------------------------------------

model = YOLO("yolov8n-seg.pt")


# -------------------------------------------------
# Normalize Utility
# -------------------------------------------------

def normalize_map(arr):

    arr = arr.astype(np.float32)

    arr -= arr.min()

    if arr.max() > 0:
        arr /= arr.max()

    return arr


# -------------------------------------------------
# AI Subject Detection
# -------------------------------------------------

def detect_subject_mask(image):

    h, w = image.shape[:2]

    # ---------------------------------------------
    # Run YOLO Segmentation
    # ---------------------------------------------

    results = model.predict(
        image,
        verbose=False
    )

    # ---------------------------------------------
    # Empty mask
    # ---------------------------------------------

    final_mask = np.zeros((h, w), dtype=np.float32)

    # ---------------------------------------------
    # Extract masks
    # ---------------------------------------------

    for result in results:

        if result.masks is None:
            continue

        masks = result.masks.data.cpu().numpy()

        # -----------------------------------------
        # Merge all detected masks
        # -----------------------------------------

        for m in masks:

            resized = cv2.resize(
                m,
                (w, h)
            )

            final_mask = np.maximum(
                final_mask,
                resized
            )

    # ---------------------------------------------
    # Smooth mask
    # ---------------------------------------------

    final_mask = cv2.GaussianBlur(
        final_mask,
        (31, 31),
        0
    )

    final_mask = normalize_map(final_mask)

    return final_mask