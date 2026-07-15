from quality.image_loader import load_raw


def load_image(path):

    image = load_raw(path)

    if image is None:

        raise ValueError(

            f"Could not load image: {path}"
        )

    return image