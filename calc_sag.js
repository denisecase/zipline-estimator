// calc_sag.js

/**
 * Returns sag distance (in Ft) from cable height at sag point
 * to the lowest point under the rider, adjusted for anchor elevations.
 *
 * If the cable is nearly level, we blend the sag point percent toward 50%.
 */
export function getSagFromCableAtSagPointFt(
  weight,
  table = [],
  cableDropFt = 0,
  startAnchorFt = 0,
  endAnchorFt = 0
) {
  const sagVertical = getVerticalSagBelowStartAnchorFt(weight, table);

  // Get raw sag point percent from table
  const baseSagPercent = getSagPointPercentFromEnd(weight, table);

  // Adjust if cable is nearly level
  const sagPercent = adjustSagPointPercentForAnchorHeights(
    baseSagPercent,
    startAnchorFt,
    endAnchorFt
  );

  // Estimate cable height at sag point (linear interpolation)
  const cableHeightAtSag = cableDropFt * (sagPercent / 100);

  return sagVertical - cableHeightAtSag;
}


function getVerticalSagBelowStartAnchorFt(weight, table = []) {
  return interpolate(table, weight, "sagBelowStartAnchorFt");
}

export function getSagPointPercentFromEnd(weight, table = []) {
  return interpolate(table, weight, "sagPointPercentFromEnd");
}

/**
 * Returns adjusted sag point percent based on rider weight and anchor elevation.
 */
export function getAdjustedSagPointPercentFromEnd(weight, table = [], startAnchorFt, endAnchorFt) {
  const basePercent = getSagPointPercentFromEnd(weight, table);
  return adjustSagPointPercentForAnchorHeights(basePercent, startAnchorFt, endAnchorFt);
}

export function interpolate(table, x, field) {
  if (!Array.isArray(table) || table.length === 0) return 0;

  const sorted = [...table].sort((a, b) => a.riderWeightLbs - b.riderWeightLbs);

  for (let i = 0; i < sorted.length - 1; i++) {
    const w1 = sorted[i].riderWeightLbs;
    const w2 = sorted[i + 1].riderWeightLbs;

    if (x >= w1 && x <= w2) {
      const y1 = sorted[i][field];
      const y2 = sorted[i + 1][field];
      const t = (x - w1) / (w2 - w1);
      return y1 + t * (y2 - y1);
    }
  }

  // clamp to min or max
  if (x < sorted[0].riderWeightLbs) return sorted[0][field];
  if (x > sorted[sorted.length - 1].riderWeightLbs) return sorted[sorted.length - 1][field];

  return 0;
}


/**
 * Adjusts sag point percent based on how level the cable is.
 * Returns a value between the original table value and 50.
 */
function adjustSagPointPercentForAnchorHeights(tableValueMaxPercent, startAnchorFt, endAnchorFt) {
  const elevationDiff = Math.abs(startAnchorFt - endAnchorFt);

  // Define how "level" is considered negligible (e.g., 0.5 ft difference)
  const thresholdFt = 1.0;

  if (elevationDiff >= thresholdFt) {
    return tableValueMaxPercent; // use original table value
  }

  // Interpolate between table value and 50% (midpoint sag)
  const t = elevationDiff / thresholdFt; // t ranges from 0 to 1
  return (1 - t) * 50 + t * tableValueMaxPercent;
}

export function getCableElevationAtSagPointFt(startAnchorFt, cableDropFt, sagPointPercentFromEnd) {
  // Calculate the cable height at the sag point based on sag percent
  const sagPercent = 100 - sagPointPercentFromEnd; // convert to percent from start anchor
  return startAnchorFt - (cableDropFt * (sagPercent / 100));
} 

