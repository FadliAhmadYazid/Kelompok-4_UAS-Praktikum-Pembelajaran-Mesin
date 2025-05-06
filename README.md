# Klasifikasi Alas Kaki dengan CNN

## Kelompok 4
1. Alhusna Hanifah - 2208107010060
2. Fadli Ahmad Yazid - 2208107010032
3. Nurul Uzratun Nashriyyah - 2208107010030
4. Rizky Yusmansyah - 2208107010024
5. Zahra Zafira - 2208107010040

## Deskripsi Proyek
Proyek ini mengimplementasikan sistem klasifikasi alas kaki menggunakan Convolutional Neural Network (CNN) untuk membedakan tiga jenis alas kaki: Sepatu (Shoe), Sandal (Sandal), dan Sepatu Boot (Boot). Model dilatih menggunakan dataset yang berisi sekitar 15.000 gambar yang terbagi merata dalam tiga kelas tersebut.

### Fitur Utama
- Klasifikasi gambar alas kaki ke dalam tiga kategori
- Visualisasi probabilitas prediksi untuk setiap kelas
- Antarmuka web yang responsif dan user-friendly
- Sistem upload gambar dengan drag and drop

### Performa Model
- Arsitektur: CNN dengan 3 layer konvolusi
- Akurasi pada data test: 96.84%
- Dataset: 15.000 gambar (5.000 per kelas)

## Teknologi yang Digunakan
- **Backend**: FastAPI, TensorFlow, Keras
- **Frontend**: HTML, CSS, JavaScript

### Struktur Direktori
```
project/
├── app.py
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── img/
│       └── placeholder.png
├── templates/
│   └── index.html
└── model/
    └── model_2_cnn_shoe_sandal_boot.h5
```

## Instruksi Penerapan

### Persyaratan Sistem
Pastikan Python versi 3.8 atau lebih tinggi telah terinstal pada sistem Anda.

### Langkah-langkah Penerapan
1. Clone repositori ini:
   ```bash
   git clone https://github.com/FadliAhmadYazid/Kelompok-4_UAS-Praktikum-Pembelajaran-Mesin.git
   cd klasifikasi-alas-kaki
   ```
   
2. Buat virtual environment Python:
```bash
# Pada Windows
python -m venv venv
venv\Scripts\activate

# Pada macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install semua dependensi dari requirements.txt:
```bash
pip install -r requirements.txt
```

4. Jalankan aplikasi:
   ```bash
   python app.py
   ```

5. Akses aplikasi web:
   - Buka browser dan kunjungi `http://localhost:8000`

### Penggunaan Aplikasi
1. Unggah gambar alas kaki dengan mengklik area drop zone atau menyeret gambar ke area tersebut
2. Klik tombol "Analisis Gambar"
3. Lihat hasil klasifikasi dan distribusi probabilitas yang ditampilkan

## Pengujian
Model telah diuji dengan dua jenis data:
- Gambar alas kaki dari kelas yang sama tetapi tidak digunakan dalam pelatihan
- Gambar acak yang tidak berkaitan dengan alas kaki untuk menguji ketahanan model
