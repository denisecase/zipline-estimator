// draw.js

import { calcDwg } from "./calc_dwg.js";

import { drawAxes } from "./draw_axes.js";
import { drawCable } from "./draw_cable.js";
import { drawSeatAssembly, drawMidlineLabel } from "./draw_midline.js";
import { drawStartTree, drawEndTree } from "./draw_trees.js";
import { drawGround, labelGroundSlopeAtStart } from "./draw_ground.js";
import {
  labelStartAnchorHeightAboveGroundEnd,
  labelStartAnchorHeightAboveGroundStart,
  labelStartAnchorToAnchorDelta,
  labelEndAnchorToAnchorDelta,
  labelEndAnchorHeight,
} from "./draw_tree_labels.js";
import { isCrashAtSagPoint } from "./calc_crash.js";
import { playBeep } from "./audio.js";

function playCrashSound() {
  playBeep(); // Fallback to a simple beep sound
}

/**
 * Draws the complete zipline diagram on an SVG canvas.
 * This function takes a pre-calculated 'geo' object and then uses 'calcDwg'
 * to convert it into pixel coordinates for drawing.
 * If any calculation or drawing step fails, it logs an error, plays a sound, and stops.
 *
 * @param {object} geo - The comprehensive geometry object returned by calcGeo,
 * containing all real-world (feet) measurements and elevations.
 */
