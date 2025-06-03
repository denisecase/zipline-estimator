// calcs.js

/**
 * Calculates all relevant zipline geometry in real-world units (feet).
 * It determines an overall vertical shift required to ensure the lowest point
 * of the seat clearance zone clears the ground.
 *
 * @param {object} params - Input parameters for the zipline design.
 * @param {number} params.runFeet - Horizontal length of the zipline run.
 * @param {number} params.slopeDeltaFeet - Vertical height difference between start ground and end ground (start_ground - end_ground).
 * @param {number} params.cableDropFeet - Vertical height difference between start anchor and end anchor (start_anchor - end_anchor).
 * @param {number} params.sagFeet - Vertical sag of the cable at its midpoint below the straight line between anchors.
 * @param {number} params.sagPointPercent - Horizontal position of sag point, expressed as a percent from end (e.g., 44).
 * @param {number} params.seatDropFeet - Vertical drop from the cable to the seat attachment point.
 * @param {number} params.clearanceFeet - Desired minimum vertical clearance between the seat bottom and the ground.
 * @param {number} params.initialEndAnchorHeightFeet - The initial desired height of the end anchor above the end ground.
 * @returns {object} An object containing all calculated elevations and dimensions in feet.
 */
export function calculateZiplineGeometry(params) {
  const {
    runFeet,
    slopeDeltaFeet,
    cableDropFeet,
    sagFeet,
    sagPointPercent,
    seatDropFeet,
    clearanceFeet,
    initialEndAnchorHeightFeet,
  } = params;

  // --- Step 1: Establish Initial Relative Ground Elevations (assuming end ground is at 0 reference) ---
  const relativeEndGroundElevationFt = 0; // Reference point: End Ground is at 0 elevation
  const relativeStartGroundElevationFt =
    relativeEndGroundElevationFt + slopeDeltaFeet;

  // --- Step 2: Establish Initial Relative Anchor Elevations ---
  const relativeEndAnchorElevationFt =
    relativeEndGroundElevationFt + initialEndAnchorHeightFeet;
  const relativeStartAnchorElevationFt =
    relativeEndAnchorElevationFt + cableDropFeet;

  // --- Step 3: Calculate Initial Relative Cable Midpoint Elevation ---
  const midlineAnchorElevationFt =
    (relativeStartAnchorElevationFt + relativeEndAnchorElevationFt) / 2;
  const relativeMidCableElevationFt = midlineAnchorElevationFt - sagFeet;

  // --- Step 4: Calculate Initial Relative **Bottom of Clearance** Elevation ---
  const relativeBottomClearanceElevationFt =
    relativeMidCableElevationFt - seatDropFeet - clearanceFeet;

  // --- Step 5: Determine Required Vertical Offset for Ground Clearance (in feet) ---
  let verticalOffsetNeededFt = 0;
  if (relativeBottomClearanceElevationFt < relativeEndGroundElevationFt) {
    verticalOffsetNeededFt =
      relativeEndGroundElevationFt - relativeBottomClearanceElevationFt;
  }

  // --- Step 6: Apply the Vertical Offset to all Elevations (Final "Real-World" Elevations) ---
  // These are the actual variables holding the final calculated values
  const finalStartGroundElevationFt =
    relativeStartGroundElevationFt + verticalOffsetNeededFt;
  const finalEndGroundElevationFt =
    relativeEndGroundElevationFt + verticalOffsetNeededFt;
  const finalStartAnchorElevationFt =
    relativeStartAnchorElevationFt + verticalOffsetNeededFt;
  const finalEndAnchorElevationFt =
    relativeEndAnchorElevationFt + verticalOffsetNeededFt;
  const finalMidCableElevationFt =
    relativeMidCableElevationFt + verticalOffsetNeededFt;
  const finalBottomClearanceElevationFt =
    relativeBottomClearanceElevationFt + verticalOffsetNeededFt;

  // --- Step 7: Calculate Horizontal Positions (in feet) ---
  const startXFt = 0;
  const endXFt = runFeet;
  const midXFt = (sagPointPercent / 100) * runFeet;

  // --- Step 8: Calculate Label Values (in feet) ---
  const startAnchorAboveStartGroundFeet =
    finalStartAnchorElevationFt - finalStartGroundElevationFt;
  const startAnchorAboveEndGroundFeet =
    finalStartAnchorElevationFt - finalEndGroundElevationFt;
  const endAnchorAboveEndGroundFeet =
    finalEndAnchorElevationFt - finalEndGroundElevationFt;

  return {
    // Input parameters (returned as-is for reference)
    runFeet,
    slopeDeltaFeet,
    cableDropFeet,
    sagFeet,
    sagPointPercent,
    seatDropFeet,
    clearanceFeet,
    initialEndAnchorHeightFeet,

    // Final Calculated Elevations (in feet) --
    StartGroundElevationFt: finalStartGroundElevationFt,
    EndGroundElevationFt: finalEndGroundElevationFt,
    startAnchorElevationFt: finalStartAnchorElevationFt,
    endAnchorElevationFt: finalEndAnchorElevationFt,
    midCableElevationFt: finalMidCableElevationFt,
    bottomClearanceElevationFt: finalBottomClearanceElevationFt,
    verticalOffsetFt: verticalOffsetNeededFt,

    // Horizontal Positions (in feet)
    startXFt,
    endXFt,
    midXFt,

    // Specific values for labels (in feet)
    startAnchorAboveStartGroundFeet,
    startAnchorAboveEndGroundFeet,
    endAnchorAboveEndGroundFeet,
  };
}
