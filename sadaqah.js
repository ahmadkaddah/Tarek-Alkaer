const charityContainer = document.getElementById('charity-container');
const modal = document.getElementById('charity-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close-modal');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

async function fetchCharities() {
    try {
        const response = await fetch('charity.json');
        if (!response.ok) {
            throw new Error('Failed to fetch charity data');
        }
        const charities = await response.json();
        displayCharities(charities);
    } catch (error) {
        console.error('Error loading charities:', error);
        charityContainer.innerHTML = `
            <div class="error-message">
                <p>عذراً، حدث خطأ أثناء تحميل أنواع الصدقات.</p>
                <p>يرجى المحاولة مرة أخرى لاحقاً.</p>
            </div>
        `;
    }
}

function displayCharities(charities) {
    charityContainer.innerHTML = '';
    
    charities.forEach((charity) => {
        const charityCard = document.createElement('div');
        charityCard.className = 'charity-card';
        charityCard.innerHTML = `
            <img src="${charity.image}" alt="${charity.title}" class="charity-image">
            <div class="charity-content">
                <h3 class="charity-title">${charity.title}</h3>
                <p class="charity-description">${charity.shortDescription}</p>
                <p class="charity-impact">${charity.impact}</p>
            </div>
        `;
        
        charityCard.addEventListener('click', () => {
            showModal(charity);
        });
        
        charityContainer.appendChild(charityCard);
    });
}

function showModal(charity) {
    modalTitle.textContent = charity.title;
    modalImage.src = charity.image;
    modalImage.alt = charity.title;
    
    modalDescription.innerHTML = `
        <p>${charity.fullDescription}</p>
        <h3>الأثر والفضل:</h3>
        <p>${charity.detailedImpact}</p>
        <h3>كيفية المساهمة:</h3>
        <p>${charity.howToContribute}</p>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

closeModal.addEventListener('click', closeModalFunc);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModalFunc();
    }
});

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
    anchor.addEventListener('click', function(e) {
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

document.addEventListener('DOMContentLoaded', () => {
    fetchCharities();
});