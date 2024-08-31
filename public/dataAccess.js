// Read car data from JSON file
async function readCarData() {
  try {
    const lang = i18next.language;
    const timestamp = new Date().getTime();
    const response = await fetch(`/data/cars.${lang}.json?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Fetched car data (${lang}):`, data);
    return data;
  } catch (error) {
    console.error('Error fetching car data:', error);
    throw error;
  }
}

export { readCarData };