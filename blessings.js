const blessingInput = document.getElementById('blessing-input');
const addBlessingBtn = document.getElementById('add-blessing-btn');
const blessingsGrid = document.getElementById('blessings-grid');
const blessingsCount = document.getElementById('blessings-count');
const emptyState = document.getElementById('empty-state');
const exportPdfBtn = document.getElementById('export-pdf-btn');
const quotesSlider = document.getElementById('quotes-slider-content');
const prevQuoteBtn = document.getElementById('prev-quote');
const nextQuoteBtn = document.getElementById('next-quote');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

let blessings = [];
let currentQuoteIndex = 0;
const quotes = [
  {
    text: "لَئِن شَكَرتُمْ لَأَزِيدَنَّكُمْ",
    source: "سورة إبراهيم: 7"
  },
  {
    text: "وَاشْكُرُوا نِعْمَتَ اللَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ",
    source: "سورة النحل: 114"
  },
  {
    text: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ",
    source: "سورة النمل: 19"
  },
  {
    text: "من لا يشكر الناس لا يشكر الله",
    source: "حديث شريف"
  },
  {
    text: "العاجز من لم يعد للأيام عدتها، والكيس من دان نفسه وعمل لما بعد الموت",
    source: "حديث شريف"
  },
  {
    text: "اللهم إني أعوذ بك من زوال نعمتك، وتحول عافيتك، وفجاءة نقمتك، وجميع سخطك",
    source: "دعاء نبوي"
  },
  {
    text: "الحمد لله الذي بنعمته تتم الصالحات",
    source: "دعاء مأثور"
  },
  {
    "text": "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    "source": "سورة إبراهيم: 7"
  },
  {
    "text": "وَاشْكُرُوا نِعْمَتَ اللَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ",
    "source": "سورة النحل: 114"
  },
  {
    "text": "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ",
    "source": "سورة النمل: 19"
  },
  {
    "text": "من لا يشكر الناس لا يشكر الله",
    "source": "حديث شريف"
  },
  {
    "text": "إِنَّ اللَّهَ لَذُو فَضْلٍ عَلَى النَّاسِ وَلَكِنَّ أَكْثَرَ النَّاسِ لَا يَشْكُرُونَ",
    "source": "سورة غافر: 61"
  },
  {
    "text": "وَقَلِيلٌ مِّنْ عِبَادِيَ الشَّكُورُ",
    "source": "سورة سبأ: 13"
  },
  {
    "text": "فَكُلُوهُ حَمْدًا لِّلَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ",
    "source": "سورة البقرة: 172"
  },
  {
    "text": "وَأْمُرْ أَهْلَكَ بِالصَّلَاةِ وَاصْطَبِرْ عَلَيْهَا لَا نَسْأَلُكَ رِزْقًا نَّحْنُ نَرْزُقُكَ وَالْعَاقِبَةُ لِلتَّقْوَىٰ",
    "source": "سورة طه: 132"
  },
  {
    "text": "وَمَا بِكُم مِّن نِّعْمَةٍ فَمِنَ اللَّهِ ثُمَّ إِذَا مَسَّكُمُ الضُّرُّ فَإِلَيْهِ تَجْأَرُونَ",
    "source": "سورة النحل: 53"
  },
  {
    "text": "اعْمَلُوا آلَ دَاوُودَ شُكْرًا وَقَلِيلٌ مِّنْ عِبَادِيَ الشَّكُورُ",
    "source": "سورة سبأ: 13"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  loadBlessings();

  setupEventListeners();

  initQuotesSlider();

  window.addEventListener('scroll', handleScroll);
});

function loadBlessings() {
  const savedBlessings = localStorage.getItem('blessings');
  if (savedBlessings) {
    blessings = JSON.parse(savedBlessings);
    updateBlessingsDisplay();
  }
}

