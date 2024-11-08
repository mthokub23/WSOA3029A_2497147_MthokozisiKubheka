//API Exploitation
const apiKey = 'ce147b997cec44d7a97bf0d4a154f35c';


// Games list to search for
const gamesList = [
    "Elden Ring: Shadow of the Erdtree", "Astro Bot", "Final Fantasy VII Rebirth",
    "UFO 50", "Animal Well", "Satisfactory", "Balatro",
    "The Last of Us Part II Remastered", "Thank Goodness You're Here!",
    "Tekken 8", "Destiny 2: The Final Shape", "Tsukihime: A Piece of Blue Glass Moon",
    "Horizon Forbidden West: Complete Edition", "Like a Dragon: Infinite Wealth", "Castlevania Dominus Collection"
];

let sortAscending = true; // Track the sort order for each column


function showLoading() {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('gamesTable').style.display = 'none';
}

// Hide the loading message and show the data table
function hideLoading() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('gamesTable').style.display = 'block';
}


// Initial Game Data Fetching and Display with Loading Indicator
async function fetchGames() {
    try {
        showLoading(); // Show loading message when fetching starts
        const gamesData = [];
        
        for (const gameName of gamesList) {
            const searchUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(gameName)}`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                gamesData.push(data.results[0]); // Collect the top result for each game
            } else {
                console.log(`Game not found: ${gameName}`);
            }
        }

        if (gamesData.length > 0) {
            displayGames(gamesData);
            window.currentGames = gamesData; // Store globally for filtering and sorting
        } else {
            console.error("No games were found to display.");
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    } finally {
        hideLoading(); // Hide loading message once fetching is complete
    }
}

// Display Games in a Table
function displayGames(games) {
    d3.select('#gamesTable').html(""); // Clear existing content

    const headers = ['Game Name', 'Release Date', 'Platforms', 'Metacritic', 'Genres'];
    const table = d3.select('#gamesTable')
                    .append('table')
                    .attr('id', 'gameDataTable')
                    .style('width', '80%')
                    .style('margin', '20px auto')
                    .style('border-collapse', 'collapse');

    // Table Headers with Tooltips and Sorting
    const thead = table.append('thead');
    const headerRow = thead.append('tr');
    headerRow.selectAll('th')
        .data(headers)
        .enter()
        .append('th')
        .text(d => d)
        .style('padding', '10px')
        .style('border-bottom', '1px solid #ddd')
        .style('cursor', 'pointer')
        .on('click', function() {
            const column = d3.select(this).text().toLowerCase().replace(/\s+/g, '');
            sortTable(column);
        })
        .append("title").text(d => `Sort by ${d}`); // Add tooltips for sorting instructions

    // Populate Table Rows with Data and Tooltips
    const tbody = table.append('tbody');
    const rows = tbody.selectAll('tr')
        .data(games)
        .enter()
        .append('tr')
        .style('border-bottom', '1px solid #ddd')
        .on('mouseover', function() { d3.select(this).style('background-color', '#f5f5f5'); })
        .on('mouseout', function() { d3.select(this).style('background-color', 'white'); });

    // Game Name (Clickable for more details)
    rows.append('td')
        .text(d => d.name || 'Unknown')
        .style('padding', '10px')
        .style('color', '#0073e6')
        .style('cursor', 'pointer')
        .on('click', (event, d) => showGameDetails(d.id))
        .append("title").text(d => "Click to view screenshots and details");

    // Release Date with Hover Info
    rows.append('td')
        .text(d => d.released ? new Date(d.released).toLocaleDateString() : 'N/A')
        .style('padding', '10px')
        .append("title").text(d => `Released on ${d.released ? new Date(d.released).toDateString() : 'Unknown'}`);

    // Platforms with Tooltip
    rows.append('td')
        .text(d => d.platforms ? d.platforms.map(p => p.platform.name).join(', ') : 'N/A')
        .style('padding', '10px')
        .append("title").text(d => `Available on: ${d.platforms ? d.platforms.map(p => p.platform.name).join(', ') : 'N/A'}`);

    // Metacritic Score with Tooltip
    rows.append('td')
        .text(d => d.metacritic !== undefined ? d.metacritic : 'N/A')
        .style('padding', '10px')
        .append("title").text(d => `Metacritic score: ${d.metacritic !== undefined ? d.metacritic : 'N/A'}`);

    // Genres with Tooltip
    rows.append('td')
        .text(d => d.genres ? d.genres.map(g => g.name).join(', ') : 'N/A')
        .style('padding', '10px')
        .append("title").text(d => `Genres: ${d.genres ? d.genres.map(g => g.name).join(', ') : 'N/A'}`);
}

// Sorting Functionality
function sortTable(column) {
    if (!window.currentGames) {
        console.error("No games available to sort.");
        return;
    }

    const sortedData = [...window.currentGames].sort((a, b) => {
        let valA, valB;

        // Handle sorting by each specific column type
        if (column === 'releasedate') {
            valA = new Date(a.released || "1900-01-01");
            valB = new Date(b.released || "1900-01-01");
        } else if (column === 'gamename') {
            valA = a.name || '';
            valB = b.name || '';
        } else if (column === 'metacritic') {
            valA = a.metacritic ?? -1;
            valB = b.metacritic ?? -1;
        } else if (column === 'platforms') {
            valA = a.platforms ? a.platforms.map(p => p.platform.name).join(', ') : '';
            valB = b.platforms ? b.platforms.map(p => p.platform.name).join(', ') : '';
        } else if (column === 'genres') {
            valA = a.genres ? a.genres.map(g => g.name).join(', ') : '';
            valB = b.genres ? b.genres.map(g => g.name).join(', ') : '';
        }

        // Perform comparison and handle undefined/null values safely
        if (valA < valB) return sortAscending ? -1 : 1;
        if (valA > valB) return sortAscending ? 1 : -1;
        return 0;
    });

    sortAscending = !sortAscending;
    displayGames(sortedData);
}

// Show Game Details and Screenshot
async function showGameDetails(gameId) {
    try {
        const screenshotUrl = `https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}&page_size=1`;
        const response = await fetch(screenshotUrl);
        const data = await response.json();
        const screenshotImage = document.getElementById('screenshotImage');
        
        if (data.results && data.results.length > 0) {
            screenshotImage.src = data.results[0].image;
            screenshotImage.title = "Screenshot of selected game";
            screenshotImage.style.display = 'block';
        } else {
            showDefaultImage();
        }
    } catch (error) {
        console.error("Error fetching screenshot:", error);
        showDefaultImage();
    }
}

function showDefaultImage() {
    const screenshotImage = document.getElementById('screenshotImage');
    screenshotImage.src = 'assets/images/default-image.jpg';
    screenshotImage.title = "No screenshot available";
    screenshotImage.style.display = 'block';
}

// Initial data fetch on load
document.addEventListener('DOMContentLoaded', fetchGames);


// Graph for Stealth vs RPG
const year2024 = '2024';

// 1. Fetch the list of tags and find the ID for the "stealth" and "RPG" tags
async function fetchTags(startDate = `${year2024}-01-01`, endDate = `${year2024}-12-31`) {
    try {
        const tagUrl = `https://api.rawg.io/api/tags?key=${apiKey}&page_size=100`;
        const response = await fetch(tagUrl);
        const data = await response.json();

        // Search for "stealth" and "RPG" tags
        const stealthTag = data.results.find(tag => tag.name.toLowerCase() === 'stealth');
        const rpgTag = data.results.find(tag => tag.name.toLowerCase() === 'rpg'); // Correct search for "RPG"
        
        if (stealthTag && rpgTag) {
            console.log(`Tags found: Stealth ID ${stealthTag.id}, RPG ID ${rpgTag.id}`);
            fetchGamesByTags(stealthTag.id, rpgTag.id, startDate, endDate);
        } else {
            console.error('Stealth or RPG tag not found.');
        }
    } catch (error) {
        console.error('Error fetching tags:', error);
    }
}

