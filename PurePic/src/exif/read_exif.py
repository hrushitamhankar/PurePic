from PIL import Image
from PIL.ExifTags import TAGS
import os

def read_exif(image_path):
    data = {
        "ISO": None,
        "ShutterSpeed": None,
        "Aperture": None,
        "FocalLength": None
    }

    try:
        img = Image.open(image_path)
        exif = img._getexif()

        if exif is None:
            return data

        for tag_id, value in exif.items():
            tag = TAGS.get(tag_id, tag_id)

            if tag == "ISOSpeedRatings":
                data["ISO"] = value
            elif tag == "ExposureTime":
                data["ShutterSpeed"] = value
            elif tag == "FNumber":
                data["Aperture"] = value
            elif tag == "FocalLength":
                data["FocalLength"] = value

    except Exception as e:
        print(f"Error reading {image_path}: {e}")

    return data


if __name__ == "__main__":
    sample_dir = r"E:\PurePic\PurePic\sample_photos"

    for file in os.listdir(sample_dir):
        if file.lower().endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(sample_dir, file)
            exif_data = read_exif(path)
            print(file, "->", exif_data)

