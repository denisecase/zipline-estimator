// calcs.js

import {
  getSagPointPercentFromEnd,
  getSagFromCableAtSagPointFt,
  getCableElevationAtSagPointFt,
} from "./calc_sag.js";

import { isCrashAtSagPoint } from "./calc_crash.js";



/**
 * Calculates all relevant zipline geometry in real-world units (Ft).
 * It determines an overall vertical shift required to ensure the lowest point
 * of the seat clearance zone clears the ground.
 *
 * @param {object} params - Input parameters for the zipline design.
 * @param {number} params.runFt - Horizontal length of the zipline run.
 * @param {number} params.slopeDeltaFt - Elevation of the start ground relative to the end ground (0 baseline).
 * @param {number} params.transitionPointPercent - Percentage of the run where the slope changes (0 to 100).
 * @param {number} params.earlySlopePercent - Percentage of the total slope that occurs early (0 to 100).
 * @param {number} params.cableDropFt - Vertical height difference between start anchor and end anchor (start_anchor - end_anchor).
 * @param {number} params.seatDropFt - Vertical drop from the cable to the seat attachment point.
 * @param {number} params.clearanceFt - Desired minimum vertical clearance between the seat bottom and the ground.
 * @param {number} params.endAnchorHeightFromEndGroundFt - The height of the end anchor above the end ground (baseline 0).
 * @param {number} params.riderWeightLbs - Weight of the rider in pounds.
 * @param {Array} params.riderSagTable - Table of sag data for different rider weights, containing objects with `riderWeightLbs`, `sagPointPercentFromEnd`, and `sagBelowStartAnchorFt`.
 * @returns {object} An object containing all calculated elevations and dimensions in Ft.
 */
export function calcGeo(params) {
  console.log("calcGeo called with params:", params);

  const {
    runFt,
    slopeDeltaFt,
    transitionPointPercent, // UI input as percentage (0-100)
    earlySlopePercent,      // UI input as percentage (0-100)
    cableDropFt,
    seatDropFt,
    clearanceFt,
    endAnchorHeightFromEndGroundFt,
    riderWeightLbs,
    riderSagTable,
  } = params;

  // --- Ground Elevations ---
  
  const endGroundElevationFt = 0; // End ground is our baseline (0 elevation)
  const startGroundElevationFt = endGroundElevationFt + slopeDeltaFt;

  // --- Anchor Elevations (relative to the common baseline: endGroundElevationFt = 0) ---
  
  const startAnchorHeightFromEndGroundFt = endAnchorHeightFromEndGroundFt + cableDropFt;

  // --- Sag Calculations ---

  const sagPointPercentFromEnd = getSagPointPercentFromEnd(
    riderWeightLbs,
    riderSagTable
  );

  // cableHeightAtSagPointFt is the elevation of the *straight line* between anchors
  // at the sag point's X-coordinate.
  const cableHeightAtSagPointFt = getCableElevationAtSagPointFt(
    startAnchorHeightFromEndGroundFt,
    cableDropFt, // cableDropFt is (start_anchor_y - end_anchor_y)
    sagPointPercentFromEnd // This will be used to determine the X-position on the straight line
  );

  // sagFtFromCableAtSagPointFt is the vertical distance the actual cable sags below
  // the straight line at the sag point.
  const sagFtFromCableAtSagPointFt = getSagFromCableAtSagPointFt(
    riderWeightLbs,
    riderSagTable,
    cableDropFt,
    startAnchorHeightFromEndGroundFt, // Pass actual elevation
    endAnchorHeightFromEndGroundFt    // Pass actual elevation
  );

  // --- Derived Rider/Cable Elevations at Sag Point ---
  // Actual sag point elevation (rider's attachment point on the cable, before seat drop)
  // This is the straight cable line elevation MINUS the sag amount.
  const actualSagPointElevationFt = cableHeightAtSagPointFt - sagFtFromCableAtSagPointFt;

  // Seat bottom elevation at sag point (where rider's butt would be)
  const lowestSeatElevationFt = actualSagPointElevationFt - seatDropFt;

  // Bottom of the clearance rectangle at sag point
  const lowestClearanceAboveEndGroundFt = lowestSeatElevationFt - clearanceFt;


  // --- Final Geo Object Assembly ---
  const geo = {
    ...params, // Include all original input parameters

    // Derived Ground Elevations (relative to endGroundElevationFt = 0)
    startGroundElevationFt,
    endGroundElevationFt,

    // Derived Anchor Elevations (relative to endGroundElevationFt = 0)
    // These are the "absolute" elevations for use in other calculations
    startAnchorElevationFt: startAnchorHeightFromEndGroundFt,
    endAnchorElevationFt: endAnchorHeightFromEndGroundFt,

    // Convert UI percentages to ratios (0-1) for consistency in downstream calculations
    transitionPointRatio: transitionPointPercent / 100,
    earlySlopeRatio: earlySlopePercent / 100,

    // Calculated Values: Sag
    sagPointPercentFromEnd,
    sagFtFromCableAtSagPointFt,
    cableHeightAtSagPointFt,   // Elevation of straight line at sag X
    actualSagPointElevationFt, // Actual cable elevation at sag point
    lowestSeatElevationFt,     // Bottom of seat at sag point
    lowestClearanceAboveEndGroundFt, // Bottom of clearance box at sag point

    // Ride Metrics
    maxDropFt: startAnchorHeightFromEndGroundFt - lowestSeatElevationFt, // Max drop from start anchor to lowest seat point

    // Horizontal Positions (in Ft)
    startXFt: 0,
    endXFt: runFt,
    // Calculate midXFt based on sagPointPercentFromEnd for consistency with other sag calcs
    midXFt: runFt * ((100 - sagPointPercentFromEnd) / 100),

    // Derived Anchor Heights (for Labeling/Drawing - heights above specific grounds)
    startAnchorAboveStartGroundFt: startAnchorHeightFromEndGroundFt - startGroundElevationFt,
    startAnchorAboveEndGroundFt: startAnchorHeightFromEndGroundFt - endGroundElevationFt,
    endAnchorAboveEndGroundFt: endAnchorHeightFromEndGroundFt - endGroundElevationFt,

    // --- Safety Check ---

    isSafe: !isCrashAtSagPoint({
      runFt,
      sagPointPercentFromEnd,
      sagFtFromCableAtSagPointFt,
      seatDropFt,
      clearanceFt,
      startAnchorElevationFt: startAnchorHeightFromEndGroundFt, // Pass as startAnchorElevationFt
      endAnchorElevationFt: endAnchorHeightFromEndGroundFt,     // Pass as endAnchorElevationFt
      cableHeightAtSagPointFt, // This is the straight line elevation at sag X
      transitionPointRatio: transitionPointPercent / 100, // Pass ratio for getGroundElevationAtX
      earlySlopeRatio: earlySlopePercent / 100,           // Pass ratio for getGroundElevationAtX
      slopeDeltaFt,
      startGroundElevationFt,
    }),
  };

  console.log("calcGeo result:", geo);
  return geo;
}