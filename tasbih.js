const tasbihCount = document.getElementById('tasbih-count');
const timerElement = document.getElementById('timer');
const timerToggle = document.getElementById('timer-toggle');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const tasbihButton = document.getElementById('tasbih-button');
const beadsContainer = document.getElementById('beads-container');
const currentDhikr = document.querySelector('.current-dhikr');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const dhikrContainers = document.querySelectorAll('.dhikr-container');
const subhanallahCount = document.getElementById('subhanallah-count');
const alhamdulillahCount = document.getElementById('alhamdulillah-count');
const allahuakbarCount = document.getElementById('allahuakbar-count');
const lailahaCount = document.getElementById('lailaha-count');
const subhanallahTarget = document.getElementById('subhanallah-target');
const alhamdulillahTarget = document.getElementById('alhamdulillah-target');
const allahuakbarTarget = document.getElementById('allahuakbar-target');
const lailahaTarget = document.getElementById('lailaha-target');

let state = {
    counts: {
        subhanallah: 0,
        alhamdulillah: 0,
        allahuakbar: 0,
        lailaha: 0
    },
    currentDhikrIndex: 0,
    targetCount: 33,
    timerRunning: false,
    timerStart: null,
    timerElapsed: 0
};

const dhikrTypes = [
    { id: 'subhanallah', text: 'سبحان الله', container: 'subhanallah-container', count: subhanallahCount, target: subhanallahTarget },
    { id: 'alhamdulillah', text: 'الحمد لله', container: 'alhamdulillah-container', count: alhamdulillahCount, target: alhamdulillahTarget },
    { id: 'allahuakbar', text: 'الله أكبر', container: 'allahuakbar-container', count: allahuakbarCount, target: allahuakbarTarget },
    { id: 'lailaha', text: 'لا إله إلا الله', container: 'lailaha-container', count: lailahaCount, target: lailahaTarget }
];

function initializeBeads() {
    beadsContainer.innerHTML = '';
    const totalBeads = state.targetCount;

    for (let i = 0; i < totalBeads; i++) {
        const bead = document.createElement('div');
        bead.className = 'bead';
        bead.dataset.index = i;
        beadsContainer.appendChild(bead);
    }

    updateBeads();
}

function updateBeads() {
    const beads = document.querySelectorAll('.bead');
    const currentDhikr = dhikrTypes[state.currentDhikrIndex];
    const currentCount = state.counts[currentDhikr.id];

    beads.forEach((bead, index) => {
        bead.classList.remove('active');

        if (index < currentCount) {
            bead.classList.add('completed');
        } else {
            bead.classList.remove('completed');
        }

        if (index === currentCount && currentCount < state.targetCount) {
            bead.classList.add('active');
        }
    });
}

function updateCounters() {
    subhanallahCount.textContent = state.counts.subhanallah;
    alhamdulillahCount.textContent = state.counts.alhamdulillah;
    allahuakbarCount.textContent = state.counts.allahuakbar;
    lailahaCount.textContent = state.counts.lailaha;

    dhikrContainers.forEach(container => {
        container.classList.remove('active');
    });

    const currentDhikr = dhikrTypes[state.currentDhikrIndex];
    document.getElementById(currentDhikr.container).classList.add('active');

    document.querySelector('.current-dhikr').textContent = currentDhikr.text;
}

function updateTargets() {
    subhanallahTarget.textContent = state.targetCount;
    alhamdulillahTarget.textContent = state.targetCount;
    allahuakbarTarget.textContent = state.targetCount;
    lailahaTarget.textContent = state.targetCount;
}

function incrementCounter() {
    const currentDhikr = dhikrTypes[state.currentDhikrIndex];

    if (state.counts[currentDhikr.id] < state.targetCount) {
        state.counts[currentDhikr.id]++;

        tasbihButton.classList.add('clicked');
        setTimeout(() => {
            tasbihButton.classList.remove('clicked');
        }, 300);

        if (state.counts[currentDhikr.id] === state.targetCount) {
            const allCompleted = Object.values(state.counts).every(count => count === state.targetCount);
            if (allCompleted) {
                showCompletionMessage();
            }
        }

        updateCounters();
        updateBeads();
    }
}

function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}

function showCompletionMessage() {
    const allCompleted = Object.values(state.counts).every(count => count === state.targetCount);

    if (allCompleted) {
        const notification = document.createElement('div');
        notification.className = 'completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <h3>أحسنت!</h3>
                <p>لقد أكملت جميع الأذكار. تقبل الله منك.</p>
                <button class="btn close-notification">إغلاق</button>
            </div>
        `;

        document.body.appendChild(notification);

        const style = document.createElement('style');
        style.textContent = `
            .completion-notification {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1001;
                animation: fadeIn 0.3s ease;
            }
            
            .notification-content {
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .notification-content i {
                font-size: 3rem;
                color: var(--primary-color);
                margin-bottom: 15px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        document.head.appendChild(style);

        document.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
            style.remove();
        });
    }
}

