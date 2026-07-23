import os
import customtkinter as ctk
import pandas as pd
import joblib

ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class ResaleEstimatorApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title(" Mobile Price Estimator")
        self.geometry("450x550")
        self.resizable(False, False)

        # File path handling
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        MODEL_PATH = os.path.join(BASE_DIR, "model", "model.pkl")
        BRAND_MODELS_PATH = os.path.join(BASE_DIR, "model", "brand_models.pkl")

        # Load ML model
        try:
            self.model = joblib.load(MODEL_PATH)
            print("Model loaded successfully!")
        except Exception as e:
            print("Model loading error:", e)
            self.model = None

        # Load Brand-Model mapping
        try:
            self.brand_models = joblib.load(BRAND_MODELS_PATH)
        except Exception:
            self.brand_models = {
                "Samsung": ["Samsung Galaxy A54 5G", "Samsung Galaxy S23"],
                "Apple": ["Apple iPhone 15", "Apple iPhone 14"],
                "OnePlus": ["OnePlus Nord 3 5G", "OnePlus 11R"],
                "Xiaomi": ["Xiaomi Redmi Note 12", "Xiaomi 13 Pro"]
            }

        # UI Header
        self.title_label = ctk.CTkLabel(self, text="Mobile Price Predictor", font=("Helvetica", 20, "bold"))
        self.title_label.pack(pady=15)

        # 1. Brand Selection Dropdown
        self.brand_label = ctk.CTkLabel(self, text="Brand:", font=("Helvetica", 12))
        self.brand_label.pack(anchor="w", padx=40)
        
        brands_list = list(self.brand_models.keys())
        self.brand_var = ctk.StringVar(value=brands_list[0])
        self.brand_dropdown = ctk.CTkOptionMenu(
            self, 
            values=brands_list, 
            variable=self.brand_var,
            command=self.update_models_dropdown
        )
        self.brand_dropdown.pack(fill="x", padx=40, pady=(0, 10))

        # 2. Model Name Selection Dropdown (Dynamic)
        self.model_label = ctk.CTkLabel(self, text="Model Name:", font=("Helvetica", 12))
        self.model_label.pack(anchor="w", padx=40)
        
        initial_models = self.brand_models[brands_list[0]]
        self.model_var = ctk.StringVar(value=initial_models[0])
        self.model_dropdown = ctk.CTkOptionMenu(
            self, 
            values=initial_models, 
            variable=self.model_var
        )
        self.model_dropdown.pack(fill="x", padx=40, pady=(0, 10))

        # 3. RAM Dropdown
        self.ram_label = ctk.CTkLabel(self, text="RAM (GB):", font=("Helvetica", 12))
        self.ram_label.pack(anchor="w", padx=40)
        self.ram_var = ctk.StringVar(value="8")
        self.ram_dropdown = ctk.CTkOptionMenu(self, values=["2", "4", "6", "8", "12", "16"], variable=self.ram_var)
        self.ram_dropdown.pack(fill="x", padx=40, pady=(0, 10))

        # 4. Storage Dropdown
        self.storage_label = ctk.CTkLabel(self, text="Storage (GB):", font=("Helvetica", 12))
        self.storage_label.pack(anchor="w", padx=40)
        self.storage_var = ctk.StringVar(value="128")
        self.storage_dropdown = ctk.CTkOptionMenu(self, values=["32", "64", "128", "256", "512"], variable=self.storage_var)
        self.storage_dropdown.pack(fill="x", padx=40, pady=(0, 15))

        # 5. Predict Button
        self.predict_btn = ctk.CTkButton(self, text="Predict Price", command=self.predict_price, font=("Helvetica", 14, "bold"))
        self.predict_btn.pack(padx=40, pady=10)

        # Output Result Area
        self.result_label = ctk.CTkLabel(self, text="", font=("Helvetica", 16, "bold"), text_color="#2ECC71")
        self.result_label.pack(pady=15)

    def update_models_dropdown(self, selected_brand):
        """Updates the Model Name dropdown list when Brand is changed."""
        models = self.brand_models.get(selected_brand, ["Standard Model"])
        self.model_dropdown.configure(values=models)
        self.model_var.set(models[0])

    def predict_price(self):
        if not self.model:
            self.result_label.configure(text="Error: Missing model file!", text_color="red")
            return

        input_data = pd.DataFrame([{
            "brand": self.brand_var.get(),
            "model_name": self.model_var.get(),
            "ram_gb": float(self.ram_var.get()),
            "storage_gb": float(self.storage_var.get())
        }])

        predicted_price = self.model.predict(input_data)[0]
        self.result_label.configure(
            text=f"Estimated Price: ₹{predicted_price:,.0f}",
            text_color="#2ECC71"
        )

if __name__ == "__main__":
    app = ResaleEstimatorApp()
    app.mainloop()