// 2. Fetch games with the "stealth" and "RPG" tags released in the specified date range
async function fetchGamesByTags(stealthTagId, rpgTagId, startDate, endDate) {
    try {
        const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${startDate},${endDate}&tags=${stealthTagId},${rpgTagId}&page_size=100`;
        const response = await fetch(gamesUrl);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Filter games by "stealth" and "RPG" tags separately
            const stealthGames = data.results.filter(game => game.tags.some(tag => tag.id === stealthTagId));
            const rpgGames = data.results.filter(game => game.tags.some(tag => tag.id === rpgTagId));

            const stealthData = countGamesByMonth(stealthGames, startDate, endDate);
            const rpgData = countGamesByMonth(rpgGames, startDate, endDate);

            // Draw the graph with both stealth and RPG data
            drawInteractiveLineGraph(stealthData, rpgData, startDate, endDate);
        } else {
            console.error('No stealth or RPG games found for the selected date range.');
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// 3. Count number of games released each month within the specified date range
function countGamesByMonth(games, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthlyCount = Array(12).fill(0); // Array to hold counts for each month

    games.forEach(game => {
        const releaseDate = new Date(game.released);
        if (releaseDate >= start && releaseDate <= end) {
            const month = releaseDate.getMonth(); // Get month (0-11)
            monthlyCount[month]++;
        }
    });

    return monthlyCount; // Return an array of counts for each month
}

// 4. Draw the line graph with interactivity and filtering options
function drawInteractiveLineGraph(stealthData, rpgData, startDate, endDate) {
    const svgWidth = 600, svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Clear any existing SVG
    d3.select('.graph').selectAll('*').remove();

    // Create SVG container
    const svg = d3.select('.graph').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    // Define scales
    const xScale = d3.scaleBand()
        .domain(getMonthsInRange(startDate, endDate))
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
        .x((d, i) => xScale(getMonthsInRange(startDate, endDate)[i]) + xScale.bandwidth() / 2)
        .y(d => yScale(d));

    // Define the line generator for RPG games
    const rpgLine = d3.line()
        .x((d, i) => xScale(getMonthsInRange(startDate, endDate)[i]) + xScale.bandwidth() / 2)
        .y(d => yScale(d));

    // Append Stealth line
    svg.append('path')
        .datum(stealthData)
        .attr('class', 'stealth-line') // Add a class for filtering
        .attr('fill', 'none')
        .attr('stroke', '#ffcc00') // Bright yellow for Stealth to match the site's color palette
        .attr('stroke-width', 2)
        .attr('d', stealthLine);

    // Append RPG line
    svg.append('path')
        .datum(rpgData)
        .attr('class', 'rpg-line') // Add a class for filtering
        .attr('fill', 'none')
        .attr('stroke', '#2e2e2e') // Medium grey for RPG to match the site's color palette
        .attr('stroke-width', 2)
        .attr('d', rpgLine);

    // Add points for Stealth line
    addPoints(svg, stealthData, xScale, yScale, '#ffcc00', 'Stealth', startDate, endDate);

    // Add points for RPG line
    addPoints(svg, rpgData, xScale, yScale, '#2e2e2e', 'RPG', startDate, endDate);

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
    filters.append('button').text('Hide Stealth').on('click', () => toggleLine('.stealth-line, .dot-Stealth'));
    filters.append('button').text('Hide RPG').on('click', () => toggleLine('.rpg-line, .dot-RPG'));
    filters.append('button').text('Show Both').on('click', () => {
        d3.selectAll('.stealth-line, .dot-Stealth').style('display', 'block');
        d3.selectAll('.rpg-line, .dot-RPG').style('display', 'block');
    });
}

// Add interactive points to the graph
function addPoints(svg, data, xScale, yScale, color, label, startDate, endDate) {
    svg.selectAll(`.dot-${label}`)
        .data(data)
        .enter().append('circle')
        .attr('class', `dot-${label}`)
        .attr('cx', (d, i) => xScale(getMonthsInRange(startDate, endDate)[i]) + xScale.bandwidth() / 2)
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

// Function to toggle the visibility of lines and dots
function toggleLine(selector) {
    const elements = d3.selectAll(selector);
    elements.style('display', elements.style('display') === 'none' ? 'block' : 'none');
}

// Helper function to get months in the selected date range
function getMonthsInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let date = new Date(start); date <= end; date.setMonth(date.getMonth() + 1)) {
        months.push(monthNames[date.getMonth()]);
    }

    return months;
}

// Fetch the tags and then fetch the games based on those tags
document.addEventListener('DOMContentLoaded', () => {
    fetchTags();

    // Add event listener to the filter button
    document.getElementById('filterButton').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        if (startDate && endDate) {
            fetchTags(startDate, endDate);
        } else {
            alert('Please select both start and end dates.');
        }
    });

    // Add event listener to the reset button
    document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        fetchTags(); // Reset to default date range
    });
});


//Bubble Chart Functions
document.addEventListener('DOMContentLoaded', async () => {
    const genres = ['Stealth', 'RPG', 'Shooter']; // Updated to include Shooter
    const startYear = 2019;
    const endYear = 2024;

    try {
        const genreData = await fetchGenreData(apiKey, genres, startYear, endYear);
        drawBubbleChart(genreData);
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
});

// Fetch genre data with popularity and release information
async function fetchGenreData(apiKey, genres, startYear, endYear) {
    const genrePromises = genres.map(async (genre) => {
        // Fetch genre tag information
        const tagUrl = `https://api.rawg.io/api/tags?key=${apiKey}&search=${encodeURIComponent(genre)}`;
        const tagResponse = await fetch(tagUrl);
        const tagData = await tagResponse.json();
        const genreTag = tagData.results.find(tag => tag.name.toLowerCase() === genre.toLowerCase());

        if (!genreTag) {
            console.warn(`Genre ${genre} not found`);
            return null;
        }

        // Fetch games by genre and filter by year
        const gamesUrl = `https://api.rawg.io/api/games?key=${apiKey}&tags=${genreTag.id}&dates=${startYear}-01-01,${endYear}-12-31&page_size=100`;
        const gamesResponse = await fetch(gamesUrl);
        const gamesData = await gamesResponse.json();
        
        return gamesData.results.map(game => ({
            id: game.id, // Capture the game ID for further details
            name: game.name,
            genre: genre,
            releaseYear: new Date(game.released).getFullYear(),
            popularity: game.metacritic || 50, // Use Metacritic as popularity; default to 50 if missing
        }));
    });

    // Process each genre's games into a combined array
    const genreData = (await Promise.all(genrePromises)).flat().filter(Boolean);
    return genreData;
}

