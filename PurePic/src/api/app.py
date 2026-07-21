import sys
import os
import traceback
import shutil
import uuid
import cv2
import numpy as np
from dataclasses import is_dataclass, asdict

# -------------------------------------------------
# JSON Safe Converter
# -------------------------------------------------

def make_json_safe(obj):

    if is_dataclass(obj):
        return make_json_safe(asdict(obj))

    if isinstance(obj, dict):
        return {
            str(k): make_json_safe(v)
            for k, v in obj.items()
        }

    if isinstance(obj, (list, tuple)):
        return [
            make_json_safe(v)
            for v in obj
        ]

    if isinstance(obj, np.integer):
        return int(obj)

    if isinstance(obj, np.floating):
        return float(obj)

    if isinstance(obj, np.bool_):
        return bool(obj)

    if isinstance(obj, np.ndarray):
        return obj.tolist()

    return obj

# -------------------------------------------------
# Add src/ to Python Path
# -------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

sys.path.append(BASE_DIR)

# -------------------------------------------------
# FastAPI Imports
# -------------------------------------------------

from fastapi import (
    FastAPI,
    UploadFile,
    File
)

from fastapi.responses import (
    JSONResponse
)

from fastapi.staticfiles import (
    StaticFiles
)

import shutil
import uuid
import cv2

# -------------------------------------------------
# Import Full Pipeline
# -------------------------------------------------

from pipeline.full_pipeline import (
    run_pipeline
)

# -------------------------------------------------
# FastAPI App
# -------------------------------------------------

app = FastAPI()

# -------------------------------------------------
# Temp Upload Directory
# -------------------------------------------------

TEMP_DIR = "temp_uploads"

os.makedirs(
    TEMP_DIR,
    exist_ok=True
)

# -------------------------------------------------
# Static File Serving
# -------------------------------------------------

app.mount(

    "/static",

    StaticFiles(directory=TEMP_DIR),

    name="static"
)

# -------------------------------------------------
# Utility Function
# -------------------------------------------------

def save_upload(upload_file):

    unique_name = (

        str(uuid.uuid4()) +

        "_" +

        upload_file.filename
    )

    path = os.path.join(

        TEMP_DIR,

        unique_name
    )

    with open(path, "wb") as buffer:

        shutil.copyfileobj(

            upload_file.file,

            buffer
        )

    return path

# -------------------------------------------------
# Root Endpoint
# -------------------------------------------------

@app.get("/")

def home():

    return {

        "message":

            "PurePic Backend Running"
    }

# -------------------------------------------------
# Reference Guided Masking Endpoint
# -------------------------------------------------

@app.post("/reference-masking")

async def reference_masking(

    target: UploadFile = File(...),

    reference: UploadFile = File(None)
):

    try:

        # =================================================
        # SAVE UPLOADS
        # =================================================

        target_path = save_upload(
            target
        )

        reference_path = None

        if reference is not None:

            reference_path = save_upload(
                reference
            )

        # =================================================
        # RUN FULL PIPELINE
        # =================================================

        results = run_pipeline(
            
            target_image_path=target_path,

            reference_image_path=reference_path
        )

        print(results.keys())
        analysis = results["analysis"].copy()
        
        # Replace raw DetectedObject list with JSON-safe version
        if "objects" in analysis:

            object_section = analysis["objects"]

            if isinstance(object_section, dict):

                analysis["objects"] = {

                "summary": object_section.get("summary", {}),

                "json": object_section.get("json", {})
            }

        # =================================================
        # SAVE OVERLAY OUTPUT
        # =================================================

        visualization_filename = (

            str(uuid.uuid4()) +

            "_overlay.jpg"
        )

        visualization_path = os.path.join(

            TEMP_DIR,

            visualization_filename
        )

        cv2.imwrite(

            visualization_path,

            results["visualization"]
        )

        # =================================================
        # BUILD RESPONSE
        # =================================================
        response = {

    "analysis": analysis,

    "scene_data": results["scene_data"],

    "style_diff": (
        results["style_diff"]["style_diff"]
        if isinstance(results["style_diff"], dict)
        and "style_diff" in results["style_diff"]
        else results["style_diff"]
    ),

    "mask_scores": {
        k: float(v)
        for k, v in results["mask_scores"].items()
    },

    "top_masks": [
        {
            "mask": name,
            "score": float(score)
        }
        for name, score in results["top_masks"]
    ],

    "structured_masks": results["structured_masks"],

    "overlay_url": f"http://127.0.0.1:8000/static/{visualization_filename}"
}
        

        response = make_json_safe(response)

        return JSONResponse(
        content=response
        )

    except Exception as e:

        print("\n" + "=" * 80)
        print("PurePic Pipeline Exception")
        print("=" * 80)

        traceback.print_exc()

        print("=" * 80)
        print(f"Exception Type : {type(e).__name__}")
        print(f"Exception      : {e}")
        print("=" * 80 + "\n")

        return JSONResponse(

            status_code=500,

            content={

                "error": str(e),
                "exception_type": type(e).__name__
            }
        )