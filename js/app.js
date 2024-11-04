document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const baseUrl = '/WSOA3029A_2497147_MthokozisiKubheka';
    const navItems = [
        { title: "Home", url: `${baseUrl}/index.html` },
        { title: "Theory Work", url: `${baseUrl}/pages/theory/theory.html` },
        { title: "Data", url: `${baseUrl}/pages/dataart/dataart.html` },
        { title: "Design", url: `${baseUrl}/pages/design/design.html` }
    ];

    generateNavBar(navItems);
    handleBackToTopButton();
    const page = document.body.dataset.page; // Assuming data-page is set on the body, as set for theory and design
    generateSidebar(page);
    setupImageModal();
});
// Add logo to the navbar
const logoUrl = `${baseUrl}/images/logo.png`; 
const logo = document.createElement('img');
logo.src = logoUrl;
logo.alt = 'Website Logo';
logo.className = 'navbar-logo';

const navBar = document.querySelector('.navbar');
if (navBar) {
    navBar.insertBefore(logo, navBar.firstChild);
} else {
    console.error('Navbar element not found');
}
// Generate the navigation bar
function generateNavBar(navItems) {
    const navBar = document.querySelector('.navbar ul');
    if (!navBar) {
        console.error('Navbar element not found');
        return;
    }

    navItems.forEach(item => {
        console.log('Creating nav item:', item);
        const listItem = createNavItem(item);
        navBar.appendChild(listItem);
    });

    console.log('Navbar appended to the body');
}

// Create a navigation item
function createNavItem({ title, url }) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    listItem.appendChild(link);
    return listItem;
}

// Handle Back to Top button visibility and functionality
function handleBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) {
        console.error('Back to top button not found');
        return;
    }

    window.addEventListener('scroll', () => {
        backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Generate the sidebar based on the page type
function generateSidebar(page) {
    const sidebarContent = sidebars[page];
    if (!sidebarContent) return;

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');

    sidebarContent.forEach(item => {
        const li = createSidebarItem(item);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    sidebar.appendChild(nav);
    document.body.appendChild(sidebar);
}

// Create a sidebar item
function createSidebarItem({ id, text }) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = 'javascript:void(0);';
    a.textContent = text;
    a.onclick = () => showSection(id);
    li.appendChild(a);
    return li;
}

// Show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll('article').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Set up modal for interactive images
function setupImageModal() {
    const images = document.querySelectorAll('.clickable-image');
    const modal = createModal();
    document.body.appendChild(modal);

    images.forEach(image => {
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            modal.querySelector('#modal-image').src = image.src;
        });
    });

    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Create modal element
function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img class="modal-content" id="modal-image">
    `;
    return modal;
}

// Define the sidebar content for different pages
const sidebars = {
    design: [
        { id: 'ixdprocess', text: 'IxD Process' },
        { id: 'uielements', text: 'UI Elements' },
        { id: 'wireframes', text: 'Wireframes' },
    ],
    theory: [
        { id: 'essay', text: 'Essay' },
        { id: 'weeklyupdates', text: 'Weekly Updates' }
    ]
};


// Carousel functionality
let slideIndex = 1;

function setupCarousel() {
    showSlides(slideIndex);

    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next').addEventListener('click', () => changeSlide(1));
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => currentSlide(index + 1));
    });
}

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.querySelectorAll('.carousel-slide img');
    const dots = document.querySelectorAll('.dot');

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.className = dot.className.replace(' active', ''));

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' active';
}