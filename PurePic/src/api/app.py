import sys
import os

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

            # ---------------------------------------------
            # Analysis
            # ---------------------------------------------

            "analysis":

                results["analysis"],

            # ---------------------------------------------
            # Scene Understanding
            # ---------------------------------------------

            "scene_data":

                results["scene_data"],

            # ---------------------------------------------
            # Style Differences
            # ---------------------------------------------

            "style_diff":

                results["style_diff"],

            # ---------------------------------------------
            # Mask Scores
            # ---------------------------------------------

            "mask_scores":

                results["mask_scores"],

            # ---------------------------------------------
            # Top Masks
            # ---------------------------------------------

            "top_masks":

                [

                    {
                        "mask": name,

                        "score": float(score)
                    }

                    for name, score in
                    results["top_masks"]
                ],

            # ---------------------------------------------
            # Structured Masks
            # ---------------------------------------------

            "structured_masks":

                results["structured_masks"],

            # ---------------------------------------------
            # Overlay Preview URL
            # ---------------------------------------------

            "overlay_url":

                f"http://127.0.0.1:8000/static/{visualization_filename}"
        }

        return JSONResponse(
            content=response
        )

    except Exception as e:

        return JSONResponse(

            status_code=500,

            content={

                "error": str(e)
            }
        )