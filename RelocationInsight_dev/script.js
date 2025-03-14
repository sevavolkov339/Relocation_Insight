document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value;
    fetchAreaDetails(searchInput);
});

async function fetchAreaDetails(query) {
    const areaDetails = {
        name: '«Berlin Mitte»',
        description: 'A central area in Berlin with rich history and culture.',
        generalInfo: 'This area is known for its vibrant culture and historical landmarks.',
        transport: [
            { station: 'Bus Stop A', time: '3 minutes', logo: 'Bus_Icon.png' },
            { station: 'U-Bahn Station B', time: '7 minutes', logo: 'Subway_Icon.png' },
            { station: 'Tram Station C', time: '10 minutes', logo: 'Tram_Icon.png' }
        ],
        supermarkets: [
            { time: '5 minutes', logo: 'rewe.png' },
            { time: '3 minutes', logo: 'dm.png' },
            { time: '7 minutes', logo: 'edeka.png' }
        ],
        ecoFriendly: {
            description: '',
            parks: [
                { name: 'Tiergarten', distance: '1 km', time: '12 minutes' },
                { name: 'Monbijou Park', distance: '0.5 km', time: '6 minutes' }
            ],
            parking: 'Limited parking available'
        }
    };

    areaDetails.ecoFriendly.description = await generateEcoDescription(query);
    displayResults([areaDetails]);
}

async function generateEcoDescription(query) {
    const apiKey = '91998e90cc8d475d9fba5735108e7b3a';
    const apiUrl = 'https://api.aimlapi.com';
    const model = 'Meta-Llama-3.1-405B-Instruct-Turbo';

    const prompt = `Write a brief description of the eco-friendliness of the area located at ${query}. Focus on green spaces and sustainability initiatives.`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error('Unexpected API response structure');
        }
    } catch (error) {
        console.error('Error calling AIML API:', error);
        return 'Eco-friendliness information is currently unavailable.';
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
            <h2>${result.name}</h2>
            <p>${result.description}</p>

            <h3>General Info</h3>
            <p>${result.generalInfo}</p>

            <h3>Transport</h3>
            <ul>
                ${result.transport.map(t => `
                    <li>
                        <img src="ICONS/${t.logo}" alt="Transport Logo"> 
                        ${t.station} (${t.time})
                    </li>
                `).join('')}
            </ul>

            <h3>Close Supermarkets</h3>
            <ul>
                ${result.supermarkets.map(s => `
                    <li>
                        <img src="ICONS/${s.logo}" alt="Supermarket Logo"> 
                        ${s.time} by foot
                    </li>
                `).join('')}
            </ul>

            <h3><img src="ICONS/Eco_Icon.png" alt="Eco Icon"> Eco-Friendliness</h3>
            <p>${result.ecoFriendly.description}</p>

            <h3><img src="ICONS/Park_Icon.png" alt="Park Icon"> Nearby Parks</h3>
            <ul>
                ${result.ecoFriendly.parks.map(p => `
                    <li>${p.name}: ${p.distance} (${p.time} by walking)</li>
                `).join('')}
            </ul>
        `;
        resultsContainer.appendChild(resultElement);
    });
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.innerHTML = `
            <h2>${result.name}</h2>
            <p>${result.description}</p>

            <h3>General Info</h3>
            <p>${result.generalInfo}</p>

            <h3>Transport</h3>
            <ul>
                ${result.transport.map(t => `
                    <li>
                        <div class="transport-header">
                            <img src="ICONS/${t.logo}" alt="Transport Logo"> 
                            ${t.station} (${t.time})
                            <span class="arrow arrow-down">&#9660;</span> <!-- Down arrow by default -->
                        </div>
                        <div class="transport-details" style="display: none;"> <!-- Hidden by default -->
                            <p>Info about routes of ${t.station}.</p>
                        </div>
                    </li>
                `).join('')}
            </ul>

            <h3>Close Supermarkets</h3>
            <ul>
                ${result.supermarkets.map(s => `
                    <li>
                        <img src="ICONS/${s.logo}" alt="Supermarket Logo"> 
                        ${s.time} by foot
                    </li>
                `).join('')}
            </ul>

            <h3><img src="ICONS/Eco_Icon.png" alt="Eco Icon"> Eco-Friendliness</h3>
            <p>${result.ecoFriendly.description}</p>

            <h3><img src="ICONS/Park_Icon.png" alt="Park Icon"> Nearby Parks</h3>
            <ul>
                ${result.ecoFriendly.parks.map(p => `
                    <li>${p.name}: ${p.distance} (${p.time} by walking)</li>
                `).join('')}
            </ul>
        `;
        resultsContainer.appendChild(resultElement);
    });

    const transportHeaders = document.querySelectorAll('.transport-header');
    transportHeaders.forEach(header => {
        header.addEventListener('click', function () {
            // Toggle the visibility of the transport details
            const details = this.nextElementSibling;
            details.style.display = details.style.display === 'none' ? 'block' : 'none';

            // Toggle the arrow direction
            const arrow = this.querySelector('.arrow');
            arrow.classList.toggle('arrow-down');
            arrow.classList.toggle('arrow-up');
        });
    });
}