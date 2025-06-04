// calcs.js

import { getSagPointPercent, getSagFeet } from "./calc_utils.js";

export function isClearanceSafe(bottomClearanceFt, minGroundFt) {
  return bottomClearanceFt >= minGroundFt;
}

/**
 * Calculates all relevant zipline geometry in real-world units (feet).
 * It determines an overall vertical shift required to ensure the lowest point
 * of the seat clearance zone clears the ground.
 *
 * @param {object} params - Input parameters for the zipline design.
 * @param {number} params.runFeet - Horizontal length of the zipline run.
 * @param {number} params.slopeDeltaFeet - Vertical height difference between start ground and end ground (start_ground - end_ground).
 * @param {number} params.cableDropFeet - Vertical height difference between start anchor and end anchor (start_anchor - end_anchor).
 * @param {number} params.seatDropFeet - Vertical drop from the cable to the seat attachment point.
 * @param {number} params.clearanceFeet - Desired minimum vertical clearance between the seat bottom and the ground.
 * @param {number} params.initialEndAnchorHeightFeet - The initial desired height of the end anchor above the end ground.
 * @param {number} params.riderWeightLbs - Weight of the rider in pounds.
 * @param {Array} params.riderSagTable - Table of sag data for different rider weights, containing objects with `rider_weight_lbs`, `sag_point_percent`, and `sag_vertical_ft`.
 * @returns {object} An object containing all calculated elevations and dimensions in feet.
 */
export function calcGeo(params) {
  const {
    runFeet,
    slopeDeltaFeet,
    cableDropFeet,
    seatDropFeet,
    clearanceFeet,
    initialEndAnchorHeightFeet,
    riderWeightLbs,
    riderSagTable,
    transitionPointRatio,
    earlySlopeRatio,
  } = params;

  const sagPointPercent = getSagPointPercent(riderWeightLbs, riderSagTable);
  const sagFeet = getSagFeet(riderWeightLbs, riderSagTable, cableDropFeet);

  const endGround = 0;
  const startGround = endGround + slopeDeltaFeet;

  const endAnchor = endGround + initialEndAnchorHeightFeet;
  const startAnchor =
    startGround + (initialEndAnchorHeightFeet + cableDropFeet);

  const midAnchor = (startAnchor + endAnchor) / 2;
  const midCable = midAnchor - sagFeet;

  const bottomClearance = midCable - seatDropFeet - clearanceFeet;

  const minGround = Math.min(startGround, endGround);
  const isSafe = bottomClearance >= minGround;

  return {
    // --- Input Parameters ---
    runFeet,
    slopeDeltaFeet,
    cableDropFeet,
    sagFeet,
    sagPointPercent,
    seatDropFeet,
    clearanceFeet,
    transitionPointRatio,
    earlySlopeRatio,

    // --- Horizontal Positions (in Feet) ---
    startXFt: 0,
    endXFt: runFeet,
    midXFt: (sagPointPercent / 100) * runFeet,

    // --- Elevations (in Feet) ---
    startGroundElevationFt: startGround,
    endGroundElevationFt: endGround,
    startAnchorElevationFt: startAnchor,
    endAnchorElevationFt: endAnchor,
    midCableElevationFt: midCable,
    bottomClearanceElevationFt: bottomClearance,

    // --- Derived Anchor Heights (for Labeling) ---
    startAnchorAboveStartGroundFeet: startAnchor - startGround,
    startAnchorAboveEndGroundFeet: startAnchor - endGround,
    endAnchorAboveEndGroundFeet: endAnchor - endGround,

    // --- Safety Check ---
    isSafe,
  };
}
