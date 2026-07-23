import os
import streamlit as st
import pandas as pd
import joblib

# Set page configuration
st.set_page_config(
    page_title="Mobile Price Estimator",
    page_icon="",
    layout="centered"
)

# Custom Styling
st.title(" Mobile Resale Price Estimator")
st.write("Select your device details below to estimate its market resale price.")
st.markdown("---")

# Base directory setup for reliable paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.pkl")
BRAND_MODELS_PATH = os.path.join(BASE_DIR, "model", "brand_models.pkl")

# Load model and brand-model dictionary
@st.cache_resource
def load_ml_assets():
    try:
        model = joblib.load(MODEL_PATH)
        brand_models = joblib.load(BRAND_MODELS_PATH)
        return model, brand_models
    except Exception as e:
        st.error(f"Error loading model files: {e}")
        return None, None

model, brand_models = load_ml_assets()

if model and brand_models:
    # 1. Brand Selection
    brands = list(brand_models.keys())
    selected_brand = st.selectbox("Select Brand:", brands)

    # 2. Dynamic Model Selection based on chosen Brand
    available_models = brand_models.get(selected_brand, ["Standard Model"])
    selected_model = st.selectbox("Select Model Name:", available_models)

    # 3. Specs Selection
    col1, col2 = st.columns(2)
    with col1:
        ram_gb = st.selectbox("RAM (GB):", [2, 4, 6, 8, 12, 16], index=3)
    with col2:
        storage_gb = st.selectbox("Storage (GB):", [32, 64, 128, 256, 512], index=2)

    st.markdown("<br>", unsafe_allow_html=True)

    # 4. Predict Button
    if st.button("Calculate Estimated Price ", use_container_width=True):
        input_data = pd.DataFrame([{
            "brand": selected_brand,
            "model_name": selected_model,
            "ram_gb": float(ram_gb),
            "storage_gb": float(storage_gb)
        }])

        predicted_price = model.predict(input_data)[0]

        # Display Result
        st.success(f"### Estimated Price: ₹{predicted_price:,.0f}")
        st.info(" *Note: Final value depends on screen condition, battery health, and original box/accessories availability.*")
else:
    st.warning("Please make sure `model.pkl` and `brand_models.pkl` exist inside the `model/` directory.")