import numpy as np

from src.quality.sharpness import compute_quality
from src.quality.exposure_and_noise import exposure_noise_score
from aesthetic_inference import aesthetic_score
from src.quality.subject_intelligence import subject_intelligence
from src.quality.moment_detection import detect_moment
from src.quality.eye_focus import detect_eye_focus
from src.quality.intent_detection import detect_photographer_intent


# -------------------------------------------------
# EDITOR CONFIDENCE (NEW — STABLE VERSION)
# -------------------------------------------------
def editor_confidence(*signals):
    """
    Measures agreement between scoring systems.
    Prevents random good/reject mistakes.
    """

    arr = np.array(signals, dtype=np.float32)

    std = np.std(arr)

    # softer penalty (important)
    confidence = 100 - (std * 0.8)

    return float(np.clip(confidence, 10, 100))


# -------------------------------------------------
# HUMAN VISUAL SCORE
# -------------------------------------------------
def human_visual_score(
    technical,
    aesthetic,
    subject,
    moment,
    eye_focus,
    intent_bonus,
    confidence
):

    score = (
        technical * 0.28 +
        aesthetic * 0.32 +
        subject * 0.16 +
        moment * 0.08 +
        eye_focus * 0.16
    )

    score += intent_bonus

    # confidence stabilizer
    score *= (0.75 + confidence / 400)

    return float(np.clip(score, 0, 100))


# -------------------------------------------------
# FINAL EVALUATION
# -------------------------------------------------
def final_evaluation(image_path):

    # ---------- TECHNICAL ----------
    sharpness, blur = compute_quality(image_path)
    noise, exposure_label = exposure_noise_score(image_path)

    exposure = 50 if exposure_label == "normal" else 35

    technical_score = np.clip(
        sharpness * 0.5 +
        exposure * 0.4 -
        noise * 0.2,
        0, 100
    )

    # ---------- AESTHETIC ----------
    aesthetic_val, _ = aesthetic_score(image_path)

    # FIXED normalization (IMPORTANT)
    aesthetic_score_norm = np.clip(aesthetic_val * 100, 0, 100)

    # ---------- PERCEPTION ----------
    subject_val, strong_subject = subject_intelligence(image_path)
    moment_score = detect_moment(image_path)
    eye_focus_score = detect_eye_focus(image_path)

    intent_bonus, intent_type = detect_photographer_intent(image_path)

    # -------------------------------------------------
    # GENRE ADAPTATION (MAJOR FIX)
    # -------------------------------------------------
    if intent_type == "portrait":

        # portraits don't require motion
        moment_score *= 0.4

        # face becomes subject automatically
        subject_val = max(subject_val, eye_focus_score * 0.6)

        # allow soft-light portraits
        if technical_score < 40:
            technical_score += 10

    elif intent_type == "wildlife":
        subject_val *= 1.2
        moment_score *= 1.3

    elif intent_type == "event":
        moment_score *= 1.1
        subject_val *= 1.1

    # ---------- CONFIDENCE ----------
    confidence = editor_confidence(
        technical_score,
        aesthetic_score_norm,
        subject_val,
        eye_focus_score
    )

    # ---------- FINAL SCORE ----------
    final_score = human_visual_score(
        technical_score,
        aesthetic_score_norm,
        subject_val,
        moment_score,
        eye_focus_score,
        intent_bonus,
        confidence
    )

    # -------------------------------------------------
    # EDITOR LABEL LOGIC (NO AMBIGUITY)
    # -------------------------------------------------
    if final_score >= 60:
        label = "artistic_keep"

    elif final_score >= 45:
        label = "good"

    elif final_score >= 42:
        label = "ok"

    else:
        label = "reject"

    # ---------- DEBUG ----------
    print("\nDEBUG ----------------")
    print("technical:", round(technical_score, 2))
    print("aesthetic:", round(aesthetic_score_norm, 2))
    print("subject:", round(subject_val, 2))
    print("moment:", round(moment_score, 2))
    print("eye_focus:", round(eye_focus_score, 2))
    print("intent:", intent_type)
    print("intent_bonus:", intent_bonus)
    print("confidence:", round(confidence, 2))
    print("final_score:", round(final_score, 2))
    print("label:", label)

    return {
        "final_label": label,
        "final_score": float(final_score),
        "technical_score": float(technical_score),
        "aesthetic_score": float(aesthetic_score_norm),
        "sharpness": float(sharpness),
        "blur": blur,
        "noise": float(noise),
        "exposure": exposure_label,
        "confidence": confidence,
    }
