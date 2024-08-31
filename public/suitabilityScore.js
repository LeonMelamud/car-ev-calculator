// Calculate suitability score based on input parameters
const calculateSuitabilityScore = (car, userParams) => {
  let score = 0;

  // Score based on driving range
  const rangeScore = calculateRangeScore(car.range);
  score += rangeScore * 0.40; // 40% weight for range

  // Score based on charging times
  const chargingScore = calculateChargingScore(car.chargingTime);
  score += chargingScore * 0.40; // 40% weight for charging

  // Score based on daily distance
  const distanceRatio = car.range / userParams.avgDailyDistance;
  const distanceScore = Math.min(distanceRatio, 1.2);
  score += distanceScore * 0.15; // 15% weight for daily distance

  // Score based on region
  const availableRegionCount = car.availableRegions.filter(region => userParams.region.includes(region)).length;
  const regionScore = availableRegionCount / userParams.region.length;
  score += regionScore * 0.05; // 5% weight for region
  
  return Math.round(Math.min(score, 1) * 100);
};

const calculateRangeScore = (range) => {
  if (range >= 500) return 1;
  if (range >= 400) return 0.9;
  if (range >= 300) return 0.8;
  if (range >= 200) return 0.6;
  if (range >= 100) return 0.4;
  return 0.2;
};

const calculateChargingScore = (chargingTime) => {
  const rapidScore = 1 - Math.min(chargingTime.rapid / 2, 1); // Normalize rapid charging time (0.5 hour is optimal)
  const homeScore = 1 - Math.min(chargingTime.home / 12, 1); // Normalize home charging time (8 hours is good, 12 hours is max)
  
  return (rapidScore * 0.6) + (homeScore * 0.4); // 60% weight for rapid charging, 40% for home charging
};

export { calculateSuitabilityScore };