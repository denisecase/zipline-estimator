// app_controller.js
import { drawAxes } from "./draw_axes.js";
import { drawCable } from "./draw_cable.js";
import { drawSeatAssembly, drawMidlineLabel } from "./draw_midline.js";
import { drawStartTree, drawEndTree } from "./draw_trees.js";
import { drawGround, labelGroundSlopeAtStart } from "./draw_ground.js";
import { calculateZiplineGeometry } from "./calcs.js";

export function drawZipline({
  runFeet,
  slopeDeltaFeet,
  cableDropFeet,
  sagFeet,
  sagPointPercent,
  seatDropFeet,
  clearanceFeet,
  initialEndAnchorHeightFeet,
  initialStartAnchorHeightFeet,
  transitionPointRatio,
  earlySlopeRatio,
}) {
  const svg = document.getElementById("zipline-diagram");
  svg.innerHTML = "";

  // --- Step 1: Calculate ALL Zipline Geometry in Feet ---
  const ziplineGeometry = calculateZiplineGeometry({
    runFeet,
    slopeDeltaFeet,
    cableDropFeet,
    sagFeet,
    sagPointPercent,
    seatDropFeet,
    clearanceFeet,
    initialEndAnchorHeightFeet,
  });

  // --- Step 2: Define UI/Drawing Parameters (still mixed for now, can be separated later) ---
  const pixelsPerFoot = 10;
  const margin_pixels = 50;
  const svg_height_pixels = 300;
  const svg_width_pixels = runFeet * pixelsPerFoot + margin_pixels * 2; // Derived from runFeet

  svg.setAttribute("width", svg_width_pixels);
  svg.setAttribute("height", svg_height_pixels);

  // --- Step 3: Convert Real-World Feet to SVG Pixel Coordinates ---
  // This is where the core transformation happens.
  // Y-coordinates in SVG increase downwards, so higher elevations in feet correspond to smaller Y-pixel values.
  const axisY_pixels = svg_height_pixels - margin_pixels; // Our baseline for ground level (visually)

  const startX_pixels =
    margin_pixels + ziplineGeometry.startXFt * pixelsPerFoot;
  const endX_pixels = margin_pixels + ziplineGeometry.endXFt * pixelsPerFoot;
  const midX_pixels = margin_pixels + ziplineGeometry.midXFt * pixelsPerFoot;

  const startGroundY_pixels =
    axisY_pixels - ziplineGeometry.StartGroundElevationFt * pixelsPerFoot;
  const endGroundY_pixels =
    axisY_pixels - ziplineGeometry.EndGroundElevationFt * pixelsPerFoot;
  const anchorStartY_pixels =
    axisY_pixels - ziplineGeometry.startAnchorElevationFt * pixelsPerFoot;
  const anchorEndY_pixels =
    axisY_pixels - ziplineGeometry.endAnchorElevationFt * pixelsPerFoot;
  const midY_pixels =
    axisY_pixels - ziplineGeometry.midCableElevationFt * pixelsPerFoot;

  // --- Step 4: Pass Pixel Coordinates and Feet Labels to Drawing Functions ---

  // Console logging the final values for debugging/verification
  console.log("Calculated Geometry (Feet):", ziplineGeometry);
  console.log("Transformed Pixels:", {
    startX_pixels,
    endX_pixels,
    midX_pixels,
    startGroundY_pixels,
    endGroundY_pixels,
    anchorStartY_pixels,
    anchorEndY_pixels,
    midY_pixels,
    axisY_pixels,
  });

  drawCable(
    svg,
    startX_pixels,
    anchorStartY_pixels,
    endX_pixels,
    anchorEndY_pixels,
    runFeet,
    pixelsPerFoot,
    ziplineGeometry.sagFeet,
    ziplineGeometry.sagPointPercent
  );

  const fromStartPercent = 100 - sagPointPercent;
  const sagX_pixels =
    startX_pixels + runFeet * (fromStartPercent / 100) * pixelsPerFoot;
  const sagAnchorY_pixels = (anchorStartY_pixels + anchorEndY_pixels) / 2;
  const sagY_pixels = sagAnchorY_pixels + sagFeet * pixelsPerFoot;

  drawSeatAssembly(
    svg,
    sagX_pixels,
    sagY_pixels,
    seatDropFeet,
    clearanceFeet,
    pixelsPerFoot
  );

  // Label total vertical drop at midpoint
  drawMidlineLabel(
    sagFeet,
    seatDropFeet,
    clearanceFeet,
    midY_pixels,
    svg,
    midX_pixels
  );

  drawGround(
    svg,
    startX_pixels,
    startGroundY_pixels,
    endX_pixels,
    axisY_pixels,
    transitionPointRatio,
    earlySlopeRatio
  );

  labelGroundSlopeAtStart(
    svg,
    startX_pixels,
    startGroundY_pixels,
    slopeDeltaFeet
  );

  drawStartTree({
    svg,
    startX: startX_pixels,
    anchorStartY: anchorStartY_pixels,
    startGroundY: startGroundY_pixels,
    endGroundY: endGroundY_pixels,
    pixelsPerFoot: pixelsPerFoot, // Pass pixelsPerFoot for internal tree height calculation and text sizing
    cableDropFeet: ziplineGeometry.cableDropFeet, // Original input parameter for the delta label
    sagFeet: ziplineGeometry.sagFeet, // Still needed for tree height calculation
    seatDropFeet: ziplineGeometry.seatDropFeet, // Still needed for tree height calculation
    clearanceFeet: ziplineGeometry.clearanceFeet, // Still needed for tree height calculation
    startAnchorAboveStartGroundFeet:
      ziplineGeometry.startAnchorAboveStartGroundFeet,
    startAnchorAboveEndGroundFeet:
      ziplineGeometry.startAnchorAboveEndGroundFeet,
  });

  drawEndTree({
    svg,
    endX: endX_pixels,
    axisY: axisY_pixels, // This is the end ground's baseline Y for the axis
    anchorEndY: anchorEndY_pixels,
    cableDropFeet: ziplineGeometry.cableDropFeet, // Original input parameter for the delta label
    pixelsPerFoot: pixelsPerFoot,
    endAnchorAboveEndGroundFeet: ziplineGeometry.endAnchorAboveEndGroundFeet, // Correct value
  });

  drawAxes(
    runFeet,
    startX_pixels,
    pixelsPerFoot,
    svg,
    axisY_pixels,
    endX_pixels
  ); // runFeet is in feet, but drawAxes will use pixelsPerFoot for its internal tick calculations.
}
