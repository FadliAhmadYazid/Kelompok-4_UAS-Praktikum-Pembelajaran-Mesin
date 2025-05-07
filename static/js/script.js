/**
 * script.js - Klasifikasi Alas Kaki
 * JavaScript untuk interaksi dan fungsionalitas frontend aplikasi klasifikasi alas kaki
 * Versi yang diperbarui dengan animasi dan fitur tambahan
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('file');
    const fileName = document.getElementById('fileName');
    const imagePreview = document.getElementById('imagePreview');
    const noImageMessage = document.getElementById('noImageMessage');
    const resultSection = document.getElementById('resultSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultContent = document.getElementById('resultContent');
    const predictionBadge = document.getElementById('predictionBadge');
    const className = document.getElementById('className');
    const confidencePill = document.getElementById('confidencePill');
    const confidenceScore = document.getElementById('confidenceScore');
    const probBars = document.getElementById('probBars');
    const interpretationText = document.getElementById('interpretationText');
    const dropZone = document.getElementById('dropZone');
    const themeToggle = document.getElementById('themeToggle');
    const predictionIcon = document.querySelector('.prediction-icon');

    // Inisialisasi state
    let isImageLoaded = false;

    // Sembunyikan section hasil pada awalnya
    resultSection.style.display = 'none';

    // Theme toggle functionality
    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('light-theme');

        // Update icon
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // Show notification
        showNotification(
            document.body.classList.contains('light-theme') ?
                'Tema Terang Diaktifkan ☀️' :
                'Tema Gelap Diaktifkan 🌙'
        );
    });

    // Fungsi untuk menampilkan notifikasi
    function showNotification(message) {
        // Hapus notifikasi lama jika ada
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Buat notifikasi baru
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        // Tambahkan ke DOM
        document.body.appendChild(notification);

        // Animasi tampil
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hapus setelah beberapa detik
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Fungsi untuk menangani pemilihan file
    fileInput.addEventListener('change', function (e) {
        handleFileSelect(e.target.files[0]);
    });

    // Fungsi untuk menangani drag & drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('upload-dragover');
    }

    function unhighlight() {
        dropZone.classList.remove('upload-dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileSelect(files[0]);
    }

    // Fungsi untuk menangani file yang dipilih (baik dari input atau drag & drop)
    function handleFileSelect(file) {
        if (file) {
            // Tambahkan efek jiggle
            const cardElement = document.querySelector('.preview-section .card');
            cardElement.classList.add('jiggle');
            setTimeout(() => {
                cardElement.classList.remove('jiggle');
            }, 500);

            // Update nama file
            fileName.textContent = file.name;

            // Tampilkan preview gambar
            const reader = new FileReader();
            reader.onload = function (event) {
                imagePreview.src = event.target.result;
                imagePreview.style.opacity = '1';
                noImageMessage.style.display = 'none';
                isImageLoaded = true;

                // Animasi gambar
                imagePreview.classList.add('scale-in');
                setTimeout(() => {
                    imagePreview.classList.remove('scale-in');
                }, 500);

                showNotification('Gambar berhasil dimuat 📸');
            };
            reader.readAsDataURL(file);
        } else {
            // Reset ke default jika tidak ada file yang dipilih
            resetImagePreview();
        }
    }

    // Tambahkan class untuk animasi scale-in
    if (!document.querySelector('#animationStyles')) {
        const style = document.createElement('style');
        style.id = 'animationStyles';
        style.textContent = `
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .scale-in {
                animation: scaleIn 0.5s ease-out forwards;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                transform: translateX(120%);
                transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .text-gradient {
                background: linear-gradient(90deg, var(--primary-light), var(--accent-color));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                color: transparent;
            }
            
            .highlight {
                color: var(--accent-color);
                font-weight: 500;
            }
            
            .class-desc {
                font-size: 0.8rem;
                color: var(--text-secondary);
                margin-top: 5px;
                text-align: center;
            }
            
            .header-content {
                position: relative;
                z-index: 2;
            }
            
            .header-particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 1;
            }
            
            .logo-icon {
                display: inline-flex;
                margin-right: 10px;
                color: var(--primary-light);
            }
            
            .footer-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            
            .footer-logo {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--primary-light);
                margin-bottom: 10px;
            }
            
            .drag-instruction {
                margin-top: 10px;
                color: var(--text-secondary);
                font-size: 0.9rem;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    // Fungsi untuk reset preview gambar
    function resetImagePreview() {
        fileName.textContent = 'Belum ada file yang dipilih';
        imagePreview.src = '/static/img/placeholder.png';
        imagePreview.style.opacity = '0.5';
        noImageMessage.style.display = 'flex';
        isImageLoaded = false;
    }

    // Fungsi untuk memproses upload dan prediksi
    uploadForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validasi jika gambar belum dipilih
        if (!isImageLoaded) {
            showNotification('⚠️ Pilih gambar terlebih dahulu');

            // Tambahkan efek jiggle pada upload section
            const uploadSectionCard = document.querySelector('.upload-section .card');
            uploadSectionCard.classList.add('jiggle');
            setTimeout(() => {
                uploadSectionCard.classList.remove('jiggle');
            }, 500);

            return;
        }

        // Siapkan data untuk dikirim
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // Tampilkan section hasil dan loading indicator
        resultSection.style.display = 'block';
        scrollToResults();
        loadingIndicator.style.display = 'flex';
        resultContent.style.display = 'none';

        try {
            // Simulasi delay untuk menunjukkan loading (untuk demo)
            // Dalam produksi, hapus setTimeout dan gunakan request asli

            // Kirim request ke API
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            // Periksa jika respons berhasil
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            // Parse response JSON
            const result = await response.json();

            // Update UI dengan hasil prediksi
            displayResults(result);

        } catch (error) {
            console.error('Error:', error);
            displayError(error.message);
        }
    });

    // Fungsi untuk scroll ke hasil
    function scrollToResults() {
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Fungsi untuk menampilkan hasil prediksi
    function displayResults(result) {
        // Update kelas prediksi
        className.textContent = result.predicted_class;
    
        // Set icon berdasarkan predicted class
        updatePredictionIcon(result.predicted_class);
    
        // Update confidence score
        const confidencePercentage = (result.confidence * 100).toFixed(2);
        confidenceScore.textContent = `${confidencePercentage}%`;
    
        // Set warna dan ikon berdasarkan confidence
        if (result.predicted_class === "Unknown") {
            confidencePill.style.color = 'gray';
            confidencePill.innerHTML = `<span id="confidenceScore">${confidencePercentage}%</span> <i class="fas fa-question-circle"></i>`;
        } else if (result.confidence > 0.9) {
            confidencePill.style.color = 'var(--success-color)';
            confidencePill.innerHTML = `<span id="confidenceScore">${confidencePercentage}%</span> <i class="fas fa-check-circle"></i>`;
        } else if (result.confidence > 0.7) {
            confidencePill.style.color = 'var(--primary-color)';
            confidencePill.innerHTML = `<span id="confidenceScore">${confidencePercentage}%</span> <i class="fas fa-check"></i>`;
        } else if (result.confidence > 0.5) {
            confidencePill.style.color = 'var(--warning-color)';
            confidencePill.innerHTML = `<span id="confidenceScore">${confidencePercentage}%</span> <i class="fas fa-question-circle"></i>`;
        } else {
            confidencePill.style.color = 'var(--error-color)';
            confidencePill.innerHTML = `<span id="confidenceScore">${confidencePercentage}%</span> <i class="fas fa-exclamation-circle"></i>`;
        }
    
        // Buat bar chart untuk probabilitas
        probBars.innerHTML = '';
        const classIcons = {
            'Boot': '<i class="fas fa-boot"></i>',
            'Sandal': '<i class="fas fa-shoe-prints fa-flip-vertical"></i>',
            'Shoe': '<i class="fas fa-running"></i>'
        };
    
        const classColors = {
            'Boot': 'boot-bar',
            'Sandal': 'sandal-bar',
            'Shoe': 'shoe-bar'
        };
    
        const sortedProbabilities = Object.entries(result.probabilities)
            .sort((a, b) => b[1] - a[1]);
    
        for (const [className, probability] of sortedProbabilities) {
            const percentage = (probability * 100).toFixed(2);
    
            const barContainer = document.createElement('div');
            barContainer.className = 'prob-bar';
    
            const barLabel = document.createElement('div');
            barLabel.className = 'prob-bar-label';
            barLabel.innerHTML = `${classIcons[className] || ''} ${className}`;
            barContainer.appendChild(barLabel);
    
            const percentageLabel = document.createElement('div');
            percentageLabel.className = 'prob-percentage';
            percentageLabel.textContent = `${percentage}%`;
    
            const barWrapper = document.createElement('div');
            barWrapper.className = 'prob-bar-wrapper';
    
            const barFill = document.createElement('div');
            barFill.className = `prob-bar-fill ${classColors[className] || ''}`;
            barFill.style.width = '0%';
    
            barWrapper.appendChild(barFill);
            barLabel.appendChild(percentageLabel);
            barContainer.appendChild(barWrapper);
            probBars.appendChild(barContainer);
    
            setTimeout(() => {
                barFill.style.width = `${percentage}%`;
            }, 100);
        }
    
        // Update interpretasi
        let interpretationHTML = '';
        if (result.predicted_class === "Unknown") {
            interpretationHTML = `<strong>Model tidak yakin</strong> dengan prediksi. Gambar ini tidak cocok dengan kategori yang tersedia dan diklasifikasikan sebagai <span class="highlight">Unknown</span>.`;
        } else if (result.confidence > 0.9) {
            interpretationHTML = `<strong>Model sangat yakin</strong> bahwa gambar ini adalah <span class="highlight">${result.predicted_class}</span> dengan tingkat keyakinan yang sangat tinggi.`;
        } else if (result.confidence > 0.8) {
            interpretationHTML = `<strong>Model cukup yakin</strong> bahwa gambar ini adalah <span class="highlight">${result.predicted_class}</span>, namun tidak 100% yakin.`;
        } else if (result.confidence > 0.7) {
            interpretationHTML = `Model <strong>sedikit ragu</strong>, tetapi lebih condong memprediksi gambar ini sebagai <span class="highlight">${result.predicted_class}</span>.`;
        } else {
            interpretationHTML = `<strong>Model tidak yakin</strong> dengan prediksi. Gambar mungkin bukan alas kaki klasik atau memiliki tampilan yang tidak jelas.`;
        }
        interpretationText.innerHTML = interpretationHTML;
    
        loadingIndicator.style.display = 'none';
        resultContent.style.display = 'block';
        resultContent.classList.add('fade-in');
    
        showNotification('✅ Analisis selesai!');
    }
    

    // Fungsi untuk memperbarui icon pada prediction badge
    function updatePredictionIcon(predictedClass) {
        let iconHTML = '';

        switch (predictedClass) {
            case 'Boot':
                iconHTML = '<i class="fas fa-boot"></i>';
                break;
            case 'Sandal':
                iconHTML = '<i class="fas fa-shoe-prints fa-flip-vertical"></i>';
                break;
            case 'Shoe':
                iconHTML = '<i class="fas fa-running"></i>';
                break;
            default:
                iconHTML = '<i class="fas fa-question"></i>';
        }

        document.querySelector('.prediction-icon').innerHTML = iconHTML;
    }

    // Fungsi untuk menampilkan error
    function displayError(errorMessage) {
        // Sembunyikan loading
        loadingIndicator.style.display = 'none';

        // Create dan tampilkan pesan error
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
            <p>${errorMessage}</p>
            <p>Silakan coba lagi atau gunakan gambar yang berbeda.</p>
        `;

        // Ganti konten hasil dengan pesan error
        resultContent.innerHTML = '';
        resultContent.appendChild(errorContainer);
        resultContent.style.display = 'block';

        // Tampilkan notifikasi
        showNotification('❌ Terjadi kesalahan!');
    }

    // Tambahkan animasi particle pada header
    createParticles();
    function createParticles() {
        const particles = document.querySelector('.header-particles');
        if (!particles) return;

        // Buat 30 particle
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Set random properties
            const size = Math.random() * 6 + 2; // 2-8px
            const posX = Math.random() * 100; // 0-100%
            const posY = Math.random() * 100; // 0-100%
            const delay = Math.random() * 5; // 0-5s
            const duration = Math.random() * 10 + 10; // 10-20s

            // Set styles
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: rgba(187, 134, 252, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                animation: float ${duration}s linear infinite;
                animation-delay: -${delay}s;
                z-index: 1;
            `;

            particles.appendChild(particle);
        }

        // Add float animation if it doesn't exist
        if (!document.querySelector('#particleAnimation')) {
            const style = document.createElement('style');
            style.id = 'particleAnimation';
            style.textContent = `
                @keyframes float {
                    0% { transform: translateY(0) translateX(0) rotate(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(-100px) translateX(50px) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Tambahkan kelas untuk styling berdasarkan interaksi
    document.querySelectorAll('.file-label, .btn-predict, .card').forEach(element => {
        element.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.98)';
        });

        element.addEventListener('mouseup', function () {
            this.style.transform = 'scale(1)';
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Tambahkan style untuk probability bars
    const barStyles = document.createElement('style');
    barStyles.textContent = `
        .prob-bar-label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .prob-bar-wrapper {
            display: flex;
            align-items: center;
            height: 30px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }
        
        .prob-percentage {
            position: absolute;
            right: 10px;
            font-weight: 600;
            color: white;
            z-index: 2;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .no-image-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(barStyles);

    // Tambahkan efek hover pada gambar preview
    imagePreview.addEventListener('mouseover', function () {
        if (isImageLoaded) {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
        }
    });

    imagePreview.addEventListener('mouseout', function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});