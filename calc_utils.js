// calc_utils.js

export function getSagPointPercent(weight, table = []) {
  return interpolate(table, weight, "sag_point_percent");
}

export function getVerticalSag(weight, table = []) {
  return interpolate(table, weight, "sag_vertical_ft");
}

export function getSagFeet(weight, table = [], cableDropFeet = 0) {
  const sagVertical = getInterpolatedSagVertical(weight, table);
  const sagPercent = getInterpolatedSagPercent(weight, table);
  const cableHeightAtSag = cableDropFeet * (sagPercent / 100);
  return sagVertical - cableHeightAtSag;
}

function getInterpolatedSagVertical(weight, table) {
  return interpolate(table, weight, "sag_vertical_ft");
}

function getInterpolatedSagPercent(weight, table) {
  return interpolate(table, weight, "sag_point_percent");
}

export function interpolate(table, x, field) {
  if (!Array.isArray(table) || table.length === 0) return 0;

  const sorted = [...table].sort((a, b) => a.rider_weight_lbs - b.rider_weight_lbs);

  for (let i = 0; i < sorted.length - 1; i++) {
    const w1 = sorted[i].rider_weight_lbs;
    const w2 = sorted[i + 1].rider_weight_lbs;

    if (x >= w1 && x <= w2) {
      const y1 = sorted[i][field];
      const y2 = sorted[i + 1][field];
      const t = (x - w1) / (w2 - w1);
      return y1 + t * (y2 - y1);
    }
  }

  // clamp to min or max
  if (x < sorted[0].rider_weight_lbs) return sorted[0][field];
  if (x > sorted[sorted.length - 1].rider_weight_lbs) return sorted[sorted.length - 1][field];

  return 0;
}
