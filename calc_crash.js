// calc_crash.js

/**
 * Checks whether the bottom of the seat clearance rectangle is below the sloping ground
 * at the rider's sag point.
 *
 * @param {object} geo - The comprehensive geometry object in feet, including all elevations.
 * Expected to contain `transitionPointRatio` and `earlySlopeRatio` (0-1).
 * @returns {boolean} True if a crash is detected (clearance bottom <= ground elevation), false otherwise.
 */
export function isCrashAtSagPoint(geo) {
  console.log("isCrashAtSagPoint called with geo:", geo);

  // --- Input Validation ---
  if (!geo || typeof geo.runFt !== 'number' || typeof geo.sagPointPercentFromEnd !== 'number' ||
      typeof geo.sagFtFromCableAtSagPointFt !== 'number' || typeof geo.seatDropFt !== 'number' ||
      typeof geo.clearanceFt !== 'number' || typeof geo.startAnchorElevationFt !== 'number' ||
      typeof geo.endAnchorElevationFt !== 'number' || typeof geo.cableHeightAtSagPointFt !== 'number' ||
      typeof geo.transitionPointRatio !== 'number' ||
      typeof geo.earlySlopeRatio !== 'number' ||
      typeof geo.slopeDeltaFt !== 'number' ||
      typeof geo.startGroundElevationFt !== 'number'
     ) {
    console.error("Invalid or incomplete 'geo' object provided to isCrashAtSagPoint:", geo);
    const missingProps = [];
    if (typeof geo.runFt !== 'number') missingProps.push('runFt');
    if (typeof geo.sagPointPercentFromEnd !== 'number') missingProps.push('sagPointPercentFromEnd');
    if (typeof geo.sagFtFromCableAtSagPointFt !== 'number') missingProps.push('sagFtFromCableAtSagPointFt');
    if (typeof geo.seatDropFt !== 'number') missingProps.push('seatDropFt');
    if (typeof geo.clearanceFt !== 'number') missingProps.push('clearanceFt');
    if (typeof geo.startAnchorElevationFt !== 'number') missingProps.push('startAnchorElevationFt');
    if (typeof geo.endAnchorElevationFt !== 'number') missingProps.push('endAnchorElevationFt');
    if (typeof geo.cableHeightAtSagPointFt !== 'number') missingProps.push('cableHeightAtSagPointFt');
    if (typeof geo.transitionPointRatio !== 'number') missingProps.push('transitionPointRatio');
    if (typeof geo.earlySlopeRatio !== 'number') missingProps.push('earlySlopeRatio');
    if (typeof geo.slopeDeltaFt !== 'number') missingProps.push('slopeDeltaFt');
    if (typeof geo.startGroundElevationFt !== 'number') missingProps.push('startGroundElevationFt');
    console.error("Missing/Invalid properties: ", missingProps.join(', '));
    return false;
  }

  // Ensure critical values are within reasonable bounds
  if (geo.runFt <= 0 || geo.sagFtFromCableAtSagPointFt < 0) {
    console.warn("Invalid runFt or sagFtFromCableAtSagPointFt values. Defaulting to no crash.");
    return false;
  }

  // --- Calculate X-coordinate of Sag Point ---
  // geo.sagPointPercentFromEnd is percentage from the END (e.g., 25 means 25% from end).
  // So, (100 - geo.sagPointPercentFromEnd) gives percentage from START.
  // Divide by 100 to get a ratio from START (0 to 1).
  const sagXFt = geo.runFt * ((100 - geo.sagPointPercentFromEnd) / 100);
  console.log(`Sag point X-coordinate (in ft): ${sagXFt.toFixed(2)}`);

  // --- Calculate the Y-elevation of the BOTTOM OF SEAT CLEARANCE at the sag point ---
  const cableLineElevationAtSagXFt = geo.cableHeightAtSagPointFt;
  const actualSagPointElevationFt = cableLineElevationAtSagXFt - geo.sagFtFromCableAtSagPointFt;
  const seatBottomElevationFt = actualSagPointElevationFt - geo.seatDropFt;
  const clearanceBottomElevationFt = seatBottomElevationFt - geo.clearanceFt;

  console.log(`Cable line elevation at sag X: ${cableLineElevationAtSagXFt.toFixed(2)} ft`);
  console.log(`Actual sag point elevation: ${actualSagPointElevationFt.toFixed(2)} ft`);
  console.log(`Seat bottom elevation: ${seatBottomElevationFt.toFixed(2)} ft`);
  console.log(`Clearance bottom elevation: ${clearanceBottomElevationFt.toFixed(2)} ft`);

  // --- Get the ground elevation at the sag point's X-coordinate ---
  const groundElevationAtSagXFt = getGroundElevationAtX(sagXFt, geo); // geo passed as is to getGroundElevationAtX
  console.log(`Ground elevation at sag X: ${groundElevationAtSagXFt.toFixed(2)} ft`);

  // --- Determine if there's a crash ---
  const crash = clearanceBottomElevationFt <= groundElevationAtSagXFt;
  console.log(`Crash detected: ${crash} (Clearance Bottom: ${clearanceBottomElevationFt.toFixed(2)} ft vs Ground: ${groundElevationAtSagXFt.toFixed(2)} ft)`);

  return crash;
}

