document.addEventListener('DOMContentLoaded', () => {
    // 1. Плавное появление секций при прокрутке
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 80;

        reveals.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 2. Интерактивная смена светских цитат при клике
    const quotes = [
        "«Мы трэпим по-светски — обсуждай одежду, обсуждай мой образ»",
        "«В кругу светских поцов — моя жизнь щас приватна»",
        "«L'élégance est la seule beauté qui ne se fane jamais»",
        "«Vinyl store, DJ Flaty, shopping session...»",
        "«La nuit porte conseil et mystère»"
    ];

    const quoteElement = document.getElementById('french-quote');
    let currentQuoteIndex = 0;

    if (quoteElement) {
        quoteElement.addEventListener('click', () => {
            quoteElement.style.opacity = '0';
            setTimeout(() => {
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
                quoteElement.textContent = quotes[currentQuoteIndex];
                quoteElement.style.opacity = '1';
            }, 300);
        });
    }

    // 3. Управление мини-плеером (High IQ Money + Автозапуск + Авто-реплей)
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const likeBtn = document.getElementById('like-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const timeDisplay = document.getElementById('time-display');
    const volumeSlider = document.getElementById('volume-slider');

    let isPlaying = false;
    let userPausedManually = false;

    // Включаем авто-реплей по умолчанию
    audio.loop = true;
    audio.volume = 0.75;
    repeatBtn.classList.add('active');

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlay = () => {
        if (isPlaying) {
            userPausedManually = true;
            audio.pause();
        } else {
            userPausedManually = false;
            audio.play().catch(() => {
                alert('Положите аудиофайл high-iq-money.mp3 в папку с сайтом, чтобы запустить воспроизведение.');
            });
        }
    };

    audio.addEventListener('play', () => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });

    // Попытка мгновенного автозапуска при входе на сайт
    const tryAutoPlay = () => {
        if (userPausedManually || isPlaying) return;
        audio.play().then(() => {
            // Успешно запустилось — убираем слушатели первого взаимодействия
            document.removeEventListener('click', tryAutoPlay);
            document.removeEventListener('keydown', tryAutoPlay);
            document.removeEventListener('touchstart', tryAutoPlay);
        }).catch(() => {
            // Браузер заблокировал звук до первого клика — ждём взаимодействия
        });
    };

    tryAutoPlay();
    document.addEventListener('click', tryAutoPlay);
    document.addEventListener('keydown', tryAutoPlay);
    document.addEventListener('touchstart', tryAutoPlay);

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы клик по кнопке паузы не вызывал tryAutoPlay
        togglePlay();
    });

    prevBtn.addEventListener('click', () => {
        audio.currentTime = 0;
    });

    nextBtn.addEventListener('click', () => {
        if (audio.duration) {
            audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
        }
    });

    // Переключение повтора трека (по умолчанию включен)
    repeatBtn.addEventListener('click', () => {
        audio.loop = !audio.loop;
        repeatBtn.classList.toggle('active', audio.loop);
    });

    // Лайк трека
    likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('liked');
    });

    // Обновление полосы прогресса и таймера
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${percent}%`;
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
    });

    // Перемотка кликом по полосе
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        if (audio.duration) {
            audio.currentTime = (clickX / width) * audio.duration;
        }
    });

    // Громкость
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });
});