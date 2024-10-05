document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  
    // Base URL to be used for all navigation links
    const baseUrl = '/WSOA3029A_2497147_MthokozisiKubheka';
  
    // Array of navigation items with title and URL
    const navItems = [
      { title: "Home", url: `${baseUrl}/index.html` },
      { title: "Theory Work", url: `${baseUrl}/pages/theory/theory.html` },
      { title: "Data", url: `${baseUrl}/pages/dataart/dataart.html` },
      { title: "Design", url: `${baseUrl}/pages/design/design.html` }
    ];
  
    // Generate the navigation bar
    const navBar = document.querySelector('.navbar ul');
    if (navBar) {
      navItems.forEach(item => {
        console.log('Creating nav item:', item);
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title;
        listItem.appendChild(link);
        navBar.appendChild(listItem);
      });
      console.log('Navbar appended to the body');
    } else {
      console.error('Navbar element not found');
    }
  
    // Back to Top Navigation
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling down 300px
          backToTopButton.style.display = 'block';
        } else {
          backToTopButton.style.display = 'none';
        }
      });
  
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      console.error('Back to top button not found');
    }
  });

// Define the sidebar content for different pages
const sidebars = {
    design: [
        { id: 'ixdprocess', text: 'IxD Process' },
        { id: 'uielements', text: 'UI Elements' },
        { id: 'wireframes', text: 'Wireframes' },
        { id: 'styles', text: 'Styles' }
    ],
    theory: [
        { id: 'essay', text: 'Essay' },
        { id: 'weeklyupdates', text: 'Weekly Updates' }
    ]
};

// Function to generate the sidebar
function generateSidebar(page) {
    const sidebarContent = sidebars[page];
    if (!sidebarContent) return;

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');

    sidebarContent.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'javascript:void(0);';
        a.textContent = item.text;
        a.onclick = () => showSection(item.id);
        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    sidebar.appendChild(nav);

    // Append the sidebar to the body or a specific container
    document.body.appendChild(sidebar);
}

// Function to show the selected section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('article').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}


document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page; // Assuming you set a data-page attribute on the body
    generateSidebar(page);
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





