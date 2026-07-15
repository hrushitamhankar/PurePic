from .color_transfer import apply_color_transfer
from .histogram_match import match_histogram
from .tone_adjust import match_brightness_contrast

def apply_style(reference_img, target_img):
    """
    Main editing pipeline
    """

    # Step 1: Color transfer
    img = apply_color_transfer(reference_img, target_img)

    # Step 2: Histogram alignment
    img = match_histogram(reference_img, img)

    # Step 3: Tone adjustment
    img = match_brightness_contrast(reference_img, img)

    return img