// Draw the D3 Bubble Chart with genre data
function drawBubbleChart(data) {
    const width = 800, height = 600;
    const svg = d3.select("#bubbleChart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#2e2e2e");

    // Color scale for genres
    const colorScale = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.genre))])  // Unique genres
        .range(["#ffcc00", "#ff6666", "#66b2ff", "#99ff66"]);

    // Scale bubbles based on popularity
    const radiusScale = d3.scaleSqrt()
        .domain([d3.min(data, d => d.popularity), d3.max(data, d => d.popularity)])
        .range([10, 50]);

    // Tooltip for game details
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "#444")
        .style("border-radius", "8px")
        .style("color", "white")
        .style("opacity", 0);

    // Bind data and draw bubbles
    const bubbles = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => Math.random() * width)
        .attr("cy", d => Math.random() * height)
        .attr("r", d => radiusScale(d.popularity))
        .style("fill", d => colorScale(d.genre))
        .style("opacity", 0.8)
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`<strong>${d.name}</strong><br/>Genre: ${d.genre}<br/>Rating: ${d.popularity}<br/>Year: ${d.releaseYear}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");

            // Enlarge the hovered bubble
            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .attr("r", radiusScale(d.popularity) * 1.5); // Increase size by 50%
        })
        .on("mouseout", (event, d) => {
            tooltip.transition().duration(500).style("opacity", 0);
            // Reset size of the bubble on mouseout
            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .attr("r", radiusScale(d.popularity)); // Reset to original size
        });

    // Click event to open modal with detailed game info
    bubbles.on("click", async (event, d) => {
        const gameDetails = await fetchGameDetails(d.id);
        showModal(gameDetails);
    });

    // Add legend for genres
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(20,${20 + i * 30})`);

    legend.append("rect")
        .attr("x", width - 150)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", width - 120)
        .attr("y", 15)
        .style("fill", "#ffffff")
        .text(d => d);

    // Force simulation for bubble placement
    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("collision", d3.forceCollide(d => radiusScale(d.popularity)))
        .on("tick", () => {
            bubbles.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

    // Dropdown for filtering genres
    d3.select("#bubbleChart").insert("select", "svg")
        .attr("id", "genreFilter")
        .selectAll("option")
        .data(["All", ...colorScale.domain()])
        .enter().append("option")
        .text(d => d)
        .on("change", function() {
            const selectedGenre = this.value;
            bubbles.transition().duration(500)
                .style("opacity", d => (selectedGenre === "All" || d.genre === selectedGenre) ? 0.8 : 0);
        });
}

// Fetch additional game details including developer and tags
async function fetchGameDetails(gameId) {
    try {
        const gameUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
        const gameResponse = await fetch(gameUrl);
        const gameData = await gameResponse.json();

        // Extract relevant data
        const gameInfo = {
            name: gameData.name,
            genre: gameData.genres.map(genre => genre.name).join(', '), // Join genres as a string
            tags: gameData.tags.map(tag => tag.name).join(', '), // Join tags as a string
            developer: gameData.developers.map(dev => dev.name).join(', ') // Join developers as a string
        };

        return gameInfo;
    } catch (error) {
        console.error(`Error fetching details for game ID ${gameId}:`, error);
        return null;
    }
}

// Show modal with detailed game information
function showModal(gameDetails) {
    const modal = d3.select("#modal");
    if (!gameDetails) {
        modal.select(".modal-content").html("<p>Error loading game details.</p>");
    } else {
        modal.select(".modal-content").html(`
            <h2>${gameDetails.name}</h2>
            <p><strong>Genre:</strong> ${gameDetails.genre}</p>
            <p><strong>Tags:</strong> ${gameDetails.tags}</p>
            <p><strong>Developer:</strong> ${gameDetails.developer}</p>
        `);
    }
    modal.style("display", "block");
}

// Close modal on click
d3.select("#modal").on("click", () => {
    d3.select("#modal").style("display", "none");
});




