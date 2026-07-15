import numpy as np
import cv2

def match_brightness_contrast(source, target):
    """
    Align brightness and contrast using mean/std in grayscale
    """

    src_gray = cv2.cvtColor(source, cv2.COLOR_BGR2GRAY)
    tgt_gray = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)

    src_mean, src_std = src_gray.mean(), src_gray.std()
    tgt_mean, tgt_std = tgt_gray.mean(), tgt_gray.std()

    result = target.astype(np.float32)

    result = (result - tgt_mean) * (src_std / (tgt_std + 1e-6)) + src_mean

    result = np.clip(result, 0, 255).astype(np.uint8)

    return result