function setupEventListeners() {
  addBlessingBtn.addEventListener('click', addBlessing);

  blessingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlessing();
    }
  });

  exportPdfBtn.addEventListener('click', exportToPdf);

  prevQuoteBtn.addEventListener('click', showPreviousQuote);
  nextQuoteBtn.addEventListener('click', showNextQuote);

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function addBlessing() {
  const blessingText = blessingInput.value.trim();

  if (!blessingText) {
    alert('الرجاء كتابة النعمة قبل الإضافة');
    return;
  }

  const newBlessing = {
    id: Date.now(),
    text: blessingText,
    date: new Date().toLocaleDateString('ar-SA')
  };

  blessings.unshift(newBlessing);

  saveBlessings();

  updateBlessingsDisplay();

  blessingInput.value = '';
  blessingInput.focus();
}

function saveBlessings() {
  localStorage.setItem('blessings', JSON.stringify(blessings));
}

function updateBlessingsDisplay() {
  blessingsCount.textContent = blessings.length;

  blessingsGrid.innerHTML = '';

  if (blessings.length === 0) {
    emptyState.style.display = 'flex';
    blessingsGrid.style.display = 'none';
    exportPdfBtn.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    blessingsGrid.style.display = 'grid';
    exportPdfBtn.style.display = 'inline-flex';

    blessings.forEach(blessing => {
      const blessingCard = document.createElement('div');
      blessingCard.className = 'blessing-card';
      blessingCard.innerHTML = `
                <p class="blessing-text">${blessing.text}</p>
                <p class="blessing-date">${blessing.date}</p>
                <button class="delete-blessing" data-id="${blessing.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

      blessingsGrid.appendChild(blessingCard);
    });

    document.querySelectorAll('.delete-blessing').forEach(button => {
      button.addEventListener('click', deleteBlessing);
    });
  }
}

function deleteBlessing() {
  const blessingId = parseInt(this.getAttribute('data-id'));

  if (confirm('هل أنت متأكد من حذف هذه النعمة؟')) {
    blessings = blessings.filter(blessing => blessing.id !== blessingId);

    saveBlessings();

    updateBlessingsDisplay();
  }
}

function exportToPdf() {
  if (blessings.length === 0) {
    alert('لا توجد نعم لتحميلها. أضف بعض النعم أولاً.');
    return;
  }

  document.getElementById('export-date').textContent = new Date().toLocaleDateString('ar-SA');

  const pdfBlessingsList = document.getElementById('pdf-blessings-list');
  pdfBlessingsList.innerHTML = '';

  blessings.forEach((blessing, index) => {
    const blessingItem = document.createElement('div');
    blessingItem.className = 'pdf-blessing-item';
    blessingItem.innerHTML = `
            <p><strong>${index + 1}. ${blessing.text}</strong></p>
            <p class="pdf-date">${blessing.date}</p>
        `;
    pdfBlessingsList.appendChild(blessingItem);
  });

  const pdfTemplate = document.getElementById('pdf-template');

  const options = {
    margin: 10,
    filename: 'سجل_النعم.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(pdfTemplate).set(options).save();
}

function initQuotesSlider() {
  quotes.forEach((quote, index) => {
    const quoteItem = document.createElement('div');
    quoteItem.className = `quote-item ${index === 0 ? 'active' : ''}`;
    quoteItem.innerHTML = `
            <p class="quote-text">${quote.text}</p>
            <p class="quote-source">${quote.source}</p>
        `;
    quotesSlider.appendChild(quoteItem);
  });

  setInterval(showNextQuote, 10000);
}

function showNextQuote() {
  document.querySelectorAll('.quote-item').forEach(item => {
    item.classList.remove('active');
  });

  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;

  document.querySelectorAll('.quote-item')[currentQuoteIndex].classList.add('active');
}

function showPreviousQuote() {
  document.querySelectorAll('.quote-item').forEach(item => {
    item.classList.remove('active');
  });

  currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;

  document.querySelectorAll('.quote-item')[currentQuoteIndex].classList.add('active');
}

function handleScroll() {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}