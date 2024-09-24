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

// List of games to search for
const gamesList = [
    "Elden Ring: Shadow of the Erdtree",
    "Astro Bot",
    "Final Fantasy VII Rebirth",
    "UFO 50",
    "Animal Well",
    "Satisfactory",
    "Balatro",
    "The Last of Us Part II Remastered",
    "Thank Goodness You're Here!",
    "Tekken 8",
    "Destiny 2: The Final Shape",
    "Tsukihime: A Piece of Blue Glass Moon",
    "Horizon Forbidden West: Complete Edition",
    "Like a Dragon: Infinite Wealth",
    "Castlevania Dominus Collection"
];

// Fetch game data from RAWG API for each game in the list
async function fetchGames() {
    try {
        const gamesData = [];
        
        // Loop through each game and fetch its data
        for (const gameName of gamesList) {
            const searchUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(gameName)}`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            // If the game is found, push its data
            if (data.results && data.results.length > 0) {
                gamesData.push(data.results[0]); // Get the first result for the game
            } else {
                console.log(`Game not found: ${gameName}`);
            }
        }

        // Display the games in the table
        if (gamesData.length > 0) {
            displayGames(gamesData);
        } else {
            console.log('No games found.');
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// Function to dynamically create and style the table using D3.js
function displayGames(games) {
    // Clear any existing table content
    d3.select('#gamesTable').html('');

    // Append table headers
    const headers = ['Game Name', 'Release Date', 'Platforms', 'Metacritic Score', 'Genres'];
    const thead = d3.select('#gamesTable').append('thead');
    const headerRow = thead.append('tr');

    // Create headers and add sorting functionality
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

    // Create table body
    const tbody = d3.select('#gamesTable').append('tbody');

    // Populate rows with game data
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

    // Game Name
    rows.append('td')
        .text(d => d.name)
        .style('padding', '10px');

    // Release Date
    rows.append('td')
        .text(d => new Date(d.released).toLocaleDateString())  // Format date to readable format
        .style('padding', '10px');

    // Platforms
    rows.append('td')
        .text(d => d.platforms ? d.platforms.map(p => p.platform.name).join(', ') : 'N/A')  // Handle null/undefined platforms
        .style('padding', '10px');

    // Metacritic Score
    rows.append('td')
        .text(d => d.metacritic || 'N/A')  // Show Metacritic score or 'N/A' if missing
        .style('padding', '10px');

    // Genres
    rows.append('td')
        .text(d => d.genres ? d.genres.map(g => g.name).join(', ') : 'N/A')  // Handle null/undefined genres
        .style('padding', '10px');

    // Store current games data for sorting
    window.currentGames = games;
}

// Sorting function
let sortAscending = true;

function sortTable(column) {
    const tbody = d3.select('tbody');
    
    // Sort games based on the clicked column
    let sortedData;
    if (column === 'releasedate') {
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
    rows.append('td').text(d => d.platforms ? d.platforms.map(p => p.platform.name).join(', ') : 'N/A').style('padding', '10px');
    rows.append('td').text(d => d.metacritic || 'N/A').style('padding', '10px');
    rows.append('td').text(d => d.genres ? d.genres.map(g => g.name).join(', ') : 'N/A').style('padding', '10px');
}

// Fetch and display games when the page loads
document.addEventListener('DOMContentLoaded', fetchGames);