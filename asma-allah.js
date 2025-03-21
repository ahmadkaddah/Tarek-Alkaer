const namesContainer = document.getElementById('names-container');
const modal = document.getElementById('name-modal');
const modalName = document.getElementById('modal-name');
const modalMeaning = document.getElementById('modal-meaning');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close-modal');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

async function fetchNames() {
    try {
        const response = await fetch('names.json');
        if (!response.ok) throw new Error('Failed to load names');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        namesContainer.innerHTML = `
            <div class="error-message">
                <p>عذراً، حدث خطأ أثناء تحميل الأسماء الحسنى.</p>
                <p>تأكد من أن الملف <code>names.json</code> موجود في المسار الصحيح.</p>
            </div>
        `;
        return [];
    }
}

function displayNames(allahNames) {
    namesContainer.innerHTML = allahNames.map(nameObj => `
        <div class="name-card" onclick="showModal(${JSON.stringify(nameObj).replace(/"/g, '&quot;')})">
            <h2 class="arabic-name">${nameObj.name}</h2>
            <p class="name-meaning">${nameObj.meaning}</p>
        </div>
    `).join('');
}

function showModal(nameObj) {
    modalName.textContent = nameObj.name;
    modalMeaning.textContent = nameObj.meaning;
    modalDescription.innerHTML = `<p>${nameObj.description}</p>`;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

document.addEventListener('DOMContentLoaded', async () => {
    const allahNames = await fetchNames();
    if (allahNames.length) displayNames(allahNames);
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => e.target === modal && closeModal.click());
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal.click());

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
navLinks.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => navLinks.classList.remove('active'))
);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target && window.scrollTo({
            top: target.offsetTop - 60,
            behavior: 'smooth'
        });
    });
});