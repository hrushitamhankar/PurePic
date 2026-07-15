import cv2

from src.analysis.scene_understanding import (
    understand_scene
)

image = cv2.imread("target.jpg")

scene = understand_scene(image)

print("\n--- SCENE UNDERSTANDING ---\n")

for k, v in scene.items():

    print(f"{k}: {v}")