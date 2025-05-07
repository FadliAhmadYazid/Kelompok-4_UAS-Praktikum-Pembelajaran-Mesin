from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi import Request

import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
import io
from PIL import Image
import uvicorn
import os

# Membuat direktori untuk static files jika belum ada
os.makedirs("static/img", exist_ok=True)
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)
os.makedirs("templates", exist_ok=True)
os.makedirs("model", exist_ok=True)

# Inisialisasi aplikasi FastAPI
app = FastAPI(
    title="API Klasifikasi Alas Kaki",
    description="API untuk klasifikasi gambar alas kaki (Boot, Sandal, Shoe) menggunakan model CNN",
    version="1.0.0",
)

# Aktifkan CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Set up templates
templates = Jinja2Templates(directory="templates")

# Variabel global untuk model
model = None

# Kelas label
class_mapping = {0: "Boot", 1: "Sandal", 2: "Shoe"}

# Fungsi untuk memuat model
def load_keras_model():
    global model
    try:
        model_path = "model/model_2_cnn_shoe_sandal_boot.h5"
        model = load_model(model_path)
        print(f"Model berhasil dimuat dari {model_path}!")
        return True
    except Exception as e:
        print(f"Error memuat model: {e}")
        model = None
        return False

# Jalankan fungsi ini saat aplikasi dimulai
@app.on_event("startup")
async def startup_event():
    success = load_keras_model()
    if not success:
        print("PERINGATAN: Model tidak dapat dimuat. Aplikasi mungkin tidak berfungsi dengan benar.")

# Fungsi untuk preprocessing gambar
def preprocess_image(image):
    # Konversi gambar ke RGB untuk memastikan hanya 3 channel
    image = image.convert('RGB')
    
    # Resize gambar ke 128x128
    image = image.resize((128, 128))
    
    # Konversi ke array dan normalisasi
    image_array = img_to_array(image)
    image_array = image_array / 255.0  # Normalisasi
    
    # Tambahkan dimensi batch
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# Fungsi untuk memprediksi gambar
def predict_image(image_array, threshold=0.7):
    if model is None:
        raise HTTPException(status_code=500, detail="Model belum dimuat")

    # Lakukan prediksi
    predictions = model.predict(image_array)
    
    # Dapatkan indeks kelas dengan probabilitas tertinggi
    class_idx = np.argmax(predictions[0])
    
    # Dapatkan nilai confidence
    confidence = float(predictions[0][class_idx])
    
    # Ubah predictions menjadi list Python untuk JSON serialization
    all_probabilities = [float(p) for p in predictions[0]]
    
    # Tentukan kelas prediksi
    if confidence < threshold:
        predicted_class = 'Unknown'
    else:
        predicted_class = class_mapping[class_idx]
    
    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "probabilities": {
            class_mapping[i]: all_probabilities[i] for i in range(len(all_probabilities))
        },
        "raw_probabilities": all_probabilities
    }

# Route untuk halaman utama
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Route untuk prediksi
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validasi file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")
    
    try:
        # Baca file gambar
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Preprocessing gambar
        processed_image = preprocess_image(image)
        
        # Prediksi
        result = predict_image(processed_image)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error dalam memproses gambar: {str(e)}")

# Endpoint untuk status kesehatan aplikasi
@app.get("/health")
async def health_check():
    model_status = "loaded" if model is not None else "not loaded"
    return {
        "status": "healthy",
        "model_status": model_status
    }

# Endpoint untuk info tentang model
@app.get("/model-info")
async def model_info():
    if model is None:
        raise HTTPException(status_code=500, detail="Model belum dimuat")
    
    return {
        "name": "CNN untuk Klasifikasi Alas Kaki",
        "version": "2.0",
        "accuracy": "96.67%",
        "classes": list(class_mapping.values()),
        "input_shape": "128x128x3"
    }

# Jalankan aplikasi
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)