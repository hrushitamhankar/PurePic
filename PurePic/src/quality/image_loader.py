import cv2
import rawpy
import os
import numpy as np

from PIL import Image
from pillow_heif import register_heif_opener

# Enable HEIC/HEIF support in PIL
register_heif_opener()

# -------------------------------------------------
# Supported Formats
# -------------------------------------------------

RAW_EXT = (
    ".cr2",
    ".cr3",
    ".nef",
    ".arw",
    ".dng",
    ".orf",
    ".raf",
    ".rw2"
)

HEIF_EXT = (
    ".heic",
    ".heif"
)

STANDARD_EXT = (
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
    ".tif",
    ".tiff"
)

SUPPORTED_EXT = (
    RAW_EXT
    + HEIF_EXT
    + STANDARD_EXT
)

# -------------------------------------------------
# HEIC / HEIF Loader
# -------------------------------------------------

def load_heif(image_path):
    try:
        image = Image.open(image_path).convert("RGB")

        image = np.array(image)

        image = cv2.cvtColor(
            image,
            cv2.COLOR_RGB2BGR
        )

        return image

    except Exception as e:
        print("HEIC decode failed:", e)
        return None


# -------------------------------------------------
# FAST VISUAL PREVIEW
# Used for AI, sorting, perception models
# -------------------------------------------------

def load_preview(image_path):

    ext = os.path.splitext(
        image_path
    )[1].lower()

    # -----------------------------------------
    # RAW Preview Extraction
    # -----------------------------------------

    if ext in RAW_EXT:

        try:
            with rawpy.imread(image_path) as raw:

                thumb = raw.extract_thumb()

                if thumb.format == rawpy.ThumbFormat.JPEG:

                    return cv2.imdecode(
                        np.frombuffer(
                            thumb.data,
                            np.uint8
                        ),
                        cv2.IMREAD_COLOR
                    )

                elif thumb.format == rawpy.ThumbFormat.BITMAP:

                    return cv2.cvtColor(
                        thumb.data,
                        cv2.COLOR_RGB2BGR
                    )

        except Exception as e:
            print(
                "RAW preview load failed:",
                e
            )
            return None

    # -----------------------------------------
    # HEIC / HEIF
    # -----------------------------------------

    elif ext in HEIF_EXT:

        return load_heif(
            image_path
        )

    # -----------------------------------------
    # Standard Formats
    # -----------------------------------------

    return cv2.imread(
        image_path
    )


# -------------------------------------------------
# TRUE RAW SENSOR LOAD
# Used for technical quality analysis
# -------------------------------------------------

def load_raw(image_path):

    ext = os.path.splitext(
        image_path
    )[1].lower()

    # -----------------------------------------
    # RAW Processing
    # -----------------------------------------

    if ext in RAW_EXT:

        try:

            with rawpy.imread(
                image_path
            ) as raw:

                rgb = raw.postprocess(
                    half_size=True,
                    use_camera_wb=True,
                    no_auto_bright=True,
                    output_bps=8
                )

            return cv2.cvtColor(
                rgb,
                cv2.COLOR_RGB2BGR
            )

        except Exception as e:
            print(
                "RAW decode failed:",
                e
            )
            return None

    # -----------------------------------------
    # HEIC / HEIF
    # -----------------------------------------

    elif ext in HEIF_EXT:

        return load_heif(
            image_path
        )

    # -----------------------------------------
    # Standard Formats
    # -----------------------------------------

    return cv2.imread(
        image_path
    )