/**
 * Returns ground elevation (in Ft) at a given X-coordinate in Ft.
 * Assumes two-part slope: early and late, defined by transitionPointRatio and earlySlopeRatio.
 *
 * @param {number} xFt - The X-coordinate in feet to get the ground elevation for.
 * @param {object} geo - The comprehensive geometry object containing ground slope details.
 * Expected to contain `transitionPointRatio` and `earlySlopeRatio` (0-1).
 * @returns {number} The ground elevation in feet at the given X-coordinate.
 * @throws {Error} If xFt is out of bounds [0, runFt].
 */
export function getGroundElevationAtX(xFt, geo) {
  if (typeof xFt !== 'number' || xFt < 0 || xFt > geo.runFt) {
    throw new Error(`xFt (${xFt}) must be between 0 and runFt (${geo.runFt}) for getGroundElevationAtX`);
  }

  const {
    runFt,
    transitionPointRatio, // Expecting 0-1 ratio
    earlySlopeRatio,      // Expecting 0-1 ratio
    slopeDeltaFt,
    startGroundElevationFt,
  } = geo;

  // Calculate the X-coordinate of the transition point
  const transitionXFt = runFt * transitionPointRatio;
  console.log(`Ground calculation: xFt=${xFt.toFixed(2)}, transitionXFt=${transitionXFt.toFixed(2)}, startGroundElevationFt=${startGroundElevationFt.toFixed(2)}, slopeDeltaFt=${slopeDeltaFt.toFixed(2)}, earlySlopeRatio=${earlySlopeRatio.toFixed(2)}`);


  if (xFt <= transitionXFt) {
    // Early slope segment
    const earlySlopeRiseOrFall = slopeDeltaFt * earlySlopeRatio;
    const actualEarlySlope = (transitionXFt === 0) ? 0 : earlySlopeRiseOrFall / transitionXFt;
    return startGroundElevationFt - (xFt * actualEarlySlope);

  } else {
    // Late slope segment
    const earlyRiseOrFallAtTransition = slopeDeltaFt * earlySlopeRatio;
    const lateRiseOrFallSegment = slopeDeltaFt - earlyRiseOrFallAtTransition;
    const lateSegmentRunFt = runFt - transitionXFt;
    const actualLateSlope = (lateSegmentRunFt === 0) ? 0 : lateRiseOrFallSegment / lateSegmentRunFt;
    const currentElevation = startGroundElevationFt - earlyRiseOrFallAtTransition - ((xFt - transitionXFt) * actualLateSlope);
    return currentElevation;
  }
}