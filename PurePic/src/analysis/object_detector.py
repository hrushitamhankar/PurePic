"""
=========================================================
PurePic Object Detection Engine
---------------------------------------------------------

Author  : PurePic
Purpose : Universal object understanding layer

Features
--------
✓ YOLOv8 Segmentation
✓ Bounding Boxes
✓ Segmentation Masks
✓ Object Crops
✓ Area Calculation
✓ Center Calculation
✓ Primary Subject Detection
✓ Visualization
✓ Pipeline Ready

=========================================================
"""

import os
import cv2
import numpy as np
import torch

from ultralytics import YOLO
from dataclasses import dataclass
from typing import List, Dict, Any, Optional


# =========================================================
# Configuration
# =========================================================

MODEL_PATH = "yolov8n-seg.pt"

DEFAULT_CONFIDENCE = 0.35

DEFAULT_IOU = 0.45

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# =========================================================
# Dataclasses
# =========================================================

@dataclass
class DetectedObject:
    class_name: str
    confidence: float

    bbox: List[int]
    center: List[int]

    area: float

    crop: np.ndarray

    mask: np.ndarray

    binary_mask: np.ndarray

    polygon: np.ndarray

    contour: np.ndarray

    is_primary_subject: bool = False


# =========================================================
# Singleton Model Loader
# =========================================================

class ObjectDetector:

    _instance = None

    _model = None

    def __new__(cls):

        if cls._instance is None:

            cls._instance = super().__new__(cls)

        return cls._instance

    def __init__(self):

        if self._model is None:

            self.load_model()

    # -----------------------------------------------------

    def load_model(self):

        print("\nLoading YOLOv8 Segmentation Model...")

        if not os.path.exists(MODEL_PATH):

            raise FileNotFoundError(

                f"Model not found:\n{MODEL_PATH}"

            )

        self._model = YOLO(MODEL_PATH)

        self._model.to(DEVICE)

        print(f"Running on {DEVICE}")

        print("Model Loaded Successfully\n")


# =========================================================
# Utilities
# =========================================================

    @staticmethod
    def bbox_area(box):

        x1, y1, x2, y2 = box

        return max(0, x2 - x1) * max(0, y2 - y1)

    # -----------------------------------------------------

    @staticmethod
    def bbox_center(box):

        x1, y1, x2, y2 = box

        return [

            int((x1 + x2) / 2),

            int((y1 + y2) / 2)

        ]

    # -----------------------------------------------------

    @staticmethod
    def crop_image(image, box):

        x1, y1, x2, y2 = box

        return image[y1:y2, x1:x2].copy()

    # -----------------------------------------------------

    @staticmethod
    def normalize_area(area, image):

        h, w = image.shape[:2]

        return float(area) / float(h * w)

# =========================================================
# Detection Engine
# =========================================================

    def detect(

        self,
        image: np.ndarray,
        confidence=DEFAULT_CONFIDENCE,
        iou=DEFAULT_IOU

    ) -> Dict[str, Any]:

        if image is None:

            raise ValueError("Input image is None.")

        results = self._model.predict(

            source=image,

            conf=confidence,

            iou=iou,

            device=DEVICE,

            verbose=False

        )

        result = results[0]

        detections: List[DetectedObject] = []

        # -----------------------------------------------
        # Nothing Detected
        # -----------------------------------------------

        if result.boxes is None:

            return {

                "objects": [],

                "summary": {

                    "num_objects": 0,

                    "primary_subject": None,

                    "classes": []

                }

            }

        # -----------------------------------------------
        # Segmentation Masks
        # -----------------------------------------------

        masks = None

        if result.masks is not None:

            masks = result.masks.data.cpu().numpy()

        # -----------------------------------------------
        # Bounding Boxes
        # -----------------------------------------------

        boxes = result.boxes.xyxy.cpu().numpy()

        confidences = result.boxes.conf.cpu().numpy()

        classes = result.boxes.cls.cpu().numpy()

        largest_area = -1

        largest_index = -1

        for index, box in enumerate(boxes):

            x1, y1, x2, y2 = box.astype(int)

            bbox = [

                x1,

                y1,

                x2,

                y2

            ]

            area = self.bbox_area(bbox)

            if area > largest_area:

                largest_area = area

                largest_index = index

        # -----------------------------------------------
        # Build Objects
        # -----------------------------------------------

        for index, box in enumerate(boxes):

            x1, y1, x2, y2 = box.astype(int)

            bbox = [
                x1,
                y1,
                x2,
                y2
            ]

            crop = self.crop_image(
                image,
                bbox
            )

            segmentation_mask = None

            if masks is not None:
                segmentation_mask = masks[index]

            # -------------------------------------------
            # Build segmentation data
            # -------------------------------------------

            binary_mask = None
            polygon = None
            contour = None

            if segmentation_mask is not None:

                binary_mask = (segmentation_mask > 0.5).astype(np.uint8)

                contours, _ = cv2.findContours(
                    binary_mask,
                    cv2.RETR_EXTERNAL,
                    cv2.CHAIN_APPROX_SIMPLE
                )

                if len(contours) > 0:
                    contour = max(contours, key=cv2.contourArea)
                    polygon = contour.reshape(-1, 2)

            obj = DetectedObject(

                class_name=result.names[
                    int(classes[index])
                ],

                confidence=float(
                    confidences[index]
                ),

                bbox=bbox,

                center=self.bbox_center(
                    bbox
                ),

                area=self.normalize_area(
                    self.bbox_area(bbox),
                    image
                ),

                crop=crop,

                mask=segmentation_mask,

                binary_mask=binary_mask,

                polygon=polygon,

                contour=contour,

                is_primary_subject=(
                    index == largest_index
                )

            )

        detections.append(obj)

        # -----------------------------------------------
        # Summary
        # -----------------------------------------------

        detected_classes = list({

            d.class_name

            for d in detections

        })

        primary = None

        if largest_index != -1:

            primary = detections[

                largest_index

            ].class_name

        return {

            "objects": detections,

            "summary": {

                "num_objects": len(

                    detections

                ),

                "primary_subject": primary,

                "classes": detected_classes

            }

        }
        
