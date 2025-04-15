// Global variables
let pokemonData = [];
let phonologyData = [];
let currentFilters = {
    type: 'all',
    generation: 'all',
    stat: 'hp',
    limit: 20
};

// Load data when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load Pokémon stats data
        const statsResponse = await fetch('./pokemon_stats.csv');
        const statsText = await statsResponse.text();
        pokemonData = d3.csvParse(statsText);

        // Load phonology data
        const phonologyResponse = await fetch('./pokemon_phonology.csv');
        const phonologyText = await phonologyResponse.text();
        phonologyData = d3.csvParse(phonologyText);

        // Initialize the search functionality
        initializeSearch();
        
        // Display initial Pokémon (e.g., Bulbasaur)
        displayPokemon('bulbasaur');
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('pokemon-search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const matchingPokemon = pokemonData.find(pokemon => 
            pokemon.name_en.toLowerCase().includes(searchTerm)
        );
        
        if (matchingPokemon) {
            displayPokemon(matchingPokemon.name_en);
        }
    });
}

// Display Pokémon information
function displayPokemon(pokemonName) {
    const pokemon = pokemonData.find(p => p.name_en.toLowerCase() === pokemonName.toLowerCase());
    const phonology = phonologyData.find(p => p.name_en.toLowerCase() === pokemonName.toLowerCase());
    
    if (!pokemon) return;

    // Update sprite
    updateSprite(pokemon);

    // Update stats display
    updateStatsDisplay(pokemon);

    // Create visualizations
    createStatsChart(pokemon, currentFilters);
    createLinguisticChart(pokemon, phonology);
}

// Update Pokémon sprite
function updateSprite(pokemon) {
    const spriteContainer = document.getElementById('pokemon-sprite');
    
    // Clear previous content
    spriteContainer.innerHTML = '';
    
    // Create a loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = 'Loading...';
    spriteContainer.appendChild(loadingDiv);
    
    // Fetch sprite from Pokémon API
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name_en.toLowerCase()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            return response.json();
        })
        .then(data => {
            // Clear loading indicator
            spriteContainer.innerHTML = '';
            
            // Create and append the image
            const img = document.createElement('img');
            // Use animated sprite
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`;
            img.alt = pokemon.name_en;
            img.className = 'pokemon-sprite-img';
            
            // Add fallback for missing sprites
            img.onerror = function() {
                // Try another animated sprite source
                this.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`;
                this.onerror = function() {
                    // If animated sprite fails, fall back to static sprite
                    this.src = data.sprites.front_default;
                    this.onerror = function() {
                        // If all else fails, use the default sprite
                        this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
                        this.onerror = null; // Prevent infinite loop
                    };
                };
            };
            
            spriteContainer.appendChild(img);
        })
        .catch(error => {
            console.error('Error fetching sprite:', error);
            
            // Clear loading indicator
            spriteContainer.innerHTML = '';
            
            // Create a placeholder div for the sprite
            const placeholder = document.createElement('div');
            placeholder.className = 'sprite-placeholder';
            placeholder.innerHTML = `
                <div class="placeholder-text">${pokemon.name_en}</div>
                <div class="placeholder-id">#${pokemon.id}</div>
            `;
            
            spriteContainer.appendChild(placeholder);
        });
}

