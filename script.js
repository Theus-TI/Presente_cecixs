document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS --- //
    const envelopeContainer = document.getElementById('envelope-container');
    const loveMessageContainer = document.getElementById('love-message-container');
    const mobileLoveMessage = document.getElementById('mobile-love-message');
    const canvas = document.getElementById('text-canvas');
    const ctx = canvas.getContext('2d');
    const photoContainer = document.getElementById('photo-container');
    const photoGrid = document.querySelector('.photo-grid');
    const heartTriggerBtn = document.getElementById('heart-trigger-btn');
    const timeTogetherContainer = document.getElementById('time-together-container');
    const timeTogetherEl = document.getElementById('time-together');
    const cuteGif = document.getElementById('cute-gif');

    // --- CONFIGURAÇÕES --- //
    const startDate = new Date('2024-01-21T00:00:00');
    let particles = [];
    let animationFrameId;
    const isMobile = window.innerWidth <= 768;

    // --- CANVAS RESIZE LÓGICA (Desktop) ---
    function resizeCanvas() {
        const scale = window.devicePixelRatio;
        const newWidth = Math.min(window.innerWidth * 0.9, 800);
        const newHeight = Math.min(window.innerHeight * 0.8, 400);
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
        canvas.width = newWidth * scale;
        canvas.height = newHeight * scale;
        ctx.scale(scale, scale);
    }

    window.addEventListener('resize', () => {
        if (!isMobile && !loveMessageContainer.classList.contains('hidden')) {
            cancelAnimationFrame(animationFrameId);
            initTextAnimation();
        }
    });

    // --- PARTICLE CLASS (Desktop) --- //
    class Particle {
        constructor(x, y) {
            const scale = window.devicePixelRatio;
            this.x = Math.random() * (canvas.width / scale);
            this.y = Math.random() * (canvas.height / scale);
            this.targetX = x;
            this.targetY = y;
            this.size = Math.random() * 2 + 3;
            this.speed = Math.random() * 2 + 1;
            const heartColors = ['#d81b60', '#f06292', '#ff4081', '#e91e63', '#c2185b'];
            this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        }
        update() {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 1) {
                this.x = this.targetX;
                this.y = this.targetY;
            } else {
                this.x += dx / (15 / this.speed);
                this.y += dy / (15 / this.speed);
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.font = `${this.size * 2.5}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('♥', this.x, this.y);
        }
        disperse() {
            const scale = window.devicePixelRatio;
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 400 + 200;
            this.targetX = (canvas.width / scale) / 2 + Math.cos(angle) * radius;
            this.targetY = (canvas.height / scale) / 2 + Math.sin(angle) * radius;
        }
    }

    // --- ANIMAÇÃO DO TEXTO (Desktop) --- //
    function initTextAnimation() {
        resizeCanvas();
        const scale = window.devicePixelRatio;
        const scaledWidth = canvas.width / scale;
        const scaledHeight = canvas.height / scale;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let fontSize = scaledWidth / 4.5;
        ctx.font = `bold ${fontSize}px 'Dancing Script', cursive`;
        while (ctx.measureText('Eu te amo').width > scaledWidth * 0.9) {
            fontSize--;
            ctx.font = `bold ${fontSize}px 'Dancing Script', cursive`;
        }
        ctx.fillText('Eu te amo', scaledWidth / 2, scaledHeight / 2);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        particles = [];
        const density = 5 * scale;
        for (let y = 0; y < imageData.height; y += density) {
            for (let x = 0; x < imageData.width; x += density) {
                if (imageData.data[(y * imageData.width + x) * 4 + 3] > 128) {
                    particles.push(new Particle(x / scale, y / scale));
                }
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animateParticles();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    // --- LÓGICA PRINCIPAL --- //
    function updateTimeTogether() {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        timeTogetherEl.innerHTML = `Juntos há: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    function showPhotoGallery() {
        photoContainer.classList.remove('hidden');
        photoContainer.style.opacity = '1';
        timeTogetherContainer.classList.remove('hidden');
        cuteGif.style.opacity = '1';
        if (photoGrid.children.length === 0) {
            for (let i = 1; i <= 12; i++) {
                const photoDiv = document.createElement('div');
                photoDiv.classList.add('photo');
                const img = document.createElement('img');
                img.src = `photos/photo_${i}.jpg`;
                img.alt = `Foto ${i}`;
                photoDiv.appendChild(img);
                photoGrid.appendChild(photoDiv);
            }
        }
        heartTriggerBtn.classList.add('visible');
        heartTriggerBtn.addEventListener('click', triggerHeartExplosion);
        updateTimeTogether();
        setInterval(updateTimeTogether, 1000);
    }

    envelopeContainer.addEventListener('click', () => {
        if (window.DeviceMotionEvent) {
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                    }
                }).catch(console.error);
            } else {
                window.addEventListener('devicemotion', handleMotion);
            }
        }

        envelopeContainer.classList.add('open');

        setTimeout(() => {
            envelopeContainer.style.transition = 'opacity 1s ease-out';
            envelopeContainer.style.opacity = '0';
        }, 3000);

        setTimeout(() => {
            envelopeContainer.classList.add('hidden');
            loveMessageContainer.classList.remove('hidden');
            loveMessageContainer.style.opacity = '1';
            if (isMobile) {
                canvas.style.display = 'none';
                mobileLoveMessage.classList.add('visible');
            } else {
                mobileLoveMessage.style.display = 'none';
                initTextAnimation();
            }
        }, 4000);

        if (isMobile) {
            setTimeout(() => {
                loveMessageContainer.style.opacity = '0';
            }, 8000);
            setTimeout(() => {
                loveMessageContainer.classList.add('hidden');
                showPhotoGallery();
            }, 9000);
        } else { // Desktop
            setTimeout(() => {
                particles.forEach(p => p.disperse());
            }, 10000);
            setTimeout(() => {
                loveMessageContainer.style.opacity = '0';
            }, 11000);
            setTimeout(() => {
                cancelAnimationFrame(animationFrameId);
                loveMessageContainer.classList.add('hidden');
                showPhotoGallery();
            }, 12000);
        }
    }, { once: true });

    // --- FUNCIONALIDADE DE CORAÇÕES (SHAKE E BOTÃO) ---
    let lastShakeTime = 0;
    const shakeThreshold = 15;

    function handleMotion(event) {
        if (photoContainer.classList.contains('hidden')) return;
        const currentTime = new Date().getTime();
        if ((currentTime - lastShakeTime) > 500) {
            const acceleration = event.accelerationIncludingGravity;
            if (!acceleration || acceleration.x === null) return;
            const magnitude = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z);
            if (magnitude > shakeThreshold) {
                lastShakeTime = currentTime;
                triggerHeartExplosion();
            }
        }
    }

    function triggerHeartExplosion() {
        const heartCount = Math.floor(Math.random() * 8) + 8;
        for (let i = 0; i < heartCount; i++) {
            createBouncingHeart();
        }
    }

    function createBouncingHeart() {
        const heart = document.createElement('div');
        const heartEmojis = ['❤️', '💖', '💕', '💗', '😍'];
        heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.classList.add('bouncing-heart');
        heart.style.left = `${Math.random() * 95}vw`;
        heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
        heart.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`;
        document.body.appendChild(heart);
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }
});
