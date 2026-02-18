import numpy as np
import os
import sys

# -------------------------------------------------
# PROJECT ROOT PATH FIX
# -------------------------------------------------
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(CURRENT_DIR))

if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

# -------------------------------------------------
# IMPORT MODULES
# -------------------------------------------------
from aesthetic_inference import aesthetic_score
from src.quality.sharpness import compute_quality
from src.quality.exposure_and_noise import exposure_noise_score
from src.quality.subject_intelligence import subject_intelligence
from src.quality.moment_detection import moment_score
from src.quality.eye_focus import eye_focus_score


# =================================================
# ADAPTIVE PHOTOGRAPHER MEMORY
# =================================================
ADAPTIVE_BIAS = {
    "technical": 0.0,
    "aesthetic": 0.0,
    "subject": 0.0,
    "count": 0
}


def update_bias(t, a, s):
    c = ADAPTIVE_BIAS["count"]

    ADAPTIVE_BIAS["technical"] = (ADAPTIVE_BIAS["technical"]*c + t)/(c+1)
    ADAPTIVE_BIAS["aesthetic"] = (ADAPTIVE_BIAS["aesthetic"]*c + a)/(c+1)
    ADAPTIVE_BIAS["subject"] = (ADAPTIVE_BIAS["subject"]*c + s)/(c+1)

    ADAPTIVE_BIAS["count"] += 1


def apply_adaptive_bias(score, t, a, s):

    if ADAPTIVE_BIAS["count"] < 5:
        return score

    bonus = 0
    if s > ADAPTIVE_BIAS["subject"]:
        bonus += 4
    if a > ADAPTIVE_BIAS["aesthetic"]:
        bonus += 3
    if t > ADAPTIVE_BIAS["technical"]:
        bonus += 2

    return min(score + bonus, 100)


# =================================================
# HUMAN PERCEPTION CURVE
# =================================================
def perception_curve(score):
    x = score / 100.0
    curved = 1 / (1 + np.exp(-6 * (x - 0.5)))
    return curved * 100


# =================================================
# CONFIDENCE STABILIZER
# =================================================
def stabilize_decision(t, a, s, score):

    confidence = 0
    if t > 30: confidence += 1
    if a > 45: confidence += 1
    if s > 10: confidence += 1

    if confidence >= 2 and score < 40:
        score += 12

    return min(score, 100)


# =================================================
# REJECT CONFIDENCE
# =================================================
def reject_confidence(t, a, s, moment, eye, strong):

    reject_score = 0

    if t < 25: reject_score += 1
    if a < 40: reject_score += 1
    if s < 8: reject_score += 1
    if moment < 4: reject_score += 1
    if eye < 6: reject_score += 1

    return reject_score >= 4 and not strong


# =================================================
# SCENE PROFILE (MULTI-GENRE ADAPTATION)
# =================================================
def estimate_scene_profile(t, a, s, moment):

    if s > 18 and moment > 6:
        return "action"

    if s > 14 and t > 40 and moment < 5:
        return "portrait"

    if t > 60 and s < 12:
        return "landscape"

    return "general"


# =================================================
# HUMAN SCORE FUSION
# =================================================
def human_visual_score(t, a, s, strong, scene):

    if scene == "action":
        wt, wa, ws = 0.25, 0.30, 0.45

    elif scene == "portrait":
        wt, wa, ws = 0.35, 0.40, 0.25

    elif scene == "landscape":
        wt, wa, ws = 0.50, 0.35, 0.15

    else:
        wt, wa, ws = 0.30, 0.35, 0.35

    score = t*wt + a*wa + s*ws

    if strong:
        score += 8

    return float(np.clip(score, 0, 100))


# =================================================
# FINAL EVALUATION
# =================================================
def final_evaluation(image_path):

    # ---------- TECHNICAL ----------
    sharpness, blur = compute_quality(image_path)
    noise, exposure_label = exposure_noise_score(image_path)

    exposure_score = 55 if exposure_label == "normal" else 35

    technical_score = np.clip(
        (sharpness * 0.55) +
        (exposure_score * 0.35) -
        (noise * 0.25),
        0, 100
    )

    # ---------- AESTHETIC ----------
    aesthetic_val, _ = aesthetic_score(image_path)
    aesthetic_norm = np.clip((aesthetic_val - 45) * 2.2, 0, 100)

    # ---------- SUBJECT ----------
    subject_val, strong_subject = subject_intelligence(image_path)

    # ---------- MOMENT ----------
    moment_val = moment_score(image_path)
    if moment_val > 6:
        subject_val += 6
        strong_subject = True

    # ---------- EYE FOCUS ----------
    eye_val = eye_focus_score(image_path)
    if eye_val > 9:
        subject_val += 8
        strong_subject = True

    # ---------- SCENE PROFILE ----------
    scene_type = estimate_scene_profile(
        technical_score,
        aesthetic_norm,
        subject_val,
        moment_val
    )

    # ---------- HUMAN SCORE ----------
    final_score = human_visual_score(
        technical_score,
        aesthetic_norm,
        subject_val,
        strong_subject,
        scene_type
    )

    final_score = stabilize_decision(
        technical_score,
        aesthetic_norm,
        subject_val,
        final_score
    )

    final_score = apply_adaptive_bias(
        final_score,
        technical_score,
        aesthetic_norm,
        subject_val
    )

    final_score = perception_curve(final_score)

    # =================================================
    # ABSOLUTE DECISION
    # =================================================
    technical_ok = technical_score >= 28
    aesthetic_ok = aesthetic_norm >= 45
    subject_ok = subject_val >= 10

    if strong_subject and aesthetic_ok:
        final_label = "artistic_keep"

    elif technical_ok and aesthetic_ok and subject_ok:
        final_label = "good"

    elif aesthetic_ok or subject_ok:
        final_label = "ok"

    else:
        should_reject = reject_confidence(
            technical_score,
            aesthetic_norm,
            subject_val,
            moment_val,
            eye_val,
            strong_subject
        )

        final_label = "bad" if should_reject else "ok"

    update_bias(technical_score, aesthetic_norm, subject_val)

    # ---------- DEBUG ----------
    print("\nDEBUG ----------------")
    print("scene:", scene_type)
    print("technical:", round(technical_score,2))
    print("aesthetic:", round(aesthetic_norm,2))
    print("subject:", round(subject_val,2))
    print("moment:", round(moment_val,2))
    print("eye:", round(eye_val,2))
    print("final_score:", round(final_score,2))
    print("label:", final_label)

    return {
        "final_label": final_label,
        "final_score": float(final_score),
        "technical_score": float(technical_score),
        "aesthetic_score": float(aesthetic_norm),
        "sharpness": float(sharpness),
        "blur": blur,
        "noise": float(noise),
        "exposure": exposure_label,
        "artistic": strong_subject,
        "moody_wildlife": strong_subject,
        "lowkey": exposure_label == "dark"
    }