function resetCounters() {
    if (confirm('هل أنت متأكد من إعادة ضبط جميع العدادات؟')) {
        state.counts = {
            subhanallah: 0,
            alhamdulillah: 0,
            allahuakbar: 0,
            lailaha: 0
        };
        state.currentDhikrIndex = 0;

        updateCounters();
        updateBeads();
    }
}

function startTimer() {
    if (!state.timerRunning) {
        state.timerRunning = true;
        state.timerStart = Date.now() - state.timerElapsed;
        timerToggle.innerHTML = '<i class="fas fa-pause"></i>';

        timerInterval = setInterval(updateTimer, 1000);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    state.timerRunning = false;
    clearInterval(timerInterval);
    timerToggle.innerHTML = '<i class="fas fa-play"></i>';
}

function updateTimer() {
    if (state.timerRunning) {
        const currentTime = Date.now();
        state.timerElapsed = currentTime - state.timerStart;

        const seconds = Math.floor((state.timerElapsed / 1000) % 60);
        const minutes = Math.floor((state.timerElapsed / (1000 * 60)) % 60);
        const hours = Math.floor((state.timerElapsed / (1000 * 60 * 60)) % 24);

        timerElement.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function saveProgress() {
    const progressData = JSON.stringify({
        counts: state.counts,
        currentDhikrIndex: state.currentDhikrIndex,
        targetCount: state.targetCount,
        timerElapsed: state.timerElapsed
    });

    localStorage.setItem('tasbihProgress', progressData);

    const saveConfirm = document.createElement('div');
    saveConfirm.className = 'save-confirmation';
    saveConfirm.textContent = 'تم حفظ التقدم بنجاح';
    document.body.appendChild(saveConfirm);

    setTimeout(() => {
        saveConfirm.remove();
    }, 2000);
}

function loadProgress() {
    const savedProgress = localStorage.getItem('tasbihProgress');

    if (savedProgress) {
        const progressData = JSON.parse(savedProgress);

        state.counts = progressData.counts;
        state.currentDhikrIndex = progressData.currentDhikrIndex;
        state.targetCount = progressData.targetCount;
        state.timerElapsed = progressData.timerElapsed;

        tasbihCount.value = state.targetCount;
        updateCounters();
        updateTargets();
        initializeBeads();

        const seconds = Math.floor((state.timerElapsed / 1000) % 60);
        const minutes = Math.floor((state.timerElapsed / (1000 * 60)) % 60);
        const hours = Math.floor((state.timerElapsed / (1000 * 60 * 60)) % 24);

        timerElement.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

        const loadConfirm = document.createElement('div');
        loadConfirm.className = 'load-confirmation';
        loadConfirm.textContent = 'تم استعادة التقدم بنجاح';
        document.body.appendChild(loadConfirm);

        setTimeout(() => {
            loadConfirm.remove();
        }, 2000);
    } else {
        alert('لا يوجد تقدم محفوظ');
    }
}

function changeTargetCount() {
    state.targetCount = parseInt(tasbihCount.value);
    updateTargets();
    initializeBeads();
}

tasbihButton.addEventListener('click', incrementCounter);
resetBtn.addEventListener('click', resetCounters);
saveBtn.addEventListener('click', saveProgress);
loadBtn.addEventListener('click', loadProgress);
tasbihCount.addEventListener('change', changeTargetCount);
timerToggle.addEventListener('click', startTimer);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    });
});

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .save-confirmation, .load-confirmation {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 1.7s forwards;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

document.head.appendChild(notificationStyles);

document.addEventListener('DOMContentLoaded', () => {
    initializeBeads();
    updateCounters();
    updateTargets();

    function setupDhikrSelection() {
        dhikrContainers.forEach((container, index) => {
            container.addEventListener('click', () => {
                state.currentDhikrIndex = index;
                updateCounters();
                updateBeads();
            });
            container.style.cursor = 'pointer';
        });
    }

    setupDhikrSelection();

    if (localStorage.getItem('tasbihProgress')) {
        const loadConfirm = document.createElement('div');
        loadConfirm.className = 'load-notification';
        loadConfirm.innerHTML = `
            <p>هناك تقدم محفوظ. هل ترغب في استعادته؟</p>
            <button id="load-yes" class="btn">نعم</button>
            <button id="load-no" class="btn">لا</button>
        `;
        document.body.appendChild(loadConfirm);

        const loadNotificationStyle = document.createElement('style');
        loadNotificationStyle.textContent = `
            .load-notification {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background-color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                text-align: center;
            }
            
            .load-notification p {
                margin-bottom: 10px;
            }
            
            .load-notification .btn {
                margin: 0 5px;
            }
        `;

        document.head.appendChild(loadNotificationStyle);

        document.getElementById('load-yes').addEventListener('click', () => {
            loadProgress();
            loadConfirm.remove();
            loadNotificationStyle.remove();
        });

        document.getElementById('load-no').addEventListener('click', () => {
            loadConfirm.remove();
            loadNotificationStyle.remove();
        });
    }
});