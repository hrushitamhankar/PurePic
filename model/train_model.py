import pandas as pd
import re
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline

# 1. Load dataset
df = pd.read_csv('../data/mobiles.csv', low_memory=False)

# Clean Brand and Name
df['Brand'] = df['Brand'].astype(str).str.strip()
df['Name'] = df['Name'].astype(str).str.strip()

# Extract memory values
def parse_memory(val):
    if pd.isna(val):
        return None
    val = str(val).upper()
    match_gb = re.search(r'(\d+)\s*GB', val)
    if match_gb:
        return float(match_gb.group(1))
    match_mb = re.search(r'(\d+)\s*MB', val)
    if match_mb:
        return float(match_mb.group(1)) / 1024.0
    return None

df['ram_gb'] = df['Memory.RAM'].apply(parse_memory)
df['storage_gb'] = df['Memory.Storage'].apply(parse_memory)
df['price'] = df['Price'].astype(float)

clean_df = df.dropna(subset=['ram_gb', 'storage_gb', 'price']).copy()
clean_df = clean_df[(clean_df['price'] > 500) & (clean_df['ram_gb'] >= 1)]

# Select Top 15 Brands
top_brands = clean_df['Brand'].value_counts().head(15).index.tolist()
clean_df['brand'] = clean_df['Brand'].apply(lambda x: x if x in top_brands else 'Other')

# Build a dictionary mapping each brand to its top 20 models for the dropdown
brand_models = {}
for brand in top_brands:
    models = clean_df[clean_df['brand'] == brand]['Name'].value_counts().head(20).index.tolist()
    brand_models[brand] = models if models else ["Standard Model"]
brand_models['Other'] = ["Standard Model"]

# Save brand-model map for the GUI
joblib.dump(brand_models, '../model/brand_models.pkl')

# 2. Features & Target
X = clean_df[['brand', 'Name', 'ram_gb', 'storage_gb']].rename(columns={'Name': 'model_name'})
y = clean_df['price']

categorical_cols = ['brand', 'model_name']
numerical_cols = ['ram_gb', 'storage_gb']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numerical_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
    ]
)

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=50, max_depth=15, random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model_pipeline.fit(X_train, y_train)

joblib.dump(model_pipeline, '../model/model.pkl', compress=3)
print("✅ Trained pipeline and exported brand-model map successfully!")