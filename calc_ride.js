// calc_ride.js

export const gFtPerSecSquared = 32.174; // Acceleration due to gravity in ft/s²
const FT_PER_SEC_TO_MPH = 0.681818;

/**
 * Computes and rounds to one decimal place.
 */
function round1(value) {
  return Math.round(value * 10) / 10;
}

/**
 * Computes maximum velocity (in Ft/sec) over the entire ride.
 * This assumes uniform acceleration from rest to max speed.
 * Under constant acceleration: v_avg = (v_initial + v_final) / 2 = v_max / 2
 */
export function computeMaxVelocityFtPerSec(dropFt) {
    if (dropFt <= 0) return 0;
  const v = Math.sqrt(2 * gFtPerSecSquared * dropFt);
  return round1(v);
}

/**
 * Computes Avg velocity (in Ft/sec) based on drop height using simplified gravity.
 * Assumes free fall without friction or cable tension.
 */
export function computeAvgVelocityFtPerSec(dropFt) {
  if (dropFt <= 0) return 0;
  const vAvg = computeMaxVelocityFtPerSec(dropFt) / 2;
  return round1(vAvg);
}

/**
 * Computes ride time assuming constant velocity (simplified).
 * In real-world, use Avg velocity over changing acceleration.
 */
export function computeRideTimeSeconds(runFt, avgVelocityFtPerSecond) {
   if (avgVelocityFtPerSecond <= 0) return 0;
  return round1(runFt / avgVelocityFtPerSecond);
}

/**
 * Converts Ft per second to miles per hour (mph).
 */
export function toMilesPerHour(FtPerSecond) {
  const mph = FtPerSecond * FT_PER_SEC_TO_MPH;
  return Math.round(mph * 10) / 10;
}

/**
 * Convenience: Converts Avg velocity (ft/s) to mph
 */
export function computeAvgVelocityMph(dropFt) {
  return toMilesPerHour(computeAvgVelocityFtPerSec(dropFt));
}

/**
 * Convenience: Converts max velocity (ft/s) to mph
 */
export function computeMaxVelocityMph(dropFt) {
  return toMilesPerHour(computeMaxVelocityFtPerSec(dropFt));
}

export function getMaxDropFt(startAnchorHeightFromEndGroundFt, lowestSeatElevationFt) {
  if (startAnchorHeightFromEndGroundFt <= 0 || lowestSeatElevationFt < 0) {
    return 0; // No drop if anchor height is zero or negative
  }
  const maxDropFt = startAnchorHeightFromEndGroundFt - lowestSeatElevationFt;
  return Math.max(0, round1(maxDropFt)); // Ensure non-negative drop
}