// Update stats display
function updateStatsDisplay(pokemon) {
    const statsContainer = document.getElementById('pokemon-stats');
    
    // Clear previous content
    statsContainer.innerHTML = '';
    
    // Create name display
    const nameDiv = document.createElement('div');
    nameDiv.className = 'pokemon-name';
    nameDiv.innerHTML = `
        <h2>${pokemon.name_en}</h2>
        <p class="japanese-name">${pokemon.name_ja}</p>
    `;
    statsContainer.appendChild(nameDiv);
    
    // Create info display
    const infoDiv = document.createElement('div');
    infoDiv.className = 'pokemon-info';
    infoDiv.innerHTML = `
        <p><strong>Generation:</strong> ${pokemon.generation}</p>
        <p><strong>Types:</strong> ${pokemon.types}</p>
        <p><strong>Status:</strong> ${getPokemonStatus(pokemon)}</p>
    `;
    statsContainer.appendChild(infoDiv);
    
    // Debug information
    console.log('Pokemon name:', pokemon.name_en);
    
    // Find maximum values for each stat
    const maxStats = {
        hp: Math.max(...pokemonData.map(p => +p.hp)),
        attack: Math.max(...pokemonData.map(p => +p.attack)),
        defense: Math.max(...pokemonData.map(p => +p.defense)),
        'special-attack': Math.max(...pokemonData.map(p => +p['special-attack'])),
        'special-defense': Math.max(...pokemonData.map(p => +p['special-defense'])),
        speed: Math.max(...pokemonData.map(p => +p.speed))
    };
    
    // Create stats display
    const statsDiv = document.createElement('div');
    statsDiv.className = 'pokemon-stats-grid';
    
    // Add each stat
    const stats = [
        { name: 'HP', value: +pokemon.hp, max: maxStats.hp },
        { name: 'Attack', value: +pokemon.attack, max: maxStats.attack },
        { name: 'Defense', value: +pokemon.defense, max: maxStats.defense },
        { name: 'Sp. Attack', value: +pokemon['special-attack'], max: maxStats['special-attack'] },
        { name: 'Sp. Defense', value: +pokemon['special-defense'], max: maxStats['special-defense'] },
        { name: 'Speed', value: +pokemon.speed, max: maxStats.speed }
    ];
    
    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <span class="stat-name">${stat.name}</span>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${(stat.value / stat.max) * 100}%"></div>
            </div>
            <span class="stat-value">${stat.value}</span>
        `;
        statsDiv.appendChild(statItem);
    });
    
    statsContainer.appendChild(statsDiv);
}

// Helper function to get Pokémon status (Regular, Legendary, or Mythical)
function getPokemonStatus(pokemon) {
    if (pokemon.is_mythical === 'True') {
        return 'Mythical';
    } else if (pokemon.is_legendary === 'True') {
        return 'Legendary';
    } else {
        return 'Regular';
    }
}

// Create stats visualization
function createStatsChart(pokemon, filters = null) {
    const chartContainer = document.getElementById('stats-chart');
    
    // Clear previous content
    chartContainer.innerHTML = '';
    
    // Create controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'chart-controls';
    chartContainer.appendChild(controlsContainer);
    
    // Create SVG container
    const width = chartContainer.clientWidth;
    const height = 400; // Increased height for better visibility
    const margin = { top: 20, right: 20, bottom: 60, left: 60 }; // Increased bottom margin for Pokémon names
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(chartContainer)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Get unique types and generations for filters
    const allTypes = new Set();
    pokemonData.forEach(p => {
        const types = p.types.split(',');
        types.forEach(type => allTypes.add(type.trim()));
    });
    
    const allGenerations = new Set();
    pokemonData.forEach(p => {
        allGenerations.add(p.generation);
    });
    
    // Create filter controls
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    
    // Type filter
    const typeFilter = document.createElement('select');
    typeFilter.id = 'type-filter';
    typeFilter.innerHTML = '<option value="all">All Types</option>';
    Array.from(allTypes).sort().forEach(type => {
        typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
    });
    
    // Generation filter
    const genFilter = document.createElement('select');
    genFilter.id = 'generation-filter';
    genFilter.innerHTML = '<option value="all">All Generations</option>';
    Array.from(allGenerations).sort().forEach(gen => {
        genFilter.innerHTML += `<option value="${gen}">${gen}</option>`;
    });
    
    // Stat filter
    const statFilter = document.createElement('select');
    statFilter.id = 'stat-filter';
    statFilter.innerHTML = `
        <option value="hp">HP</option>
        <option value="attack">Attack</option>
        <option value="defense">Defense</option>
        <option value="special-attack">Sp. Attack</option>
        <option value="special-defense">Sp. Defense</option>
        <option value="speed">Speed</option>
        <option value="base_stat_total">Total Stats</option>
    `;
    
    // Add labels and filters to the container
    const typeLabel = document.createElement('label');
    typeLabel.htmlFor = 'type-filter';
    typeLabel.textContent = 'Type: ';
    
    const genLabel = document.createElement('label');
    genLabel.htmlFor = 'generation-filter';
    genLabel.textContent = 'Generation: ';
    
    const statLabel = document.createElement('label');
    statLabel.htmlFor = 'stat-filter';
    statLabel.textContent = 'Stat: ';
    
    filterContainer.appendChild(typeLabel);
    filterContainer.appendChild(typeFilter);
    filterContainer.appendChild(document.createTextNode(' '));
    filterContainer.appendChild(genLabel);
    filterContainer.appendChild(genFilter);
    filterContainer.appendChild(document.createTextNode(' '));
    filterContainer.appendChild(statLabel);
    filterContainer.appendChild(statFilter);
    
    controlsContainer.appendChild(filterContainer);
    
    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    
    // Create slider label
    const sliderLabel = document.createElement('label');
    sliderLabel.htmlFor = 'pokemon-limit';
    sliderLabel.textContent = 'Number of Pokémon: ';
    
    // Create slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'pokemon-limit';
    slider.min = '5';
    slider.max = '50';
    slider.step = '5';
    slider.value = filters ? filters.limit : 20;
    
    // Create slider value display
    const sliderValue = document.createElement('span');
    sliderValue.id = 'pokemon-limit-value';
    sliderValue.textContent = slider.value;
    
    // Add event listener to update the value display
    slider.addEventListener('input', function() {
        sliderValue.textContent = this.value;
    });
    
    // Add elements to slider container
    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(sliderValue);
    
    // Add slider container to controls container
    controlsContainer.appendChild(sliderContainer);
    
    // Set initial filter values if provided
    if (filters) {
        typeFilter.value = filters.type;
        genFilter.value = filters.generation;
        statFilter.value = filters.stat;
    } else {
        // Update current filters with default values
        currentFilters.type = typeFilter.value;
        currentFilters.generation = genFilter.value;
        currentFilters.stat = statFilter.value;
    }
    
    // Function to update the chart based on filters
    function updateChart() {
        const selectedType = typeFilter.value;
        const selectedGen = genFilter.value;
        const selectedStat = statFilter.value;
        const pokemonLimit = parseInt(slider.value);
        
        // Update current filters
        currentFilters.type = selectedType;
        currentFilters.generation = selectedGen;
        currentFilters.stat = selectedStat;
        currentFilters.limit = pokemonLimit;
        
        // Filter data based on selections
        let filteredData = pokemonData;
        
        if (selectedType !== 'all') {
            filteredData = filteredData.filter(p => p.types.includes(selectedType));
        }
        
        if (selectedGen !== 'all') {
            filteredData = filteredData.filter(p => p.generation === selectedGen);
        }
        
        // Sort by the selected stat in descending order
        filteredData.sort((a, b) => +b[selectedStat] - +a[selectedStat]);
        
        // Limit to selected number of Pokémon
        if (filteredData.length > pokemonLimit) {
            filteredData = filteredData.slice(0, pokemonLimit);
        }
        
        // Get the selected stat values
        const statValues = filteredData.map(p => ({
            name: p.name_en,
            value: +p[selectedStat],
            isSelected: p.name_en === pokemon.name_en,
            isLegendary: p.is_legendary === 'True',
            isMythical: p.is_mythical === 'True',
            id: p.id
        }));
        
        // Find min and max values for scales
        const yExtent = [0, d3.max(statValues, d => d.value) * 1.1]; // Add 10% padding
        
        // Create scales
        const xScale = d3.scaleBand()
            .domain(statValues.map(d => d.name))
            .range([0, innerWidth])
            .padding(0.2);
        
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([innerHeight, 0])
            .nice();
        
        // Clear previous chart
        g.selectAll('*').remove();
        
        // Add X axis (Pokémon names)
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em');
        
        // Add Y axis (Stat values)
        g.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -45)
            .attr('x', -innerHeight / 2)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .text(selectedStat === 'base_stat_total' ? 'Total Stats' : selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1).replace('-', ' '));
        
        // Add title
        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .text(`${selectedType === 'all' ? 'All Types' : selectedType} Pokémon - ${selectedGen === 'all' ? 'All Generations' : selectedGen}`);
        
        // Add bars
        const bars = g.selectAll('rect')
            .data(statValues)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.name))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(d.value))
            .attr('fill', d => {
                if (d.isSelected) return 'red';
                if (d.isMythical) return 'gold';
                if (d.isLegendary) return 'purple';
                return '#3d7dca';
            })
            .attr('opacity', d => d.isSelected ? 1 : 0.7)
            .style('cursor', 'pointer');
        
        // Add Pokémon sprites above the bars
        const spriteContainer = g.append('g')
            .attr('class', 'sprite-container');
        
        // Create sprite placeholders
        const sprites = spriteContainer.selectAll('g')
            .data(statValues)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${xScale(d.name) + xScale.bandwidth() / 2}, ${yScale(d.value) - 30})`);
        
        // Add sprite images
        sprites.append('image')
            .attr('xlink:href', d => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`)
            .attr('width', 30)
            .attr('height', 30)
            .attr('x', -15)
            .attr('y', -15)
            .on('error', function() {
                // Fallback if sprite not found
                d3.select(this)
                    .attr('xlink:href', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png');
            });
        
        // Add tooltips
        bars.append('title')
            .text(d => `${d.name}: ${d.value}`);
        
        // Add hover effect and tooltip
        const tooltip = d3.select(chartContainer)
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'white')
            .style('border', '1px solid #ddd')
            .style('border-radius', '5px')
            .style('padding', '10px')
            .style('box-shadow', '0 2px 5px rgba(0,0,0,0.1)')
            .style('pointer-events', 'none')
            .style('z-index', '1000');
        
        // Add hover effects to both bars and sprites
        const addHoverEffects = (selection) => {
            selection
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .attr('opacity', 1);
                    
                    // Also highlight the corresponding bar/sprite
                    if (this.tagName === 'rect') {
                        spriteContainer.selectAll('g')
                            .filter(s => s.name === d.name)
                            .select('image')
                            .attr('width', 35)
                            .attr('height', 35)
                            .attr('x', -17.5)
                            .attr('y', -17.5);
                    } else {
                        bars.filter(s => s.name === d.name)
                            .attr('opacity', 1);
                    }
                    
                    tooltip
                        .style('visibility', 'visible')
                        .html(`
                            <strong>${d.name}</strong><br>
                            ${selectedStat === 'base_stat_total' ? 'Total Stats' : selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1).replace('-', ' ')}: ${d.value}${d.isLegendary ? '<br><em>Legendary</em>' : ''}
                        `)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mousemove', function(event) {
                    tooltip
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
                })
                .on('mouseout', function(event, d) {
                    if (!d.isSelected) {
                        d3.select(this)
                            .attr('opacity', 0.7);
                        
                        // Reset sprite size
                        spriteContainer.selectAll('g')
                            .filter(s => s.name === d.name)
                            .select('image')
                            .attr('width', 30)
                            .attr('height', 30)
                            .attr('x', -15)
                            .attr('y', -15);
                    }
                    
                    tooltip.style('visibility', 'hidden');
                })
                .on('click', function(event, d) {
                    // Select the Pokémon
                    displayPokemon(d.name);
                });
        };
        
        // Apply hover effects to bars and sprites
        addHoverEffects(bars);
        addHoverEffects(sprites.select('image'));
        
        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 150}, 20)`);
        
        // Regular Pokémon
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', '#3d7dca');
        
        legend.append('text')
            .attr('x', 25)
            .attr('y', 12)
            .text('Regular')
            .attr('font-size', '12px');
        
        // Legendary Pokémon
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 25)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'purple');
        
        legend.append('text')
            .attr('x', 25)
            .attr('y', 37)
            .text('Legendary')
            .attr('font-size', '12px');
        
        // Mythical Pokémon
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 50)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'gold');
        
        legend.append('text')
            .attr('x', 25)
            .attr('y', 62)
            .text('Mythical')
            .attr('font-size', '12px');
        
        // Selected Pokémon
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 75)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'red');
        
        legend.append('text')
            .attr('x', 25)
            .attr('y', 87)
            .text('Selected')
            .attr('font-size', '12px');
    }
    
    // Add event listeners to filters
    typeFilter.addEventListener('change', updateChart);
    genFilter.addEventListener('change', updateChart);
    statFilter.addEventListener('change', updateChart);
    slider.addEventListener('input', updateChart);
    
    // Initial chart update
    updateChart();
}

