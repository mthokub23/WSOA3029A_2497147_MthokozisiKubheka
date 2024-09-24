document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  
    // Base URL to be used for all navigation links
    const baseUrl = '/WSOA3029A_2497147_MthokozisiKubheka';
  
    // Array of navigation items with title and URL
    const navItems = [
      { title: "Home", url: `${baseUrl}/index.html` },
      { title: "Data", url: `${baseUrl}/pages/dataart/dataart.html` },
      { title: "Planning", url: `${baseUrl}/pages/planning/planning.html` },
      { title: "Theory Work", url: `${baseUrl}/pages/theory/theory.html` },
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



//API Exploitation
const apiKey = 'ce147b997cec44d7a97bf0d4a154f35c';
const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=2024-01-01,2024-08-31&metacritic=80,100&ordering=-released&page_size=10`;

async function fetchRecentGames() {
    try {
        const response = await fetch(gamesUrl);
        const data = await response.json();
        if (data.results.length > 0) {
            displayGames(data.results);  // Pass the game data to the D3.js function
        } else {
            console.log('No games found in this time period with a Metacritic score above 80.');
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// Function to dynamically create and style the table using D3.js
function displayGames(games) {
    // Clear existing content in case of re-rendering
    d3.select('#gamesTable').html('');

    // Select the gamesTable div and append a table
    const table = d3.select('#gamesTable')
                    .append('table')
                    .style('width', '100%')
                    .style('border-collapse', 'collapse');

    // Append the table headers (sortable)
    const headers = ['Game Name', 'Release Date', 'Platforms', 'Metacritic Score'];
    const thead = table.append('thead');
    const headerRow = thead.append('tr');

    // Append headers and make them clickable for sorting
    headerRow.selectAll('th')
        .data(headers)
        .enter()
        .append('th')
        .text(d => d)
        .style('padding', '10px')
        .style('border-bottom', '1px solid #ddd')
        .style('cursor', 'pointer')
        .on('click', function(d) {
            const column = d.toLowerCase().replace(/\s+/g, ''); // Simplify column name
            sortTable(column);
        });

    // Append the table body
    const tbody = table.append('tbody');

    // Populate the rows with game data
    const rows = tbody.selectAll('tr')
        .data(games)
        .enter()
        .append('tr')
        .style('border-bottom', '1px solid #ddd')
        .on('mouseover', function() {
            d3.select(this).style('background-color', '#e1e1e1');
        })
        .on('mouseout', function() {
            d3.select(this).style('background-color', 'white');
        });

    // Append cells for each game with name, release date, platforms, and Metacritic score
    rows.append('td')
        .text(d => d.name)
        .style('padding', '10px')
        .style('border-bottom', '1px solid #ddd');
    
    rows.append('td')
        .text(d => new Date(d.released).toLocaleDateString())  // Format the date
        .style('padding', '10px')
        .style('border-bottom', '1px solid #ddd');
    
    rows.append('td')
        .text(d => d.platforms.map(p => p.platform.name).join(', '))
        .style('padding', '10px')
        .style('border-bottom', '1px solid #ddd');
    
    rows.append('td')
        .text(d => d.metacritic || 'N/A')  // Show Metacritic score or 'N/A' if missing
        .style('padding', '10px')
        .style('border-bottom', '1px solid #ddd');

    // Store current games data for sorting
    window.currentGames = games;
}

// Sorting function
let sortAscending = true;

function sortTable(column) {
    const tbody = d3.select('tbody');
    
    // Sort games based on the clicked column
    let sortedData;
    if (column === 'released') {
        sortedData = window.currentGames.sort((a, b) => {
            const dateA = new Date(a.released);
            const dateB = new Date(b.released);
            return sortAscending ? dateA - dateB : dateB - dateA;
        });
    } else if (column === 'gamename') {
        sortedData = window.currentGames.sort((a, b) => {
            return sortAscending
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
    } else if (column === 'metacriticscore') {
        sortedData = window.currentGames.sort((a, b) => {
            return sortAscending
                ? (a.metacritic || 0) - (b.metacritic || 0)
                : (b.metacritic || 0) - (a.metacritic || 0);
        });
    }

    // Toggle the sorting direction
    sortAscending = !sortAscending;

    // Clear existing rows
    tbody.selectAll('tr').remove();

    // Re-populate rows with sorted data
    const rows = tbody.selectAll('tr')
        .data(sortedData)
        .enter()
        .append('tr')
        .style('border-bottom', '1px solid #ddd')
        .on('mouseover', function() {
            d3.select(this).style('background-color', '#e1e1e1');
        })
        .on('mouseout', function() {
            d3.select(this).style('background-color', 'white');
        });

    // Re-populate cells
    rows.append('td').text(d => d.name).style('padding', '10px');
    rows.append('td').text(d => new Date(d.released).toLocaleDateString()).style('padding', '10px');
    rows.append('td').text(d => d.platforms.map(p => p.platform.name).join(', ')).style('padding', '10px');
    rows.append('td').text(d => d.metacritic || 'N/A').style('padding', '10px');
}

// Ensure D3.js is loaded before using it
if (typeof d3 === 'undefined') {
    console.error('D3.js is not loaded. Please include D3.js in your HTML file.');
} else {
    // Fetch and display games on page load
    document.addEventListener('DOMContentLoaded', fetchRecentGames);
}