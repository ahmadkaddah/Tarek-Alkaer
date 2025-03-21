const hijriDateElement = document.getElementById('hijri-date');
const verseArabicElement = document.getElementById('verse-arabic');
const verseTranslationElement = document.getElementById('verse-translation');
const verseReferenceElement = document.getElementById('verse-reference');
const readMoreBtn = document.getElementById('read-more-btn');
const listenBtn = document.getElementById('listen-btn');
const shareBtn = document.getElementById('share-btn');
const changeVerseBtn = document.getElementById('change-verse-btn');
const reminderTimeInput = document.getElementById('reminder-time');
const notificationEnabledCheckbox = document.getElementById('notification-enabled');
const saveSettingsBtn = document.getElementById('save-settings');
const surahsGridElement = document.getElementById('surahs-grid');
const verseModal = document.getElementById('verse-modal');
const surahModal = document.getElementById('surah-modal');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const closeModalButtons = document.querySelectorAll('.close-modal');

const modalVerseArabic = document.getElementById('modal-verse-arabic');
const modalVerseTranslation = document.getElementById('modal-verse-translation');
const modalTafseer = document.getElementById('modal-tafseer');
const modalSignificance = document.getElementById('modal-significance');
const modalSurahName = document.getElementById('modal-surah-name');
const modalSurahInfo = document.getElementById('modal-surah-info');
const modalSurahText = document.getElementById('modal-surah-text');
const modalSurahBenefits = document.getElementById('modal-surah-benefits');
const surahAudioPlayer = document.getElementById('surah-audio-player');

let quranData = {
    verses: [],
    surahs: []
};

let audioPlayer = null;

document.addEventListener('DOMContentLoaded', () => {
    updateHijriDate();

    loadQuranData();

    loadSettings();

    setupEventListeners();

    window.addEventListener('scroll', handleScroll);
});

function loadQuranData() {
    fetch('quran-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            quranData.verses = data.verses;
            quranData.surahs = data.surahs;
            displayDailyVerse();
            displayRecommendedSurahs();
        })
        .catch(error => {
            console.error('Error loading quran data:', error);
            verseArabicElement.textContent = 'عذراً، حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.';
            surahsGridElement.innerHTML = '<p class="error-message">عذراً، حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.</p>';
        });
}

function updateHijriDate() {
    const today = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: 'islamic'
    };

    try {
        const hijriDate = today.toLocaleDateString('ar-SA', options);
        hijriDateElement.textContent = hijriDate;
    } catch (error) {
        hijriDateElement.textContent = today.toLocaleDateString('ar', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function displayDailyVerse() {
    if (!quranData.verses || quranData.verses.length === 0) {
    }

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const verseIndex = dayOfYear % quranData.verses.length;

    displayVerse(verseIndex);
}

function changeVerseRandomly() {
    if (!quranData.verses || quranData.verses.length === 0) {
    }

    const randomIndex = Math.floor(Math.random() * quranData.verses.length);
    displayVerse(randomIndex);
}

function displayVerse(index) {
    const verse = quranData.verses[index];

    verseArabicElement.textContent = verse.arabic;
    verseTranslationElement.textContent = verse.translation;
    verseReferenceElement.textContent = verse.reference;

    modalVerseArabic.textContent = verse.arabic;
    modalVerseTranslation.textContent = verse.translation;
    modalTafseer.textContent = verse.tafseer;
    modalSignificance.textContent = verse.significance;

    listenBtn.setAttribute('data-audio', verse.audioUrl);

    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer = null;
        listenBtn.innerHTML = '<i class="fas fa-volume-up"></i> استمع للتلاوة';
    }
}

function displayRecommendedSurahs() {
    if (!quranData.surahs || quranData.surahs.length === 0) {
    }

    surahsGridElement.innerHTML = '';

    quranData.surahs.forEach((surah, index) => {
        const surahCard = document.createElement('div');
        surahCard.className = 'surah-card';

        surahCard.innerHTML = `
            <div class="surah-header">
                <div class="surah-name">
                    ${surah.name}
                    <span class="number">${surah.number}</span>
                </div>
                <div class="surah-info">${surah.info}</div>
            </div>
            <div class="surah-body">
                <p class="surah-description">${surah.description}</p>
                <p class="surah-benefits">${surah.benefits}</p>
                <a href="#" class="read-surah-btn" data-surah-index="${index}">
                    قراءة السورة <i class="fas fa-book"></i>
                </a>
            </div>
        `;

        surahsGridElement.appendChild(surahCard);
    });

    document.querySelectorAll('.read-surah-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const surahIndex = parseInt(this.getAttribute('data-surah-index'));
            openSurahModal(quranData.surahs[surahIndex]);
        });
    });
}

