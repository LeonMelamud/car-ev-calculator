// Import functions from other modules
// i18next and LanguageDetector are globally available via CDN
import { calculateSuitabilityScore } from './suitabilityScore.js';
import { readCarData } from './dataAccess.js';

// Initialize i18next
i18next
  
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          welcome: "Welcome to the Car EV Calculator!",
          description: "This application helps you determine the best electric vehicle for your needs.",
          navNews: "News",
          navElectric: "Electric",
          searchPlaceholder: "Search",
          homeChargerLabel: "Do you have a home charger?",
          dailyDistanceLabel: "Average Daily Driving Distance (km):",
          regionLabel: "Your Region:",
          findMyCarButton: "Find My Car",
          noSuitableCars: "No suitable cars found based on your criteria. Try adjusting your parameters.",
          errorLoadingData: "Error loading car data. Please try again later.",
          range: "Range: {{range}} km",
          acceleration: "0-100 kph: {{acceleration}} sec",
          suitabilityScore: "Suitability Score: {{score}}%",
          dailyDistanceOptions: {
            upTo50: "Up to 50",
            upTo100: "Up to 100",
            upTo150: "Up to 150",
            upTo200: "Up to 200",
            upTo250: "Up to 250",
            upTo300: "Up to 300",
            upTo350: "Up to 350",
            upTo400: "Up to 400",
            upTo450: "Up to 450",
            upTo500: "Up to 500",
            moreThan500: "More than 500"
          },
          regionOptions: {
            north: "North",
            center: "Center",
            south: "South"
          }
        }
      },
      he: {
        translation: {
          welcome: "ברוכים הבאים למחשבון רכב EV!",
          description: "אפלקציה זו עוזרת לך לקבוע את הרכב החשמלי הטוב ביותר עבורך.",
          navNews: "חדשות",
          navElectric: "חשמלית",
          searchPlaceholder: "חיפוש",
          homeChargerLabel: "?האם יש לך מטען ביתי",
          dailyDistanceLabel: "(בממוצע) מרחק נסיעה יומי",
          regionLabel: "האזור שלך:",
          findMyCarButton: "מצא את הרכב שלי",
          noSuitableCars: "לא נמצאו רכבים מתאימים לפי הקריטריונים שלך. נסה להתאים את הפרמטרים שלך.",
          errorLoadingData: "שגיאה בטעינת נתוני הרכב. אנא נסה שוב מאוחר יותר.",
          range: "טווח: {{range}} קמ",
          acceleration: "0-100 קמש: {{acceleration}} שניות",
          suitabilityScore: "ציון התאמה: {{score}}%",
          dailyDistanceOptions: {
            upTo50: "עד 50",
            upTo100: "עד 100",
            upTo150: "עד 150",
            upTo200: "עד 200",
            upTo250: "עד 250",
            upTo300: "עד 300",
            upTo350: "עד 350",
            upTo400: "עד 400",
            upTo450: "עד 450",
            upTo500: "עד 500",
            moreThan500: "יותר מ-500"
          },
          regionOptions: {
            north: "צפון",
            center: "מרכז",
            south: "דרום"
          }
        }
      }
    }
  }).then(updateContent);

// Get DOM elements
const form = document.getElementById('parameters-form');
const resultsDiv = document.getElementById('results');
const heroSection = document.querySelector('.hero h1');
const descriptionParagraph = document.querySelector('.hero p');
const navNews = document.querySelector('nav ul li:first-child a');
const navElectric = document.querySelector('nav ul li:nth-child(2) a');
const searchInput = document.querySelector('.search input');
const homeChargerLabel = document.querySelector('label[for="home-charger"]');
const dailyDistanceLabel = document.querySelector('label[for="daily-distance"]');
const regionLabel = document.querySelector('label[for="region"]');
const dailyDistanceOptions = document.querySelectorAll('#daily-distance option');
const regionOptions = document.querySelectorAll('#region option');
const findMyCarButton = document.querySelector('.btn-primary');

// Language change buttons
const langEnButton = document.getElementById('lang-en');
const langHeButton = document.getElementById('lang-he');

// Set up language change event listeners
langEnButton.addEventListener('click', () => setLanguage('en'));
langHeButton.addEventListener('click', () => setLanguage('he'));

// Flag to track if the "Find My Car" section is visible
let findMyCarSectionVisible = true;

function toggleFindMyCarSection() {
  if (findMyCarSectionVisible) {
    resultsDiv.style.display = 'none';
    findMyCarSectionVisible = false;
  } else {
    resultsDiv.style.display = 'block';
    findMyCarSectionVisible = true;
  }
}

function setLanguage(lang) {
  i18next.changeLanguage(lang).then(() => {
    console.log(`Language changed to ${lang === 'en' ? 'English' : 'Hebrew'}`);
    toggleFindMyCarSection();
    updateContent();
  });
}

function updateContent() {
  // Update static content according to the current language
  heroSection.innerText = i18next.t('welcome');
  descriptionParagraph.innerText = i18next.t('description');
  navNews.innerText = i18next.t('navNews');
  navElectric.innerText = i18next.t('navElectric');
  searchInput.placeholder = i18next.t('searchPlaceholder');
  homeChargerLabel.innerText = i18next.t('homeChargerLabel');
  dailyDistanceLabel.innerText = i18next.t('dailyDistanceLabel');
  regionLabel.innerText = i18next.t('regionLabel');
  findMyCarButton.innerText = i18next.t('findMyCarButton');

  // Update option texts dynamically
  dailyDistanceOptions.forEach((option, index) => {
    const keys = [
      'upTo50',
      'upTo100',
      'upTo150',
      'upTo200',
      'upTo250',
      'upTo300',
      'upTo350',
      'upTo400',
      'upTo450',
      'upTo500',
      'moreThan500'
    ];
    option.innerText = i18next.t(`dailyDistanceOptions.${keys[index]}`);
  });

  regionOptions.forEach((option, index) => {
    const keys = ['north', 'center', 'south'];
    option.innerText = i18next.t(`regionOptions.${keys[index]}`);
  });
}


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
        <p>${i18next.t('range', { range: car.range })}</p>
        <p>${i18next.t('acceleration', { acceleration: car.zeroToSixty })}</p>
        <p>${i18next.t('suitabilityScore', { score: car.score.toFixed(1) })}</p>
      `;

      resultsDiv.appendChild(carCard);
      displayedCars++;
    });

    console.log(`Processed ${processedCars} cars`);
    console.log(`Displayed ${displayedCars} car cards`);

    if (displayedCars === 0) {
      resultsDiv.innerHTML = `<p>${i18next.t('noSuitableCars')}</p>`;
    }

    // Show the "Find My Car" section when the form is submitted
    resultsDiv.style.display = 'block';
    findMyCarSectionVisible = true;

  } catch (error) {
    console.error('Error loading car data:', error);
    resultsDiv.innerHTML = `<p>${i18next.t('errorLoadingData')}</p>`;
  }
});
