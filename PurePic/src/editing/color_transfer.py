import cv2
import numpy as np

def apply_color_transfer(source, target):
    """
    Transfers color distribution from source → target
    using LAB statistics matching
    """

    # Convert to LAB
    source_lab = cv2.cvtColor(source, cv2.COLOR_BGR2LAB).astype(np.float32)
    target_lab = cv2.cvtColor(target, cv2.COLOR_BGR2LAB).astype(np.float32)

    # Compute mean & std
    src_mean, src_std = cv2.meanStdDev(source_lab)
    tgt_mean, tgt_std = cv2.meanStdDev(target_lab)

    src_mean = src_mean.flatten()
    src_std = src_std.flatten()
    tgt_mean = tgt_mean.flatten()
    tgt_std = tgt_std.flatten()

    # Apply transfer
    result = target_lab.copy()

    for i in range(3):
        result[:,:,i] = (
            (result[:,:,i] - tgt_mean[i]) * 
            (src_std[i] / (tgt_std[i] + 1e-6)) +
            src_mean[i]
        )

    # Clip values
    result = np.clip(result, 0, 255)

    # Convert back to BGR
    result = cv2.cvtColor(result.astype(np.uint8), cv2.COLOR_LAB2BGR)

    return result