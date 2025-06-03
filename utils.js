export function computeSag(runFeet, sagPercent) {
  return (sagPercent / 100) * runFeet;
}

export function computeVelocity(dropFeet) {
  const gravityFeetPerSecondSquared = 32.174;
  return Math.sqrt(2 * gravityFeetPerSecondSquared * dropFeet);
}

export function computeRideTime(runFeet, velocityFeetPerSecond) {
  return velocityFeetPerSecond > 0 ? runFeet / velocityFeetPerSecond : 0;
}

export function estimateZipline(runFeet, cableDropFeet, sagPercent, seatDropFeet, clearanceFeet) {
  const sagFeet = computeSag(runFeet, sagPercent);
  const maxDropFeet = cableDropFeet + sagFeet;
  const velocityFeetPerSecond = computeVelocity(maxDropFeet);
  const velocityMilesPerHour = velocityFeetPerSecond * 0.681818;
  const rideTimeSeconds = computeRideTime(runFeet, velocityFeetPerSecond);

  return {
    sagFeet,
    maxDropFeet,
    velocityFeetPerSecond,
    velocityMilesPerHour,
    rideTimeSeconds
  };
}
