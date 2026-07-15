import sys
import os

sys.path.append(
    os.path.abspath("src")
)

import cv2

from analysis.scene_understanding import (
    understand_scene
)

from analysis.semantic_regions import (
    extract_semantic_regions
)

from analysis.genre_classifier import (
    classify_genre
)

# ---------------------------------------------
# Load Image
# ---------------------------------------------

image = cv2.imread(
    "sea.jpg"
)

if image is None:
    raise ValueError(
        "Could not load image."
    )

# ---------------------------------------------
# Scene Understanding
# ---------------------------------------------

scene_data = understand_scene(
    image
)

# ---------------------------------------------
# Semantic Regions
# ---------------------------------------------

semantic_regions = extract_semantic_regions(
    image
)

# ---------------------------------------------
# Genre Classification
# ---------------------------------------------

genre_info = classify_genre(
    scene_data,
    semantic_regions
)

# ---------------------------------------------
# Results
# ---------------------------------------------

print("\n--- GENRE CLASSIFICATION ---\n")

print(
    "Genre:",
    genre_info["genre"]
)

print(
    "Confidence:",
    genre_info["confidence"]
)

print(
    "Secondary Genres:",
    genre_info["secondary_genres"]
)

print(
    "Reasoning:"
)

for reason in genre_info["reasoning"]:
    print(
        " •",
        reason
    )