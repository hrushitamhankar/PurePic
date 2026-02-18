import os
import cv2
import numpy as np
import rawpy
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "purepic_aesthetic_v1.tflite")

IMAGE_SIZE = (224, 224)

# -------------------------------------------------------------
# LOAD TFLITE MODEL
# -------------------------------------------------------------
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()


# -------------------------------------------------------------
# IMAGE LOADER (RAW + JPG SUPPORT)
# -------------------------------------------------------------
def load_image_any_format(path):

    ext = path.lower()

    # RAW formats
    if ext.endswith((".cr2", ".nef", ".arw", ".dng", ".orf", ".raf")):
        try:
            with rawpy.imread(path) as raw:
                rgb = raw.postprocess(
                    use_camera_wb=True,
                    no_auto_bright=True,
                    output_bps=8
                )
            return rgb
        except Exception as e:
            print("RAW read error:", e)
            return None

    # Normal formats
    img = cv2.imread(path)
    if img is not None:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    return img


# -------------------------------------------------------------
# AESTHETIC INFERENCE
# -------------------------------------------------------------
def aesthetic_score(image_path):

    img = load_image_any_format(image_path)

    if img is None:
        raise ValueError("Could not decode image (RAW/JPG failed).")

    # resize + normalize
    img_resized = cv2.resize(img, IMAGE_SIZE)
    img_norm = img_resized.astype(np.float32) / 255.0
    img_norm = np.expand_dims(img_norm, axis=0)

    # inference
    interpreter.set_tensor(input_details[0]['index'], img_norm)
    interpreter.invoke()

    raw_output = interpreter.get_tensor(
        output_details[0]['index']
    )[0][0]

    # ---------------------------------------------------------
    # 🔥 CRITICAL FIX — SCALE CORRECTION
    # Model outputs 0–1 → convert to 0–100 aesthetic score
    # ---------------------------------------------------------
    aesthetic_value = float(raw_output) * 100.0

    # soft label only (used for debug, not decision)
    if aesthetic_value >= 70:
        label = "excellent"
    elif aesthetic_value >= 55:
        label = "good"
    else:
        label = "average"

    return aesthetic_value, label
