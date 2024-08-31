const calculateSuitabilityScore = require('./suitabilityScore');

describe('calculateSuitabilityScore', () => {
  test('calculates correct score for a suitable car', () => {
    const car = {
      range: 500,
      chargingTime: { rapid: 30, home: 8 },
      availableRegions: ['North', 'Center', 'South'],
    };
    const userParams = {
      drivingRange: 450,
      hasHomeCharger: true,
      avgDailyDistance: 50,
      region: 'Center',
    };
    
    const score = calculateSuitabilityScore(car, userParams);
    
    expect(score).toBe(100);
  });

  test('calculates lower score for a car with insufficient range', () => {
    const car = {
      range: 300, 
      chargingTime: { rapid: 30, home: 8 },
      availableRegions: ['North', 'Center', 'South'],
    };
    const userParams = {
      drivingRange: 450,
      hasHomeCharger: true,
      avgDailyDistance: 50,
      region: 'Center',  
    };

    const score = calculateSuitabilityScore(car, userParams);

    expect(score).toBe(67);
  });

  test('calculates zero score for a car not available in the user\'s region', () => {
    const car = {
      range: 500,
      chargingTime: { rapid: 30, home: 8 }, 
      availableRegions: ['North', 'South'],
    };
    const userParams = { 
      drivingRange: 450,
      hasHomeCharger: true,
      avgDailyDistance: 50,
      region: 'Center',
    };

    const score = calculateSuitabilityScore(car, userParams);

    expect(score).toBe(0);
  });

  test('calculates lower score for a car without home charging when user has a home charger', () => {
    const car = {
      range: 500,
      chargingTime: { rapid: 30, home: 0 },
      availableRegions: ['North', 'Center', 'South'], 
    };
    const userParams = {
      drivingRange: 450, 
      hasHomeCharger: true,
      avgDailyDistance: 50,
      region: 'Center',
    };

    const score = calculateSuitabilityScore(car, userParams);

    expect(score).toBe(80);
  });
});