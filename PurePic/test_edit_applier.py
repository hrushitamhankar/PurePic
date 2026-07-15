import cv2

from src.editing.edit_applier import (
    apply_lightroom_edits
)

# -------------------------------------------------
# Load Image
# -------------------------------------------------

image = cv2.imread(
    "target.jpg"
)

# -------------------------------------------------
# Sample Lightroom-style Edits
# -------------------------------------------------

edits = [

    {
        "slider": "Exposure",

        "value": 0.3
    },

    {
        "slider": "Contrast",

        "value": 20
    },

    {
        "slider": "Temperature",

        "value": 15
    },

    {
        "slider": "Highlights",

        "value": 20
    }
]

# -------------------------------------------------
# Apply Edits
# -------------------------------------------------

result = apply_lightroom_edits(
    image,
    edits
)

# -------------------------------------------------
# Save
# -------------------------------------------------

cv2.imwrite(
    "edited_output.jpg",
    result
)

print(
    "\nEdited image saved: edited_output.jpg\n"
)