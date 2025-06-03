import { drawAxes } from "./draw_axes.js";
import { drawCable } from "./draw_cable.js";
import { drawSeatAssembly, drawMidlineLabel } from "./draw_midline.js";
import { drawStartTree, drawEndTree } from "./draw_trees.js";
import { drawGround, labelGroundSlopeAtStart } from "./draw_ground.js";

export function drawZipline({
  runFeet,
  slopeDeltaFeet,
  cableDropFeet,
  sagFeet,
  seatDropFeet,
  clearanceFeet,
}) {
  const svg = document.getElementById("zipline-diagram");
  svg.innerHTML = "";

  const pixelsPerFoot = 10;
  const margin_pixels = 50;
  const svg_height_pixels = 300;
  const svg_width_pixels = runFeet * pixelsPerFoot + margin_pixels * 2;

  svg.setAttribute("width", svg_width_pixels);
  svg.setAttribute("height", svg_height_pixels);

  const startX = margin_pixels;
  const endX = startX + runFeet * pixelsPerFoot;
  const axisY = svg_height_pixels - margin_pixels;

  // STEP 1: Base ground levels (before shifting)
  const rawGroundEndY = axisY;
  const rawGroundStartY = rawGroundEndY + slopeDeltaFeet * pixelsPerFoot;

  // STEP 2: Anchor positions (before shifting)
  const rawAnchorEndY = rawGroundEndY;
  const rawAnchorStartY = rawGroundStartY - cableDropFeet * pixelsPerFoot;

  // STEP 3: Cable midpoint (before shifting)
  const midX = (startX + endX) / 2;
  const rawMidY =
    (rawAnchorStartY + rawAnchorEndY) / 2 + sagFeet * pixelsPerFoot;

  // STEP 4: Compute vertical offset pixels to ensure seat clears ground
  const verticalOffset_pixels = computeVerticalOffset({
    groundStartY: rawGroundStartY,
    groundEndY: rawGroundEndY,
    cableDropFeet,
    sagFeet,
    seatDropFeet,
    clearanceFeet,
    pixelsPerFoot,
  });

  // STEP 5: Apply vertical offset (pixels)
  const startGroundY = rawGroundStartY - verticalOffset_pixels;
  const endGroundY = rawGroundEndY - verticalOffset_pixels;
  const anchorStartY = rawAnchorStartY - verticalOffset_pixels;
  const anchorEndY = rawAnchorEndY - verticalOffset_pixels;
  const midY = rawMidY - verticalOffset_pixels;

  // STEP 6: Anchor heights relative to ground (ft)
  const endAnchorAboveEndGroundFeet = ( anchorEndY) / pixelsPerFoot;
  console.log("End Anchor Height Above End Ground (ft):", endAnchorAboveEndGroundFeet);

  const startAnchorAboveEndGroundFeet =endAnchorAboveEndGroundFeet + cableDropFeet + sagFeet + seatDropFeet + clearanceFeet;
  console.log("Start Anchor Height Above End Ground (ft):", startAnchorAboveEndGroundFeet);     

  const startAnchorAboveStartGroundFeet =
    (anchorStartY - startGroundY) / pixelsPerFoot;    
  console.log("Start Anchor Height Above Start Ground (ft):", startAnchorAboveStartGroundFeet);


  drawCable(svg, startX, anchorStartY, midX, midY, endX, anchorEndY);
  drawSeatAssembly(svg, midX, midY, seatDropFeet, clearanceFeet, pixelsPerFoot);

  // Label total vertical drop at midpoint
  drawMidlineLabel(sagFeet, seatDropFeet, clearanceFeet, midY, svg, midX);

  drawGround(svg, startX, startGroundY, endX, axisY);
  labelGroundSlopeAtStart(svg, startX, startGroundY, slopeDeltaFeet);
 
  drawStartTree({
    svg,
    startX,
    anchorStartY,
    startGroundY,
    endGroundY,
    pixelsPerFoot,
    cableDropFeet,
    sagFeet,
    seatDropFeet,
    clearanceFeet,
    // startAnchorAboveStartGroundFeet,
    // startAnchorAboveEndGroundFeet,
  
  });

  drawEndTree({
    svg,
    endX,
    axisY,
    anchorEndY,
    cableDropFeet,
    pixelsPerFoot,
    endAnchorAboveEndGroundFeet,
  });

  drawAxes(runFeet, startX, pixelsPerFoot, svg, axisY, endX);
}

export function computeVerticalOffset({
  groundStartY,
  groundEndY,
  cableDropFeet,
  sagFeet,
  seatDropFeet,
  clearanceFeet,
  pixelsPerFoot,
}) {
  const anchorStartY = groundStartY - cableDropFeet * pixelsPerFoot;
  const anchorEndY = groundEndY;

  const midY = (anchorStartY + anchorEndY) / 2 + sagFeet * pixelsPerFoot;
  const seatBottomY =
    midY + seatDropFeet * pixelsPerFoot + clearanceFeet * pixelsPerFoot;

  const offset = seatBottomY - groundEndY; // Push everything up so bottom of seat clears ground
  return offset;
}