function openSurahModal(surah) {
    modalSurahName.textContent = surah.name;
    modalSurahInfo.textContent = surah.info;
    modalSurahText.textContent = surah.text;
    modalSurahBenefits.textContent = surah.benefits;
    surahAudioPlayer.src = surah.audioUrl;

    surahModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function setupEventListeners() {
    readMoreBtn.addEventListener('click', () => {
        verseModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    listenBtn.addEventListener('click', function () {
        const audioUrl = this.getAttribute('data-audio');

        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer = null;
            this.innerHTML = '<i class="fas fa-volume-up"></i> استمع للتلاوة';
            return;
        }

        audioPlayer = new Audio(audioUrl);
        audioPlayer.play();
        this.innerHTML = '<i class="fas fa-stop"></i> إيقاف التلاوة';

        audioPlayer.addEventListener('ended', () => {
            this.innerHTML = '<i class="fas fa-volume-up"></i> استمع للتلاوة';
            audioPlayer = null;
        });
    });

    if (changeVerseBtn) {
        changeVerseBtn.addEventListener('click', () => {
            changeVerseRandomly();
        });
    }

    shareBtn.addEventListener('click', async () => {
        const verse = verseArabicElement.textContent;
        const translation = verseTranslationElement.textContent;
        const reference = verseReferenceElement.textContent;

        const shareText = `${verse}\n\n${translation}\n\n${reference}\n\nمن موقع مذكر القرآن`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'آية اليوم',
                    text: shareText
                });
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = shareText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                alert('تم نسخ الآية إلى الحافظة');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            verseModal.style.display = 'none';
            surahModal.style.display = 'none';
            document.body.style.overflow = 'auto';

            if (surahAudioPlayer) {
                surahAudioPlayer.pause();
                surahAudioPlayer.currentTime = 0;
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === verseModal) {
            verseModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === surahModal) {
            surahModal.style.display = 'none';
            document.body.style.overflow = 'auto';

            if (surahAudioPlayer) {
                surahAudioPlayer.pause();
                surahAudioPlayer.currentTime = 0;
            }
        }
    });

    saveSettingsBtn.addEventListener('click', () => {
        const reminderTime = reminderTimeInput.value;
        const notificationsEnabled = notificationEnabledCheckbox.checked;

        localStorage.setItem('quranReminderTime', reminderTime);
        localStorage.setItem('quranNotificationsEnabled', notificationsEnabled);

        if (notificationsEnabled && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        scheduleNotification(reminderTime);

        alert('تم حفظ الإعدادات بنجاح');
    });

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

function loadSettings() {
    const savedTime = localStorage.getItem('quranReminderTime');
    const savedNotifications = localStorage.getItem('quranNotificationsEnabled');

    if (savedTime) {
        reminderTimeInput.value = savedTime;
    }

    if (savedNotifications !== null) {
        notificationEnabledCheckbox.checked = savedNotifications === 'true';
    }

    if (savedTime && savedNotifications === 'true') {
        scheduleNotification(savedTime);
    }
}

function scheduleNotification(time) {
    if (window.reminderTimeout) {
        clearTimeout(window.reminderTimeout);
    }

    const [hours, minutes] = time.split(':').map(Number);

    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime - now;

    window.reminderTimeout = setTimeout(() => {
        sendNotification();
        scheduleNotification(time);
    }, timeUntilNotification);
}

function sendNotification() {
    if (Notification.permission === 'granted' && localStorage.getItem('quranNotificationsEnabled') === 'true') {
        if (!quranData.verses || quranData.verses.length === 0) {
        }

        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const verseIndex = dayOfYear % quranData.verses.length;

        const dailyVerse = quranData.verses[verseIndex];

        const notification = new Notification('مذكر القرآن - آية اليوم', {
            body: dailyVerse.arabic.substring(0, 50) + '...',
            icon: 'https://example.com/quran-icon.png'
        });

        notification.onclick = function () {
            window.focus();
            this.close();
        };
    }
}

function handleScroll() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});