export function drawZipline(geo) {
  console.log("drawZipline called with geo:", geo);
  const svg = document.getElementById("zipline-diagram");
  svg.innerHTML = ""; // Clear previous drawing

  // Step 1: Convert real-world geometry (geo) to pixel coordinates (dwg)
  let dwg;
  try {
    dwg = calcDwg(geo); 
    console.log("calcDwg completed successfully");
  } catch (err) {
    console.error("calcDwg failed:", err);
    playCrashSound();
    return; // Stop if pixel calculation fails
  }

  // Set SVG canvas dimensions using values from the dwg object
  svg.setAttribute("width", dwg.svgWidthPx);
  svg.setAttribute("height", dwg.svgHeightPx);

  // --- DRAW AXES ---
  try {
    drawAxes(
      geo.runFt, //  for axis labels/context 
      dwg.marginPx,
      dwg.pixelsPerFoot,
      svg,
      dwg.axisYPx,
      dwg.svgWidthPx - dwg.marginPx // The effective end X of drawable area
    );
    console.log("drawAxes completed successfully");
  } catch (err) {
    console.error("drawAxes failed:", err);
    playCrashSound();
    return;
  }

  // --- DRAW GROUND ---
  try {
    drawGround(
      svg,
      dwg.startGroundXPx,
      dwg.startGroundYPx,
      dwg.endGroundXPx,
      dwg.endGroundYPx,
      dwg.transitionGroundXPx, // Pass the pre-calculated X-pixel for the transition point
      dwg.transitionGroundYPx // Pass the pre-calculated Y-pixel for the transition point
    );
    console.log("drawGround completed successfully");
  } catch (err) {
    console.error("drawGround failed:", err);
    playCrashSound();
    return;
  }

  // --- DRAW TREES AND RELATED LABELS ---
  try {
    drawStartTree(
      svg,
      dwg.startAnchorXPx, // X-coordinate for the start tree
      dwg.startGroundYPx, // Y-coordinate of the start ground at the tree base
      dwg.endGroundYPx, // Y-coordinate of the end ground baseline (for relative drawing)
      dwg.startAnchorAtEndGroundYPx, // Y-coordinate of the start anchor relative to end ground
      dwg.startAnchorAtStartGroundYPx // Y-coordinate of the start anchor relative to start ground
    );
    console.log("drawStartTree completed successfully");

    // Label: Start Anchor height above End Ground
    labelStartAnchorHeightAboveGroundEnd(
      svg,
      dwg.startAnchorXPx,
      dwg.startAnchorYPx, // Primary anchor Y for consistent labeling position
      dwg.labelStartAnchorAboveEndGroundFt // Display the FT value (from geo, passed through dwg)
    );

    // Label: Start Anchor height above Start Ground
    labelStartAnchorHeightAboveGroundStart(
      svg,
      dwg.startAnchorXPx,
      dwg.startAnchorAtStartGroundYPx, // Specific Y for label relative to start ground
      dwg.labelStartAnchorAboveStartGroundFt // Display the FT value (from geo, passed through dwg)
    );

    // Label: Anchor delta (Start Anchor vs End Anchor)
    labelStartAnchorToAnchorDelta(
      svg,
      dwg.startAnchorXPx,
      dwg.startAnchorYPx, // Primary anchor Y
      dwg.cableDropFt // Display the FT value (from geo, passed through dwg)
    );
    console.log("Start tree labels completed successfully");
  } catch (err) {
    console.error("drawStartTree or related labels failed:", err);
    playCrashSound();
    return; 
  }

  try {
    drawEndTree(
      svg,
      dwg.endAnchorXPx, // X-coordinate for the end tree
      dwg.axisYPx, // Y-coordinate of the axis baseline (end ground is often here)
      dwg.endAnchorYPx // Y-coordinate for the end anchor
    );
    console.log("drawEndTree completed successfully");

    labelEndAnchorHeight(
      svg,
      dwg.endAnchorXPx,
      dwg.endAnchorYPx,
      dwg.labelEndAnchorHeightFromEndGroundFt.toFixed(1) // Display the FT value (from geo, passed through dwg)
    );

    labelEndAnchorToAnchorDelta(
      svg,
      dwg.endAnchorXPx,
      dwg.endAnchorYPx,
      dwg.cableDropFt // Display the FT value (from geo, passed through dwg)
    );
    console.log("End tree labels completed successfully");
  } catch (err) {
    console.error("drawEndTree or related labels failed:", err);
    playCrashSound();
    return; 
  }

  // --- DRAW SAGGING CABLE ---
  try {
    drawCable(
      svg,
      dwg.startAnchorXPx,
      dwg.startAnchorYPx,
      dwg.endAnchorXPx,
      dwg.endAnchorYPx,
      dwg.sagPointXPx,
      dwg.sagPointYPx,
      geo.sagFtFromCableAtSagPointFt, // Pass sagFt (from geo object)
      geo.sagPointPercentFromEnd, // Pass sagPointPercent (from geo object)
      geo.isSafe // Pass isSafe (from geo object)
    );
    console.log("drawCable completed successfully");
  } catch (err) {
    console.error("drawCable failed:", err);
    playCrashSound();
    return;
  }

  // --- DRAW SEAT ASSEMBLY ---
  try {
    drawSeatAssembly(
      svg,
      dwg.sagPointXPx,
      dwg.sagPointYPx,
      dwg.seatDropFt, //  internal scaling within drawSeatAssembly
      dwg.clearanceFt, //  internal scaling within drawSeatAssembly
      dwg.pixelsPerFoot //  internal scaling by drawSeatAssembly
    );
    console.log("drawSeatAssembly completed successfully");
  } catch (err) {
    console.error("drawSeatAssembly failed:", err);
    playCrashSound();
    return;
  }

  // --- DRAW MIDLINE LABEL ---
  try {
    drawMidlineLabel(
      dwg.sagFt, // Sag value (in ft) for label text
      dwg.seatDropFt, // Seat drop (in ft) for label text
      dwg.clearanceFt, // Clearance (in ft) for label text
      dwg.midLineYPx, // Midline Y pixel position
      svg,
      dwg.midLineXPx // Midline X pixel position
    );
    console.log("drawMidlineLabel completed successfully");
  } catch (err) {
    console.error("drawMidlineLabel failed:", err);
    playCrashSound();
    return;
  }

  // --- LABEL GROUND SLOPE ---
  try {
    labelGroundSlopeAtStart(
      svg,
      dwg.startGroundXPx,
      dwg.startGroundYPx,
      dwg.slopeDeltaFt // Slope delta (in ft) for label text
    );
    console.log("labelGroundSlopeAtStart completed successfully");
  } catch (err) {
    console.error("labelGroundSlopeAtStart failed:", err);
    playCrashSound();
    return;
  }

  // --- FINAL SAFETY CHECK ---
  // This check uses the 'geo' object directly as it operates on the physical/logical model,
  // not the visual representation. It does not stop drawing, but indicates an unsafe condition.
  geo.isSafe = !isCrashAtSagPoint(geo);
  if (!geo.isSafe) {
    console.warn("Safety check failed: A crash is detected at the sag point.");
    playCrashSound(); 
  }
}
