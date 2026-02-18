import cv2
import rawpy
import os
import numpy as np

RAW_EXT = (".cr2", ".nef", ".arw", ".dng", ".orf", ".raf")


# -------------------------------------------------
# FAST VISUAL PREVIEW (FOR AI + PERCEPTION)
# -------------------------------------------------
def load_preview(image_path):

    ext = os.path.splitext(image_path)[1].lower()

    if ext in RAW_EXT:
        try:
            with rawpy.imread(image_path) as raw:
                thumb = raw.extract_thumb()

                if thumb.format == rawpy.ThumbFormat.JPEG:
                    return cv2.imdecode(
                        np.frombuffer(thumb.data, np.uint8),
                        cv2.IMREAD_COLOR
                    )

                elif thumb.format == rawpy.ThumbFormat.BITMAP:
                    return cv2.cvtColor(
                        thumb.data,
                        cv2.COLOR_RGB2BGR
                    )

        except Exception as e:
            print("Preview load failed:", e)
            return None

    return cv2.imread(image_path)


# -------------------------------------------------
# TRUE RAW SENSOR LOAD (FOR TECHNICAL ANALYSIS)
# -------------------------------------------------
def load_raw(image_path):

    ext = os.path.splitext(image_path)[1].lower()

    if ext in RAW_EXT:
        try:
            with rawpy.imread(image_path) as raw:
                rgb = raw.postprocess(
                    half_size=True,
                    use_camera_wb=True,
                    no_auto_bright=True,
                    output_bps=8
                )
            return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)

        except Exception as e:
            print("RAW decode failed:", e)
            return None

    return cv2.imread(image_path)
