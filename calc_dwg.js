// calc_dwg.js

import { getGroundElevationAtX } from "./calc_crash.js"; // <--- ADD THIS IMPORT

/**
 * Converts real-world zipline geometry (in feet) into SVG pixel coordinates and dimensions.
 *
 * @param {object} geo - The comprehensive geometry object returned by calcGeo, containing
 * all real-world (feet) measurements and elevations.
 * @returns {object} An object containing all calculated pixel coordinates and dimensions (dwg).
 */
export function calcDwg(geo) {
  // Define drawing constants
  const PIXELS_PER_FOOT = 10;
  const MARGIN_PIXELS = 50;
  const SVG_HEIGHT_PIXELS = 300; // Fixed SVG height for the diagram

  // Calculate the baseline for Y-coordinates in SVG (Y increases downwards in SVG)
  // This positions the "0 elevation" at a certain point from the bottom of the SVG.
  const AXIS_Y_PIXELS = SVG_HEIGHT_PIXELS - MARGIN_PIXELS;

  const dwg = {}; // This object will store all pixel-based drawing coordinates and dimensions

  // 1. SVG Canvas Dimensions
  dwg.svgWidthPx = geo.runFt * PIXELS_PER_FOOT + MARGIN_PIXELS * 2;
  dwg.svgHeightPx = SVG_HEIGHT_PIXELS;
  dwg.marginPx = MARGIN_PIXELS;
  dwg.pixelsPerFoot = PIXELS_PER_FOOT; // Useful for scaling smaller components or labels if needed
  dwg.axisYPx = AXIS_Y_PIXELS; // Baseline for Y-coordinates

  // 2. Ground Coordinates
  // Ground starts at the left margin and extends for the runFt length
  dwg.startGroundXPx = MARGIN_PIXELS;
  dwg.endGroundXPx = MARGIN_PIXELS + geo.runFt * PIXELS_PER_FOOT;
  // Convert ground elevations from feet to SVG Y-pixels ( Y increases downwards)
  dwg.startGroundYPx =
    AXIS_Y_PIXELS - geo.startGroundElevationFt * PIXELS_PER_FOOT;
  dwg.endGroundYPx = AXIS_Y_PIXELS - geo.endGroundElevationFt * PIXELS_PER_FOOT;

  dwg.transitionPointRatio = geo.transitionPointRatio;
  dwg.earlySlopeRatio = geo.earlySlopeRatio;
  const transitionXFt = geo.runFt * geo.transitionPointRatio;
  const transitionGroundElevationFt = getGroundElevationAtX(transitionXFt, geo);
  dwg.transitionGroundXPx = MARGIN_PIXELS + transitionXFt * PIXELS_PER_FOOT;
  dwg.transitionGroundYPx = AXIS_Y_PIXELS - transitionGroundElevationFt * PIXELS_PER_FOOT;

  // 3. Tree and Anchor Coordinates
  // Start and End X positions for trees/anchors are the same as ground X
  dwg.startAnchorXPx = MARGIN_PIXELS;
  dwg.endAnchorXPx = MARGIN_PIXELS + geo.runFt * PIXELS_PER_FOOT;

  // Anchor Y positions (based on their calculated heights above end ground)
  dwg.startAnchorYPx =
    AXIS_Y_PIXELS - geo.startAnchorElevationFt * PIXELS_PER_FOOT;
  dwg.endAnchorYPx = AXIS_Y_PIXELS - geo.endAnchorElevationFt * PIXELS_PER_FOOT;

  // Specific Y positions for drawing start tree components relative to start ground
  dwg.startAnchorAtEndGroundYPx = dwg.startAnchorYPx;
  dwg.startAnchorAtStartGroundYPx =
    dwg.startGroundYPx - geo.startAnchorAboveStartGroundFt * PIXELS_PER_FOOT;

  // 4. Sagging Cable Coordinates
  const sagPointRatioFromStart = (100 - geo.sagPointPercentFromEnd) / 100;
  dwg.sagPointXPx =
    dwg.startAnchorXPx + geo.runFt * sagPointRatioFromStart * PIXELS_PER_FOOT;

  dwg.cableHeightAtSagPointYPx =
    AXIS_Y_PIXELS - geo.cableHeightAtSagPointFt * PIXELS_PER_FOOT;
  dwg.sagPointYPx =
    dwg.cableHeightAtSagPointYPx +
    geo.sagFtFromCableAtSagPointFt * PIXELS_PER_FOOT;

  // 5. Seat Assembly and Clearance
  dwg.seatDropFt = geo.seatDropFt;
  dwg.clearanceFt = geo.clearanceFt;
  dwg.lowestClearanceYPx =
    AXIS_Y_PIXELS - geo.lowestClearanceAboveEndGroundFt * PIXELS_PER_FOOT;

  // 6. Label Positions and Values
  dwg.cableDropFt = geo.cableDropFt;
  dwg.sagFt = geo.sagFtFromCableAtSagPointFt;
  dwg.midCableElevationFt = geo.midCableElevationFt;

  dwg.midLineXPx =
    dwg.startAnchorXPx + (dwg.endAnchorXPx - dwg.startAnchorXPx) / 2;
  dwg.midLineYPx =
    AXIS_Y_PIXELS -
    ((geo.startAnchorElevationFt + geo.endAnchorElevationFt) / 2) *
      PIXELS_PER_FOOT;

  dwg.slopeDeltaFt = geo.slopeDeltaFt;

  dwg.labelStartAnchorAboveEndGroundFt = geo.startAnchorAboveEndGroundFt;
  dwg.labelStartAnchorAboveStartGroundFt = geo.startAnchorAboveStartGroundFt;
  dwg.labelEndAnchorAboveEndGroundFt = geo.endAnchorAboveEndGroundFt;
  dwg.labelEndAnchorHeightFromEndGroundFt = geo.endAnchorHeightFromEndGroundFt;

  return dwg;
}