//API Exploitation
const apiKey = 'ce147b997cec44d7a97bf0d4a154f35c';

/// List of games to search for
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

/// Function to dynamically create and style the table using D3.js
function displayGames(games) {
    // Define the table headers
    const headers = ['Game Name', 'Release Date', 'Platforms', 'Metacritic', 'Genres'];

    // Create the table and append headers
    const table = d3.select('#gamesTable')
                    .append('table')
                    .style('width', '50%')
                    .style('border-collapse', 'collapse');

    // Create the table header
    const thead = table.append('thead');
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
        .on('click', function() {
            const column = d3.select(this).text().toLowerCase().replace(/\s+/g, ''); // Simplify column name
            sortTable(column);
        });

    // Create table body
    const tbody = table.append('tbody');

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

    // Game Name (clickable)
    rows.append('td')
        .text(d => d.name)
        .style('padding', '10px')
        .style('color', '#ffcc00')  // Color to indicate it's clickable
        .style('cursor', 'pointer')  // Indicate clickable
        .on('click', function(event, d) {
            fetchScreenshot(d.id);  // Fetch screenshot on click
        });

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

// Fetch screenshot for the selected game
async function fetchScreenshot(gameId) {
    try {
        // API endpoint for fetching screenshots
        const screenshotUrl = `https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}&page_size=1`; // Get only the first screenshot
        const response = await fetch(screenshotUrl);
        const data = await response.json();

        // Check if there are results for screenshots
        if (data.results && data.results.length > 0) {
            // Take the first screenshot from the results
            const screenshot = data.results[0].image;

            // Display the screenshot in the img tag
            const screenshotImage = document.getElementById('screenshotImage');
            screenshotImage.src = screenshot;
            screenshotImage.style.display = 'block'; // Show the image
        } else {
            // No screenshots found for the game, show a default message
            console.log("No screenshots found for this game.");
            showDefaultImage(); // Function to display default image/message
        }
    } catch (error) {
        // Error handling
        console.error("Error fetching screenshot:", error);
        showDefaultImage(); // Fallback in case of an error
    }
}

// Fallback function to handle when no screenshot is available or an error occurs
function showDefaultImage() {
    const screenshotImage = document.getElementById('screenshotImage');
    screenshotImage.src = 'assets/images/default-image.jpg';  // A default image
    screenshotImage.style.display = 'block';  // Show the fallback image
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
    } else if (column === 'metacritic') {
        sortedData = window.currentGames.sort((a, b) => {
            return sortAscending
                ? (a.metacritic || 0) - (b.metacritic || 0)  // Handle missing metacritic
                : (b.metacritic || 0) - (a.metacritic || 0);
        });
    } else if (column === 'platforms') {
        sortedData = window.currentGames.sort((a, b) => {
            const platformsA = a.platforms ? a.platforms.map(p => p.platform.name).join(', ') : '';
            const platformsB = b.platforms ? b.platforms.map(p => p.platform.name).join(', ') : '';
            return sortAscending
                ? platformsA.localeCompare(platformsB)
                : platformsB.localeCompare(platformsA);
        });
    } else if (column === 'genres') {
        sortedData = window.currentGames.sort((a, b) => {
            const genresA = a.genres ? a.genres.map(g => g.name).join(', ') : '';
            const genresB = b.genres ? b.genres.map(g => g.name).join(', ') : '';
            return sortAscending
                ? genresA.localeCompare(genresB)
                : genresB.localeCompare(genresA);
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
    rows.append('td').text(d => d.name).style('padding', '10px')
        .style('color', '#ffcc00')  // Color to indicate it's clickable
        .style('cursor', 'pointer')  // Indicate clickable
        .on('click', function(event, d) {
            fetchScreenshot(d.id);  // Fetch screenshot on click
        });
    -
    rows.append('td').text(d => new Date(d.released).toLocaleDateString()).style('padding', '10px');
    rows.append('td').text(d => d.platforms ? d.platforms.map(p => p.platform.name).join(', ') : 'N/A').style('padding', '10px');
    rows.append('td').text(d => d.metacritic || 'N/A').style('padding', '10px');
    rows.append('td').text(d => d.genres ? d.genres.map(g => g.name).join(', ') : 'N/A').style('padding', '10px');
}


// Fetch and display games when the page loads
document.addEventListener('DOMContentLoaded', fetchGames);





const year2024 = '2024';

// 1. Fetch the list of tags and find the ID for the "stealth" and "RPG" tags
async function fetchTags() {
    try {
        const tagUrl = `https://api.rawg.io/api/tags?key=${apiKey}&page_size=100`;
        const response = await fetch(tagUrl);
        const data = await response.json();

        // Search for "stealth" and "RPG" tags
        const stealthTag = data.results.find(tag => tag.name.toLowerCase() === 'stealth');
        const rpgTag = data.results.find(tag => tag.name.toLowerCase() === 'rpg'); // Correct search for "RPG"
        
        if (stealthTag && rpgTag) {
            console.log(`Tags found: Stealth ID ${stealthTag.id}, RPG ID ${rpgTag.id}`);
            fetchGamesByTags(stealthTag.id, rpgTag.id);
        } else {
            console.error('Stealth or RPG tag not found.');
        }
    } catch (error) {
        console.error('Error fetching tags:', error);
    }
}

// 2. Fetch games with the "stealth" and "RPG" tags released in 2024
async function fetchGamesByTags(stealthTagId, rpgTagId) {
    try {
        const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${year2024}-01-01,${year2024}-12-31&tags=${stealthTagId},${rpgTagId}&page_size=100`;
        const response = await fetch(gamesUrl);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Filter games by "stealth" and "RPG" tags separately
            const stealthGames = data.results.filter(game => game.tags.some(tag => tag.id === stealthTagId));
            const rpgGames = data.results.filter(game => game.tags.some(tag => tag.id === rpgTagId));

            const stealthData = countGamesByMonth(stealthGames);
            const rpgData = countGamesByMonth(rpgGames);

            // Draw the graph with both stealth and RPG data
            drawInteractiveLineGraph(stealthData, rpgData);
        } else {
            console.error('No stealth or RPG games found for 2024.');
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// 3. Count number of games released each month
function countGamesByMonth(games) {
    const monthlyCount = Array(12).fill(0); // Array to hold counts for each month

    games.forEach(game => {
        const releaseDate = new Date(game.released);
        const month = releaseDate.getMonth(); // Get month (0-11)
        
        // Increment the count for the corresponding month
        if (releaseDate.getFullYear() === 2024) {
            monthlyCount[month]++;
        }
    });

    return monthlyCount; // Return an array of counts for each month
}

// 4. Draw the line graph with interactivity and filtering options
function drawInteractiveLineGraph(stealthData, rpgData) {
    const svgWidth = 600, svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Create SVG container
    const svg = d3.select('.graph').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    // Define scales
    const xScale = d3.scaleBand()
        .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
        .range([margin.left, svgWidth - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, Math.max(d3.max(stealthData), d3.max(rpgData))]) // Adjust domain based on max data point
        .range([svgHeight - margin.bottom, margin.top]);

    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    // Add Y axis
    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    // Define the line generator for Stealth games
    const stealthLine = d3.line()
        .x((d, i) => xScale(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]) + xScale.bandwidth() / 2)
        .y(d => yScale(d));

    // Define the line generator for RPG games
    const rpgLine = d3.line()
        .x((d, i) => xScale(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]) + xScale.bandwidth() / 2)
        .y(d => yScale(d));

    // Append Stealth line
    svg.append('path')
        .datum(stealthData)
        .attr('class', 'stealth-line') // Add a class for filtering
        .attr('fill', 'none')
        .attr('stroke', '#ff0000') // Red for Stealth
        .attr('stroke-width', 2)
        .attr('d', stealthLine);

    // Append RPG line
    svg.append('path')
        .datum(rpgData)
        .attr('class', 'rpg-line') // Add a class for filtering
        .attr('fill', 'none')
        .attr('stroke', '#0000ff') // Blue for RPG
        .attr('stroke-width', 2)
        .attr('d', rpgLine);

    // Add points for Stealth line
    addPoints(svg, stealthData, xScale, yScale, '#ff0000', 'Stealth');

    // Add points for RPG line
    addPoints(svg, rpgData, xScale, yScale, '#0000ff', 'RPG');

    // Tooltip for hover effect (GLOBAL)
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('text-align', 'center')
        .style('padding', '6px')
        .style('font-size', '12px')
        .style('background', 'lightsteelblue')
        .style('border-radius', '8px')
        .style('pointer-events', 'none')
        .style('opacity', 0);

    // Filter buttons for toggling lines
    const filters = d3.select('.graph').append('div').attr('class', 'filter-buttons');
    filters.append('button').text('Show Stealth').on('click', () => toggleLine('.stealth-line'));
    filters.append('button').text('Show RPG').on('click', () => toggleLine('.rpg-line'));
    filters.append('button').text('Show Both').on('click', () => toggleLine('.stealth-line, .rpg-line'));
}

// Add interactive points to the graph
function addPoints(svg, data, xScale, yScale, color, label) {
    svg.selectAll(`.dot-${label}`)
        .data(data)
        .enter().append('circle')
        .attr('class', `dot-${label}`)
        .attr('cx', (d, i) => xScale(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]) + xScale.bandwidth() / 2)
        .attr('cy', d => yScale(d))
        .attr('r', 5)
        .attr('fill', color)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('r', 7)
                .attr('fill', d3.rgb(color).darker());

            d3.select('.tooltip').transition().duration(200).style('opacity', 1);
            d3.select('.tooltip').html(`${label} Games: ${d}`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('r', 5)
                .attr('fill', color);

            d3.select('.tooltip').transition().duration(200).style('opacity', 0);
        });
}

// Function to toggle the visibility of lines
function toggleLine(selector) {
    const lines = d3.selectAll(selector);
    lines.style('display', lines.style('display') === 'none' ? 'block' : 'none');
}

// Fetch the tags and then fetch the games based on those tags
document.addEventListener('DOMContentLoaded', fetchTags);