// Import functions from other modules
import { calculateSuitabilityScore } from './suitabilityScore.js';
import { readCarData } from './dataAccess.js';

// Get DOM elements
const form = document.getElementById('parameters-form');
const resultsDiv = document.getElementById('results'); 

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get user input
    const userParams = {
        hasHomeCharger: form.hasHomeCharger.checked,  
        avgDailyDistance: parseInt(form.avgDailyDistance.value),
        region: form.region.value
    };
    
    try {
        // Load car data
        const cars = await readCarData();
        console.log(`Loaded ${cars.length} cars from data source`);

        // Clear previous results  
        resultsDiv.innerHTML = '';

        let processedCars = 0;
        let displayedCars = 0;

        // Calculate suitability score for each car and store in an array
        const scoredCars = cars.map(car => {
            processedCars++;
            const score = calculateSuitabilityScore(car, userParams);
            console.log(`${car.make} ${car.model} - Suitability Score: ${score}%`); 
            return { ...car, score };
        });

        // Sort cars by suitability score in descending order
        scoredCars.sort((a, b) => b.score - a.score);

        // Filter cars with a suitability score above 80% and limit to top 10
        const topCars = scoredCars.filter(car => car.score >= 80).slice(0, 10);

        // Display filtered and sorted cars
        topCars.forEach(car => {
            // Create a card for the car
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <h2>${car.make} ${car.model}</h2>
                <p>Range: ${car.range} km</p>
                <p>0-100 kph: ${car.zeroToSixty} sec</p>
                <p>Suitability Score: <span class="score">${car.score.toFixed(1)}%</span></p>
            `;

            resultsDiv.appendChild(carCard);
            displayedCars++;
        });

        console.log(`Processed ${processedCars} cars`);
        console.log(`Displayed ${displayedCars} car cards`);

        if (displayedCars === 0) {
            resultsDiv.innerHTML = '<p>No suitable cars found based on your criteria. Try adjusting your parameters.</p>';
        }

    } catch (error) {
        console.error('Error loading car data:', error);
        resultsDiv.innerHTML = '<p>Error loading car data. Please try again later.</p>';
    }
});