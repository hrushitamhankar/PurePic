import os
import cv2
import numpy as np
import tensorflow as tf

# silence tensorflow spam
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from src.quality.image_loader import load_preview


# -------------------------------------------------
# MODEL PATH
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "purepic_aesthetic_v1.tflite")

IMAGE_SIZE = (224, 224)


# -------------------------------------------------
# LAZY INTERPRETER (MULTIPROCESS SAFE)
# -------------------------------------------------
interpreter = None
input_details = None
output_details = None


def get_interpreter():
    global interpreter, input_details, output_details

    if interpreter is None:
        print("\n=== LOADING AESTHETIC MODEL ===")
        print("MODEL PATH:", MODEL_PATH)

        interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
        interpreter.allocate_tensors()

        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        print("INPUT DETAILS:", input_details)
        print("OUTPUT DETAILS:", output_details)

    return interpreter, input_details, output_details


# -------------------------------------------------
# IMAGE PREPROCESSING
# -------------------------------------------------
def preprocess_image(img):
    """
    Convert RAW preview into perception-quality image
    suitable for AVA aesthetic model.
    """

    # ensure RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # upscale tiny RAW previews
    h, w = img.shape[:2]
    if min(h, w) < 512:
        scale = 512 / min(h, w)
        img = cv2.resize(
            img,
            (int(w * scale), int(h * scale)),
            interpolation=cv2.INTER_CUBIC
        )

    # gentle contrast normalization
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)

    img = cv2.merge((l, a, b))
    img = cv2.cvtColor(img, cv2.COLOR_LAB2RGB)

    # resize for model
    img = cv2.resize(img, IMAGE_SIZE)

    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)

    return img


# -------------------------------------------------
# AESTHETIC SCORE
# -------------------------------------------------
def aesthetic_score(image_path):
    """
    Returns AVA aesthetic score.

    Supports:
    - 10-bin AVA distribution output
    - single scalar output
    """

    img = load_preview(image_path)

    if img is None:
        return 0.0, "bad"

    img = preprocess_image(img)

    interpreter, input_details, output_details = get_interpreter()

    interpreter.set_tensor(input_details[0]["index"], img)
    interpreter.invoke()

    output = interpreter.get_tensor(output_details[0]["index"])
    print("RAW MODEL OUTPUT:", output)


    # -------------------------------------------------
    # HANDLE AVA DISTRIBUTION MODEL (MOST IMPORTANT FIX)
    # -------------------------------------------------
    if len(output.shape) == 2 and output.shape[1] == 10:
        # AVA probability distribution → mean score
        scores = np.arange(1, 11)
        aesthetic_value = float(np.sum(output[0] * scores))

    else:
        # single regression output
        aesthetic_value = float(output.flatten()[0])

    # debug safeguard
    if np.isnan(aesthetic_value):
        aesthetic_value = 0.0

    label = "good" if aesthetic_value >= 5 else "bad"

    return aesthetic_value, label
