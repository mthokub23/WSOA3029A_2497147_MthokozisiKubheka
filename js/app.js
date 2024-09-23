document.addEventListener('DOMContentLoaded', () => {

  // Base URL to be used for all navigation links
  const baseUrl = '/WSOA3029A_2497147';

  // Array of navigation items with title and URL
  const navItems = [
      { title: "Home", url: `${baseUrl}/index.html` },
      { title: "Data", url: `${baseUrl}/pages/dataart/dataart.html` },
      { title: "Planning", url: `${baseUrl}/pages/planning/planning.html` },
      { title: "Theory Work", url: `${baseUrl}/pages/theory/theory.html` },
      { title: "Design", url: `${baseUrl}/pages/design/design.html` }
  ];

  // Generate the navbar dynamically and append it to the DOM
  const navbar = document.querySelector('.navbar ul');
  generateNavbar(navItems, navbar);
});

/**
 * Generates a navigation bar dynamically by appending items to the specified DOM element.
 * @param {Array} navItems - An array of objects containing `title` and `url` for navigation links.
 * @param {HTMLElement} navbarElement - The target DOM element (usually a <ul>) where the items will be appended.
 */
function generateNavbar(navItems, navbarElement) {
  if (!Array.isArray(navItems) || !navbarElement) {
    console.error('Invalid arguments provided to generateNavbar');
    return;
  }

  // Clear existing navbar content before appending new items
  navbarElement.innerHTML = '';

  navItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.href = item.url;
    a.textContent = item.title;
    
    li.appendChild(a);
    navbarElement.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) { // Adjust the value as needed
          navbar.classList.add('scrolled');
      } else {
          navbar.classList.remove('scrolled');
      }
  });
});




//Back to Top Navigation 

document.addEventListener('DOMContentLoaded', () => {
  const backToTopButton = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
      if (window.scrollY > 300) { // Show button after scrolling down 300px
          backToTopButton.style.display = 'block';
          backToTopButton.style.opacity = '1';
      } else {
          backToTopButton.style.opacity = '0';
          setTimeout(() => {
              backToTopButton.style.display = 'none';
          }, 300); // Wait for the transition to complete
      }
  });

  backToTopButton.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
});


//Modal for interactive images
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.clickable-image');
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
      <span class="close">&times;</span>
      <img class="modal-content" id="modal-image">
  `;
  document.body.appendChild(modal);

  const modalImage = document.getElementById('modal-image');
  const closeModal = document.querySelector('.close');

  images.forEach(image => {
      image.addEventListener('click', () => {
          modal.style.display = 'block';
          modalImage.src = image.src;
      });
  });

  closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });
});