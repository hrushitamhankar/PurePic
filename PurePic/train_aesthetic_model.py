import os
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from sklearn.model_selection import train_test_split

# -----------------------------
# 1. Load Dataset
# -----------------------------
DATASET_DIR = "dataset"
GOOD_DIR = os.path.join(DATASET_DIR, "good")
BAD_DIR = os.path.join(DATASET_DIR, "bad")

def load_images():
    X = []
    y = []

    # GOOD = 1
    for file in os.listdir(GOOD_DIR):
        path = os.path.join(GOOD_DIR, file)
        try:
            img = load_img(path, target_size=(224, 224))
            img = img_to_array(img)
            img = preprocess_input(img)
            X.append(img)
            y.append(1)
        except:
            pass

    # BAD = 0
    for file in os.listdir(BAD_DIR):
        path = os.path.join(BAD_DIR, file)
        try:
            img = load_img(path, target_size=(224, 224))
            img = img_to_array(img)
            img = preprocess_input(img)
            X.append(img)
            y.append(0)
        except:
            pass

    return np.array(X), np.array(y)

print("Loading dataset...")
X, y = load_images()
print("Images loaded:", X.shape)

# -----------------------------
# 2. Split Dataset
# -----------------------------
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.3, random_state=42, shuffle=True
)

print("Dataset split complete.")
print("Training samples:", X_train.shape)
print("Validation samples:", X_val.shape)

# -----------------------------
# 3. Build Model (MobileNetV2)
# -----------------------------
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(64, activation="relu")(x)
preds = Dense(1, activation="sigmoid")(x)

model = Model(inputs=base_model.input, outputs=preds)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# -----------------------------
# 4. Train Model
# -----------------------------
print("Starting training...")

model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=12,
    batch_size=8,
    verbose=1
)

# -----------------------------
# 5. Evaluate
# -----------------------------
print("Evaluating model...")
val_loss, val_acc = model.evaluate(X_val, y_val)
print("Validation Accuracy:", val_acc)

# -----------------------------
# 6. Export to TFLite (Final format)
# -----------------------------
print("Exporting model to TFLite...")

converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

with open("purepic_aesthetic.tflite", "wb") as f:
    f.write(tflite_model)

print("\n==========================================")
print("TFLITE export successful: purepic_aesthetic.tflite")
print("==========================================\n")