// Create linguistic visualization
function createLinguisticChart(pokemon, phonology) {
    const chartContainer = document.getElementById('linguistic-chart');
    
    // Clear previous content
    chartContainer.innerHTML = '';
    
    // Create SVG container
    const width = chartContainer.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(chartContainer)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Find min and max values for scales
    const xExtent = d3.extent(pokemonData, d => +d.base_stat_total);
    const yExtent = d3.extent(phonologyData, d => +d.total_score);
    
    // Create scales
    const xScale = d3.scaleLinear()
        .domain(xExtent)
        .range([0, innerWidth])
        .nice();
    
    const yScale = d3.scaleLinear()
        .domain(yExtent)
        .range([innerHeight, 0])
        .nice();
    
    // Add X axis
    g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 35)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text('Stat Total');
    
    // Add Y axis
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -45)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text('Phonology Score');
    
    // Add title
    g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text('Stat Total vs. Phonology Score');
    
    // Create a merged dataset for plotting
    const plotData = pokemonData.map(p => {
        const ph = phonologyData.find(ph => ph.name_en === p.name_en);
        const isLegendary = p.is_legendary === 'True';
        const isMythical = p.is_mythical === 'True';
        return {
            name: p.name_en,
            stats: +p.base_stat_total,
            score: ph ? +ph.total_score : 0,
            isSelected: p.name_en === pokemon.name_en,
            isLegendary: isLegendary,
            isMythical: isMythical
        };
    });
    
    // Create tooltip div
    const tooltip = d3.select(chartContainer)
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', '1px solid #ddd')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('box-shadow', '0 2px 5px rgba(0,0,0,0.1)')
        .style('pointer-events', 'none')
        .style('z-index', '1000');
    
    // Add dots
    const circles = g.selectAll('circle')
        .data(plotData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.stats))
        .attr('cy', d => yScale(d.score))
        .attr('r', d => d.isSelected ? 8 : 5)
        .attr('fill', d => {
            if (d.isSelected) return 'red';
            if (d.isMythical) return 'gold';
            if (d.isLegendary) return 'purple';
            return '#3d7dca';
        })
        .attr('opacity', d => d.isSelected ? 1 : 0.7)
        .style('cursor', 'pointer');
    
    // Add tooltips
    circles.append('title')
        .text(d => `${d.name}: Stats=${d.stats}, Score=${d.score}${d.isLegendary ? ' (Legendary)' : ''}`);
    
    // Add hover effect and tooltip
    circles
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('r', 8)
                .attr('opacity', 1);
            
            tooltip
                .style('visibility', 'visible')
                .html(`
                    <strong>${d.name}</strong><br>
                    Stats: ${d.stats}<br>
                    Phonology Score: ${d.score}${d.isLegendary ? '<br><em>Legendary</em>' : ''}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mousemove', function(event) {
            tooltip
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(event, d) {
            if (!d.isSelected) {
                d3.select(this)
                    .attr('r', 5)
                    .attr('opacity', 0.7);
            }
            
            tooltip.style('visibility', 'hidden');
        })
        .on('click', function(event, d) {
            // Select the Pokémon
            displayPokemon(d.name);
        });
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 150}, 20)`);
    
    // Regular Pokémon
    legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
        .attr('fill', '#3d7dca');
    
    legend.append('text')
        .attr('x', 10)
        .attr('y', 5)
        .text('Regular')
        .attr('font-size', '12px');
    
    // Legendary Pokémon
    legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 25)
        .attr('r', 5)
        .attr('fill', 'purple');
    
    legend.append('text')
        .attr('x', 10)
        .attr('y', 30)
        .text('Legendary')
        .attr('font-size', '12px');
    
    // Mythical Pokémon
    legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 50)
        .attr('r', 5)
        .attr('fill', 'gold');
    
    legend.append('text')
        .attr('x', 10)
        .attr('y', 55)
        .text('Mythical')
        .attr('font-size', '12px');
    
    // Selected Pokémon
    legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 75)
        .attr('r', 5)
        .attr('fill', 'red');
    
    legend.append('text')
        .attr('x', 10)
        .attr('y', 80)
        .text('Selected')
        .attr('font-size', '12px');
} 