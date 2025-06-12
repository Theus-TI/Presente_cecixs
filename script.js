document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const envelope = document.getElementById('envelope-container');
    const loveMessageContainer = document.getElementById('love-message-container');
    const loveMessage = document.getElementById('love-message');
    const photoContainer = document.getElementById('photo-container');
    const couplePhoto = document.getElementById('couple-photo');
    const nextPhotoBtn = document.getElementById('next-photo-btn');
    const heartTriggerBtn = document.getElementById('heart-trigger-btn');
        const timeContainer = document.getElementById('time-together-container');
    const timeText = document.getElementById('time-together');
    const cuteGif = document.getElementById('cute-gif');

    // --- ESTADO E CONFIGURAÇÕES ---
    const photos = [
        'photos/primordios.jpg',
        'photos/casal--lindo.jpg',
        'photos/chá.jpg',
        'photos/ela.jpg',
        'photos/eu-presente.jpg',
        'photos/grande-dia.jpg',
        'photos/hehehe.jpg',
        'photos/new-year.jpg',
        'photos/noia.jpg'
    ];
    let currentPhotoIndex = -1; // Começa em -1 para que a primeira foto seja a de índice 0
    const SHAKE_THRESHOLD = 30; // Sensibilidade aumentada (maior = menos sensível)
    let lastShakeTime = 0;
    const SHAKE_COOLDOWN = 4000; // 4 segundos de cooldown
    const startDate = new Date('2024-03-08T18:00:00');

    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Inicia a sequência ao clicar no envelope.
     */
    function openEnvelope() {
        if (envelope.classList.contains('open')) return;

        envelope.classList.add('open');

        // Espera a animação de abertura do envelope terminar
        setTimeout(() => {
            envelope.classList.add('hidden'); // Esconde o envelope de vez
            showLoveAnimation();
        }, 2000); // Tempo ajustado para a animação do CSS
    }

    /**
     * Mostra a animação de "Eu te amo".
     */
    function showLoveAnimation() {
        loveMessageContainer.classList.remove('hidden');
        loveMessage.classList.add('animate');

        // A animação CSS dura 8 segundos. Após, mostra a galeria.
        setTimeout(() => {
            loveMessageContainer.classList.add('hidden');
            showPhotoGallery();
        }, 8000);
    }

    /**
     * Exibe a galeria de fotos e todos os elementos associados.
     */
    function showPhotoGallery() {
        photoContainer.classList.remove('hidden');
        timeContainer.classList.remove('hidden');
        cuteGif.classList.remove('hidden');
        nextPhotoBtn.classList.remove('hidden');
        heartTriggerBtn.classList.remove('hidden');

        displayNextPhoto(); // Mostra a primeira foto
    }

    /**
     * Exibe a próxima foto na galeria com transição.
     */
    function displayNextPhoto() {
        couplePhoto.style.opacity = '0';
        
        setTimeout(() => {
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            couplePhoto.src = photos[currentPhotoIndex];
            couplePhoto.style.opacity = '1';
        }, 400); // Espera a transição de fade-out
    }

    // --- ATUALIZADOR DE TEMPO ---

    function updateTime() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

                timeText.innerHTML = 
            `<span>${days}d</span> <span>${hours}h</span> <span>${minutes}m</span> <span>${seconds}s</span>`;
    }

    // --- ANIMAÇÃO DE CORAÇÕES ---

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 2 + 3}s`; // 3-5s
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    // --- DETECTOR DE SHAKE ---

    function handleShake(event) {
        const now = Date.now();
        if (now - lastShakeTime < SHAKE_COOLDOWN) return;

        const { x, y, z } = event.accelerationIncludingGravity;
        if (x === null || y === null || z === null) {
            return;
        }
        const acceleration = Math.sqrt(x*x + y*y + z*z);

        if (acceleration > SHAKE_THRESHOLD) {
            lastShakeTime = now;
            for (let i = 0; i < 15; i++) {
                setTimeout(createHeart, i * 100);
            }
        }
    }

    function requestMotionPermission() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleShake);
                    }
                })
                .catch(console.error);
        } else {
            window.addEventListener('devicemotion', handleShake);
        }
    }

    // --- INICIALIZAÇÃO ---

    envelope.addEventListener('click', openEnvelope);
    nextPhotoBtn.addEventListener('click', displayNextPhoto);
    heartTriggerBtn.addEventListener('click', () => {
        for (let i = 0; i < 10; i++) {
            setTimeout(createHeart, i * 100);
        }
    });

    // Solicitar permissão de movimento ao interagir com a carta ou o botão
    envelope.addEventListener('click', requestMotionPermission, { once: true });
    heartTriggerBtn.addEventListener('click', requestMotionPermission, { once: true });

    updateTime();
    setInterval(updateTime, 1000);
});
