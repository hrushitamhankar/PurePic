import cv2
import numpy as np

def match_histogram(source, target):
    """
    Matches histogram of target to source (per channel)
    """

    matched = np.zeros_like(target)

    for i in range(3):
        src_hist, _ = np.histogram(source[:,:,i].flatten(), 256, [0,256])
        tgt_hist, _ = np.histogram(target[:,:,i].flatten(), 256, [0,256])

        src_cdf = src_hist.cumsum()
        tgt_cdf = tgt_hist.cumsum()

        src_cdf = src_cdf / src_cdf[-1]
        tgt_cdf = tgt_cdf / tgt_cdf[-1]

        lookup = np.zeros(256)

        for j in range(256):
            diff = np.abs(src_cdf - tgt_cdf[j])
            lookup[j] = np.argmin(diff)

        matched[:,:,i] = cv2.LUT(target[:,:,i], lookup.astype(np.uint8))

    return matched