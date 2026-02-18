import subprocess
import json
import os

EXIFTOOL_PATH = os.path.join(os.getcwd(), "exiftool.exe")


def convert_shutter(speed):
    if speed is None:
        return None
    
    if isinstance(speed, float) or isinstance(speed, int):
        return float(speed)

    if isinstance(speed, str) and "/" in speed:
        num, den = speed.split("/")
        return float(num) / float(den)

    try:
        return float(speed)
    except:
        return None


def convert_focal_length(value):
    if value is None:
        return None

    # If numeric already
    try:
        return float(value)
    except:
        pass

    # If string contains "mm"
    if isinstance(value, str):
        cleaned = value.replace("mm", "").strip()
        try:
            return float(cleaned)
        except:
            return None

    return None


def read_exif_with_exiftool(image_path):

    cmd = [
        EXIFTOOL_PATH,
        "-json",
        "-ISO",
        "-ExposureTime",
        "-FNumber",
        "-FocalLength",
        "-LensModel",
        "-Model",
        image_path
    ]

    try:
        result = subprocess.run(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        if result.stderr and "Warning" not in result.stderr:
            print("ExifTool error:", result.stderr)

        raw_data = json.loads(result.stdout)[0]

        exif_data = {
            "ISO": raw_data.get("ISO"),
            "ShutterSpeed": convert_shutter(raw_data.get("ExposureTime")),
            "Aperture": float(raw_data.get("FNumber")) if raw_data.get("FNumber") else None,
            "FocalLength": convert_focal_length(raw_data.get("FocalLength")),
            "Lens": raw_data.get("LensModel"),
            "Camera": raw_data.get("Model")
        }

        return exif_data

    except Exception as e:
        print("Error:", e)
        return None


if __name__ == "__main__":
    sample_dir = os.path.join(os.getcwd(), "sample_photos")

    for file in os.listdir(sample_dir):
        path = os.path.join(sample_dir, file)

        # Skip non-image files
        if not file.lower().endswith((".jpg", ".jpeg", ".cr2", ".nef", ".arw", ".png", ".dng")):
            continue

        exif = read_exif_with_exiftool(path)
        print(file, "->", exif)
