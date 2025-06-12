document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS --- //
    const envelopeContainer = document.getElementById('envelope-container');
    const photoContainer = document.getElementById('photo-container');
    const couplePhoto = document.getElementById('couple-photo');
    const changePhotoButton = document.getElementById('change-photo-button');
    const timeTogetherContainer = document.getElementById('time-together-container');
    const timeTogetherElement = document.getElementById('time-together');
    const loveMessageContainer = document.getElementById('love-message-container');
    const canvas = document.getElementById('text-canvas');
    const ctx = canvas.getContext('2d');

    // --- CONFIGURAÇÕES --- //
    const photos = [
        'photos/casal--lindo.jpg', 'photos/chá.jpg', 'photos/ela.jpg',
        'photos/eu-presente.jpg', 'photos/grande-dia.jpg', 'photos/hehehe.jpg',
        'photos/new-year.jpg', 'photos/noia.jpg', 'photos/primordios.jpg'
    ];
    let currentPhotoIndex = 0;
    const startDate = new Date('2024-01-21T00:00:00');
    let particles = [];
    let animationFrameId;

    // --- CANVAS RESIZE LÓGICA ---
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
        if (!loveMessageContainer.classList.contains('hidden')) {
            cancelAnimationFrame(animationFrameId);
            initTextAnimation();
        }
    });

    // --- PARTICLE CLASS --- //
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

    // --- ANIMAÇÃO DO TEXTO --- //
    function initTextAnimation() {
        resizeCanvas();
        const scale = window.devicePixelRatio;
        const scaledWidth = canvas.width / scale;
        const scaledHeight = canvas.height / scale;

        ctx.fillStyle = 'white';
        ctx.font = `bold ${scaledWidth / 4}px 'Dancing Script', cursive`; // Aumentado de 6 para 4 para uma fonte ainda maior
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Eu te amo', scaledWidth / 2, scaledHeight / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        particles = [];
        const density = 3 * scale;
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
        timeTogetherElement.innerHTML = `Juntos há: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    envelopeContainer.addEventListener('click', () => {
        // Pede permissão para eventos de movimento em dispositivos iOS 13+
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                    }
                })
                .catch(console.error);
        } else {
            // Lida com dispositivos não-iOS 13+ ou navegadores que não exigem permissão
            window.addEventListener('devicemotion', handleMotion);
        }

        // 1. Abre o envelope e a carta desliza para fora.
        envelopeContainer.classList.add('open');

        // 2. Após uma pausa para ler a carta, o envelope desaparece.
        setTimeout(() => {
            envelopeContainer.style.transition = 'opacity 1s ease-out';
            envelopeContainer.style.opacity = '0';
        }, 3000); // Pausa de 3s.

        // 3. Inicia a animação de partículas.
        setTimeout(() => {
            envelopeContainer.classList.add('hidden');
            loveMessageContainer.classList.remove('hidden');
            loveMessageContainer.style.opacity = '1';
            initTextAnimation();
        }, 4000); // Inicia 1s após o desaparecimento começar.

        // 4. As partículas se dispersam após formarem a frase.
        setTimeout(() => {
            particles.forEach(p => p.disperse());
        }, 10000); // Frase fica visível por 6s.

        // 5. A animação de partículas desaparece.
        setTimeout(() => {
            loveMessageContainer.style.opacity = '0';
        }, 11000);

        // 6. A galeria de fotos aparece.
        setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            loveMessageContainer.classList.add('hidden');
            photoContainer.classList.remove('hidden');
            couplePhoto.src = photos[currentPhotoIndex];
            photoContainer.style.opacity = '1';
            timeTogetherContainer.classList.remove('hidden');
            document.getElementById('cute-gif').style.opacity = '1';
            setInterval(updateTimeTogether, 1000);
            updateTimeTogether();
        }, 12000);
    });

    changePhotoButton.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        couplePhoto.style.opacity = '0';
        setTimeout(() => {
            couplePhoto.src = photos[currentPhotoIndex];
            couplePhoto.style.opacity = '1';
        }, 400);
    });
});

// --- Funcionalidade de Sacudir para Lançar Corações ---
let lastShakeTime = 0;
const shakeThreshold = 18; // Sensibilidade do movimento (menor = mais sensível)

function handleMotion(event) {
    // Só executa a lógica depois que a galeria de fotos estiver visível
    if (document.querySelector('.photo-container').classList.contains('hidden')) {
        return;
    }

    const currentTime = new Date().getTime();
    // Evita que a função seja chamada muitas vezes seguidas
    if ((currentTime - lastShakeTime) > 500) {
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration || !acceleration.x) {
            return; // Se não houver dados de aceleração, não faz nada
        }
        const x = acceleration.x;
        const y = acceleration.y;
        const z = acceleration.z;

        const magnitude = Math.sqrt(x * x + y * y + z * z);

        if (magnitude > shakeThreshold) {
            lastShakeTime = currentTime;
            triggerHeartExplosion();
        }
    }
}

function triggerHeartExplosion() {
    const heartCount = Math.floor(Math.random() * 8) + 8; // Lança de 8 a 15 corações
    for (let i = 0; i < heartCount; i++) {
        createBouncingHeart();
    }
}

function createBouncingHeart() {
    const heart = document.createElement('div');
    const heartEmojis = ['❤️', '💖', '💕', '💗', '😍'];
    heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.classList.add('bouncing-heart');

    // Define posição, duração e tamanho aleatórios para um efeito mais natural
    heart.style.left = `${Math.random() * 95}vw`;
    heart.style.animationDuration = `${Math.random() * 2 + 3}s`; // Duração de 3 a 5 segundos
    heart.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`; // Tamanho de 1.5rem a 3rem

    document.body.appendChild(heart);

    // Remove o coração do HTML quando a animação terminar para não sobrecarregar a página
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}
