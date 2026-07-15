import cv2
import tempfile
import os

def save_temp_image(image):
    """
    Save numpy image to temporary file
    """
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    temp_path = temp_file.name
    temp_file.close()

    cv2.imwrite(temp_path, image)

    return temp_path


def cleanup_temp_image(path):
    """
    Delete temporary file
    """
    if os.path.exists(path):
        os.remove(path)