# =========================================================
# Visualization
# =========================================================

    def draw_detections(
        self,
        image: np.ndarray,
        detections: List[DetectedObject]
    ) -> np.ndarray:

        output = image.copy()

        for obj in detections:

            x1, y1, x2, y2 = obj.bbox

            if obj.is_primary_subject:
                color = (0, 255, 0)
                thickness = 3
            else:
                color = (255, 180, 0)
                thickness = 2

            cv2.rectangle(
                output,
                (x1, y1),
                (x2, y2),
                color,
                thickness
            )

            label = f"{obj.class_name} {obj.confidence:.2f}"

            (w, h), _ = cv2.getTextSize(
                label,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                2
            )

            cv2.rectangle(
                output,
                (x1, y1 - h - 10),
                (x1 + w + 10, y1),
                color,
                -1
            )

            cv2.putText(
                output,
                label,
                (x1 + 5, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 0),
                2
            )

            cv2.circle(
                output,
                tuple(obj.center),
                5,
                (0, 0, 255),
                -1
            )

        return output


# =========================================================
# Save Helpers
# =========================================================

    def save_crops(
        self,
        detections: List[DetectedObject],
        output_dir="outputs/object_crops"
    ):

        os.makedirs(output_dir, exist_ok=True)

        for i, obj in enumerate(detections):

            filename = os.path.join(
                output_dir,
                f"{i+1}_{obj.class_name}.jpg"
            )

            cv2.imwrite(filename, obj.crop)


    def save_masks(
        self,
        detections: List[DetectedObject],
        output_dir="outputs/object_masks"
    ):

        os.makedirs(output_dir, exist_ok=True)

        for i, obj in enumerate(detections):

            if obj.mask is None:
                continue

            mask = cv2.resize(
                obj.mask.astype(np.uint8),
                (image.shape[1], image.shape[0]),
                interpolation=cv2.INTER_NEAREST
            )

            mask = mask * 255

            filename = os.path.join(
                output_dir,
                f"{i+1}_{obj.class_name}.png"
            )

            cv2.imwrite(filename, mask)


# =========================================================
# JSON Conversion
# =========================================================

    @staticmethod
    def to_json(
        detections: List[DetectedObject]
    ):

        result = []

        for obj in detections:

            result.append({

                "class": obj.class_name,

                "confidence": round(
                    obj.confidence,
                    4
                ),

                "bbox": obj.bbox,

                "center": obj.center,

                "area": round(
                    obj.area,
                    4
                ),

                "primary": obj.is_primary_subject

            })

        return result


# =========================================================
# Image Path Wrapper
# =========================================================

    def detect_from_path(
        self,
        image_path
    ):

        image = cv2.imread(image_path)

        if image is None:

            raise ValueError(
                f"Cannot load image:\n{image_path}"
            )

        return self.detect(image)


# =========================================================
# Singleton Instance
# =========================================================

_detector = ObjectDetector()


# =========================================================
# Public API
# =========================================================

def detect_objects(image):

    result = _detector.detect(image)

    return {

        "objects": result["objects"],

        "summary": result["summary"],

        "json": ObjectDetector.to_json(
            result["objects"]
        ),

        "visualization": _detector.draw_detections(
            image,
            result["objects"]
        )

    }


def detect_objects_from_path(image_path):

    image = cv2.imread(image_path)

    if image is None:

        raise ValueError("Image could not be loaded.")

    return detect_objects(image)