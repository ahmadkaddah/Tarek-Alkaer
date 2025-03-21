document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const currentJuzElement = document.getElementById('current-juz');
    const currentPageElement = document.getElementById('current-page');
    const daysRemainingElement = document.getElementById('days-remaining');
    const juzSelect = document.getElementById('juz-select');
    const pageSelect = document.getElementById('page-select');
    const pagesReadInput = document.getElementById('pages-read');
    const progressForm = document.getElementById('progress-form');
    const resetBtn = document.getElementById('reset-btn');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmResetBtn = document.getElementById('confirm-reset');
    const cancelResetBtn = document.getElementById('cancel-reset');
    const celebrationModal = document.getElementById('celebration-modal');
    const closeCelebration = document.querySelector('.close-celebration');
    const closeCelebrationBtn = document.getElementById('close-celebration');
    const backToTopBtn = document.querySelector('.back-to-top');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const motivationText = document.getElementById('motivation-text');
    const TOTAL_PAGES = 604;
    const PAGES_PER_JUZ = 20;
    const juzPages = {
        1: 21, 2: 22, 3: 20, 4: 22, 5: 22, 6: 20, 7: 19, 8: 20, 9: 21,
        10: 22, 11: 20, 12: 18, 13: 19, 14: 20, 15: 20, 16: 20, 17: 19, 18: 19,
        19: 20, 20: 21, 21: 18, 22: 18, 23: 18, 24: 21, 25: 20, 26: 20, 27: 21,
        28: 21, 29: 20, 30: 22
    };
    const motivationalQuotes = [
        "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا - رواه الترمذي",
        "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ - رواه البخاري",
        "الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ مَاهِرٌ بِهِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ - رواه مسلم",
        "اقْرَؤُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ - رواه مسلم",
        "إِنَّ الَّذِي لَيْسَ فِي جَوْفِهِ شَيْءٌ مِنَ الْقُرْآنِ كَالْبَيْتِ الْخَرِبِ - رواه الترمذي",
        "مَثَلُ الْمُؤْمِنِ الَّذِي يَقْرَأُ الْقُرْآنَ كَمَثَلِ الْأُتْرُجَّةِ رِيحُهَا طَيِّبٌ وَطَعْمُهَا طَيِّبٌ - متفق عليه",
        "﴿إِنَّ الَّذِنَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنْفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَنْ تَبُورَ﴾ - فاطر: 29",
        "﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا﴾ - المزمل: 4",
        "﴿أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَى قُلُوبٍ أَقْفَالُهَا﴾ - محمد: 24",
        "يُقَالُ لِصَاحِبِ الْقُرْآنِ: اقْرَأْ وَارْتَقِ وَرَتِّلْ كَمَا كُنْتَ تُرَتِّلُ فِي الدُّنْيَا، فَإِنَّ مَنْزِلَتَكَ عِنْدَ آخِرِ آيَةٍ تَقْرَؤُهَا - رواه أبو داود والترمذي"
    ];
    function init() {
        populateJuzSelect();
        populatePageSelect(1);
        populateSurahSelect();
        loadProgress();
        displayRandomMotivation();
        progressForm.addEventListener('submit', updateProgress);
        juzSelect.addEventListener('change', handleJuzChange);
        resetBtn.addEventListener('click', openConfirmationModal);
        closeModal.addEventListener('click', closeConfirmationModal);
        confirmResetBtn.addEventListener('click', resetProgress);
        cancelResetBtn.addEventListener('click', closeConfirmationModal);
        closeCelebration.addEventListener('click', closeCelebrationModal);
        closeCelebrationBtn.addEventListener('click', closeCelebrationModal);
        menuToggle.addEventListener('click', toggleMenu);
        const calculatePlanBtn = document.getElementById('calculate-plan-btn');
        if (calculatePlanBtn) {
            calculatePlanBtn.addEventListener('click', calculateReadingPlan);
        }

        const planTypeSelect = document.getElementById('plan-type');
        if (planTypeSelect) {
            planTypeSelect.addEventListener('change', togglePlanOptions);
        }
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
    function populateJuzSelect() {
        for (let i = 1; i <= 30; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `الجزء ${i}`;
            juzSelect.appendChild(option);
        }
    }
    function populatePageSelect(juzNumber) {
        pageSelect.innerHTML = '';
        const startPage = getJuzStartPage(juzNumber);
        const endPage = startPage + juzPages[juzNumber] - 1;

        for (let i = startPage; i <= endPage; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `الصفحة ${i}`;
            pageSelect.appendChild(option);
        }
    }
    function getJuzStartPage(juzNumber) {
        let startPage = 1;
        for (let i = 1; i < juzNumber; i++) {
            startPage += juzPages[i];
        }
        return startPage;
    }
    function handleJuzChange() {
        const selectedJuz = parseInt(juzSelect.value);
        populatePageSelect(selectedJuz);
    }
    function updateProgress(e) {
        e.preventDefault();

        const selectedJuz = parseInt(juzSelect.value);
        const selectedPage = parseInt(pageSelect.value);
        const pagesRead = parseInt(pagesReadInput.value);
        if (pagesRead < 1 || isNaN(pagesRead)) {
            alert('الرجاء إدخال عدد صفحات صحيح');
            return;
        }
        const currentProgress = {
            juz: selectedJuz,
            page: selectedPage,
            totalPagesRead: getTotalPagesRead(selectedJuz, selectedPage),
            lastUpdateDate: new Date().toISOString(),
            dailyReadingHistory: getProgressHistory()
        };
        const today = new Date().toISOString().split('T')[0];
        if (currentProgress.dailyReadingHistory[today]) {
            currentProgress.dailyReadingHistory[today] += pagesRead;
        } else {
            currentProgress.dailyReadingHistory[today] = pagesRead;
        }
        saveProgress(currentProgress);
        updateProgressUI(currentProgress);
        if (currentProgress.totalPagesRead >= TOTAL_PAGES) {
            celebrateCompletion();
        }
        pagesReadInput.value = 1;
    }
    function getTotalPagesRead(juz, page) {
        const juzStartPage = getJuzStartPage(juz);
        return juzStartPage + (page - juzStartPage);
    }
    function getProgressHistory() {
        const savedProgress = localStorage.getItem('khatmaProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            return progress.dailyReadingHistory || {};
        }
        return {};
    }
    function saveProgress(progress) {
        localStorage.setItem('khatmaProgress', JSON.stringify(progress));
    }
    function updateProgressUI(progress) {
        const percentage = Math.min(100, Math.round((progress.totalPagesRead / TOTAL_PAGES) * 100));
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
        currentJuzElement.textContent = progress.juz;
        currentPageElement.textContent = progress.page;
        const daysRemaining = calculateDaysRemaining(progress);
        daysRemainingElement.textContent = daysRemaining > 0 ? daysRemaining : '-';
    }
    function calculateDaysRemaining(progress) {
        const history = progress.dailyReadingHistory;
        const dates = Object.keys(history);

        if (dates.length === 0) return '-';
        let totalPages = 0;
        dates.forEach(date => {
            totalPages += history[date];
        });

        const averagePagesPerDay = totalPages / dates.length;
        if (averagePagesPerDay <= 0) return '-';

        const pagesRemaining = TOTAL_PAGES - progress.totalPagesRead;
        return Math.ceil(pagesRemaining / averagePagesPerDay);
    }
    function loadProgress() {
        const savedProgress = localStorage.getItem('khatmaProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            juzSelect.value = progress.juz;
            populatePageSelect(progress.juz);
            pageSelect.value = progress.page;
            updateProgressUI(progress);
        }
    }
    function resetProgress() {
        localStorage.removeItem('khatmaProgress');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        currentJuzElement.textContent = '1';
        currentPageElement.textContent = '1';
        daysRemainingElement.textContent = '-';
        juzSelect.value = 1;
        populatePageSelect(1);
        pageSelect.value = 1;
        pagesReadInput.value = 1;
        closeConfirmationModal();
    }
    function openConfirmationModal() {
        confirmationModal.style.display = 'block';
    }
    function closeConfirmationModal() {
        confirmationModal.style.display = 'none';
    }
    function celebrateCompletion() {
        celebrationModal.style.display = 'block';
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }
    function closeCelebrationModal() {
        celebrationModal.style.display = 'none';
    }
    function toggleMenu() {
        navLinks.classList.toggle('active');
    }
    function displayRandomMotivation() {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        motivationText.textContent = motivationalQuotes[randomIndex];
    }
    const surahPages = {
        "الفاتحة": { start: 1, end: 1 },
        "البقرة": { start: 2, end: 49 },
        "آل عمران": { start: 50, end: 76 },
        "النساء": { start: 77, end: 106 },
        "المائدة": { start: 107, end: 127 },
        "الأنعام": { start: 128, end: 150 },
        "الأعراف": { start: 151, end: 176 },
        "الأنفال": { start: 177, end: 186 },
        "التوبة": { start: 187, end: 207 },
        "يونس": { start: 208, end: 221 },
        "هود": { start: 222, end: 235 },
        "يوسف": { start: 236, end: 248 },
        "الرعد": { start: 249, end: 255 },
        "إبراهيم": { start: 256, end: 261 },
        "الحجر": { start: 262, end: 267 },
        "النحل": { start: 268, end: 281 },
        "الإسراء": { start: 282, end: 293 },
        "الكهف": { start: 294, end: 304 },
        "مريم": { start: 305, end: 312 },
        "طه": { start: 313, end: 321 },
        "الأنبياء": { start: 322, end: 331 },
        "الحج": { start: 332, end: 341 },
        "المؤمنون": { start: 342, end: 349 },
        "النور": { start: 350, end: 359 },
        "الفرقان": { start: 360, end: 366 },
        "الشعراء": { start: 367, end: 376 },
        "النمل": { start: 377, end: 385 },
        "القصص": { start: 386, end: 396 },
        "العنكبوت": { start: 397, end: 404 },
        "الروم": { start: 405, end: 410 },
        "لقمان": { start: 411, end: 414 },
        "السجدة": { start: 415, end: 417 },
        "الأحزاب": { start: 418, end: 427 },
        "سبأ": { start: 428, end: 434 },
        "فاطر": { start: 435, end: 440 },
        "يس": { start: 441, end: 445 },
        "الصافات": { start: 446, end: 452 },
        "ص": { start: 453, end: 458 },
        "الزمر": { start: 459, end: 467 },
        "غافر": { start: 468, end: 476 },
        "فصلت": { start: 477, end: 482 },
        "الشورى": { start: 483, end: 489 },
        "الزخرف": { start: 490, end: 495 },
        "الدخان": { start: 496, end: 498 },
        "الجاثية": { start: 499, end: 502 },
        "الأحقاف": { start: 503, end: 506 },
        "محمد": { start: 507, end: 510 },
        "الفتح": { start: 511, end: 515 },
        "الحجرات": { start: 516, end: 518 },
        "ق": { start: 519, end: 520 },
        "الذاريات": { start: 521, end: 523 },
        "الطور": { start: 524, end: 525 },
        "النجم": { start: 526, end: 528 },
        "القمر": { start: 529, end: 531 },
        "الرحمن": { start: 532, end: 534 },
        "الواقعة": { start: 535, end: 537 },
        "الحديد": { start: 538, end: 541 },
        "المجادلة": { start: 542, end: 545 },
        "الحشر": { start: 546, end: 548 },
        "الممتحنة": { start: 549, end: 551 },
        "الصف": { start: 552, end: 553 },
        "الجمعة": { start: 554, end: 554 },
        "المنافقون": { start: 555, end: 556 },
        "التغابن": { start: 557, end: 558 },
        "الطلاق": { start: 559, end: 560 },
        "التحريم": { start: 561, end: 562 },
        "الملك": { start: 563, end: 564 },
        "القلم": { start: 565, end: 566 },
        "الحاقة": { start: 567, end: 568 },
        "المعارج": { start: 569, end: 570 },
        "نوح": { start: 571, end: 571 },
        "الجن": { start: 572, end: 573 },
        "المزمل": { start: 574, end: 574 },
        "المدثر": { start: 575, end: 576 },
        "القيامة": { start: 577, end: 577 },
        "الإنسان": { start: 578, end: 579 },
        "المرسلات": { start: 580, end: 581 },
        "النبأ": { start: 582, end: 582 },
        "النازعات": { start: 583, end: 583 },
        "عبس": { start: 584, end: 584 },
        "التكوير": { start: 585, end: 585 },
        "الانفطار": { start: 586, end: 586 },
        "المطففين": { start: 587, end: 588 },
        "الانشقاق": { start: 589, end: 589 },
        "البروج": { start: 590, end: 590 },
        "الطارق": { start: 591, end: 591 },
        "الأعلى": { start: 591, end: 592 },
        "الغاشية": { start: 592, end: 592 },
        "الفجر": { start: 593, end: 594 },
        "البلد": { start: 594, end: 594 },
        "الشمس": { start: 595, end: 595 },
        "الليل": { start: 595, end: 596 },
        "الضحى": { start: 596, end: 596 },
        "الشرح": { start: 596, end: 596 },
        "التين": { start: 597, end: 597 },
        "العلق": { start: 597, end: 597 },
        "القدر": { start: 598, end: 598 },
        "البينة": { start: 598, end: 599 },
        "الزلزلة": { start: 599, end: 599 },
        "العاديات": { start: 599, end: 600 },
        "القارعة": { start: 600, end: 600 },
        "التكاثر": { start: 600, end: 600 },
        "العصر": { start: 601, end: 601 },
        "الهمزة": { start: 601, end: 601 },
        "الفيل": { start: 601, end: 601 },
        "قريش": { start: 602, end: 602 },
        "الماعون": { start: 602, end: 602 },
        "الكوثر": { start: 602, end: 602 },
        "الكافرون": { start: 603, end: 603 },
        "النصر": { start: 603, end: 603 },
        "المسد": { start: 603, end: 603 },
        "الإخلاص": { start: 604, end: 604 },
        "الفلق": { start: 604, end: 604 },
        "الناس": { start: 604, end: 604 }
    };
    function populateSurahSelect() {
        const startSurahSelect = document.getElementById('start-surah');
        const endSurahSelect = document.getElementById('end-surah');

        if (!startSurahSelect || !endSurahSelect) return;

        for (const surah in surahPages) {
            const startOption = document.createElement('option');
            startOption.value = surah;
            startOption.textContent = surah;
            startSurahSelect.appendChild(startOption);

            const endOption = document.createElement('option');
            endOption.value = surah;
            endOption.textContent = surah;
            endSurahSelect.appendChild(endOption);
        }
    }
    function togglePlanOptions() {
        const planType = document.getElementById('plan-type').value;
        const surahOptions = document.getElementById('surah-options');

        if (planType === 'pages') {
            surahOptions.style.display = 'none';
        } else {
            surahOptions.style.display = 'block';
        }
    }
    function calculateReadingPlan() {
        const days = parseInt(document.getElementById('plan-days').value);
        const khatmat = parseInt(document.getElementById('plan-khatmat').value);
        const planType = document.getElementById('plan-type').value;

        if (isNaN(days) || days <= 0 || isNaN(khatmat) || khatmat <= 0) {
            alert('الرجاء إدخال قيم صحيحة لعدد الأيام وعدد الختمات');
            return;
        }

        const resultElement = document.getElementById('plan-result');

        if (planType === 'pages') {
            const totalPages = TOTAL_PAGES * khatmat;
            const pagesPerDay = Math.ceil(totalPages / days);

            resultElement.innerHTML = `
                <div class="plan-result-item">
                    <h3>خطة القراءة اليومية:</h3>
                    <p>لإتمام ${khatmat} ختمة في ${days} يوم، عليك قراءة <strong>${pagesPerDay} صفحة</strong> يومياً.</p>
                </div>
            `;
        } else if (planType === 'surah') {
            const startSurah = document.getElementById('start-surah').value;
            const endSurah = document.getElementById('end-surah').value;

            if (!startSurah || !endSurah) {
                alert('الرجاء اختيار السور');
                return;
            }

            const startPage = surahPages[startSurah].start;
            const endPage = surahPages[endSurah].end;
            const totalPlanPages = (endPage - startPage + 1) * khatmat;
            const planPagesPerDay = Math.ceil(totalPlanPages / days);

            resultElement.innerHTML = `
                <div class="plan-result-item">
                    <h3>خطة القراءة اليومية:</h3>
                    <p>لإتمام ${khatmat} ختمة من سورة ${startSurah} إلى سورة ${endSurah} في ${days} يوم:</p>
                    <p>عليك قراءة <strong>${planPagesPerDay} صفحة</strong> يومياً.</p>
                    <p>من الصفحة ${startPage} إلى الصفحة ${endPage} (${endPage - startPage + 1} صفحة في كل ختمة)</p>
                </div>
            `;
        }
        resultElement.style.display = 'block';
    }
    init();
});
