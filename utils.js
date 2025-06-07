export function computeSag(runFt, sagPercent) {
  return (sagPercent / 100) * runFt;
}

export function computeVelocity(dropFt) {
  const gravityFtPerSecondSquared = 32.174;
  return Math.sqrt(2 * gravityFtPerSecondSquared * dropFt);
}

export function computeRideTime(runFt, velocityFtPerSecond) {
  return velocityFtPerSecond > 0 ? runFt / velocityFtPerSecond : 0;
}

export function estimateZipline(runFt, cableDropFt, sagPercent, seatDropFt, clearanceFt) {
  const sagFt = computeSag(runFt, sagPercent);
  const maxDropFt = cableDropFt + sagFt;
  const velocityFtPerSecond = computeVelocity(maxDropFt);
  const velocityMilesPerHour = velocityFtPerSecond * 0.681818;
  const rideTimeSeconds = computeRideTime(runFt, velocityFtPerSecond);

  return {
    sagFt,
    maxDropFt,
    velocityFtPerSecond,
    velocityMilesPerHour,
    rideTimeSeconds
  };
}
