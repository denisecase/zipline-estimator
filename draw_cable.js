// draw_cable.js
import { createLine, createCircle, createText } from "./draw_utils.js";
import { playBeep } from "./audio.js"; // Assuming playBeep is in audio.js for playCrashSound

const CABLE_COLOR_SAFE = "black";
const CABLE_COLOR_UNSAFE = "red";
const CABLE_THICKNESS = 2; // Consistent thickness

/**
 * Draws a zipline cable with optional sag.
 *
 * @param {SVGElement} svg - SVG element to draw on.
 * @param {number} startX - X position of the start anchor (in pixels).
 * @param {number} startY - Y position of the start anchor (in pixels).
 * @param {number} endX - X position of the end anchor (in pixels).
 * @param {number} endY - Y position of the end anchor (in pixels).
 * @param {number|null} sagX - X position of sag point (in pixels), or null if no sag.
 * @param {number|null} sagY - Y position of sag point (in pixels), or null if no sag.
 * @param {number} sagFt - The calculated sag amount in feet. // NEW PARAMETER
 * @param {number} sagPointPercentFromStart - The sag point's position as a percentage from the start. // NEW PARAMETER
 * @param {boolean} isSafe - Whether the ride is considered safe. // Existing parameter, but ensure it's passed
 */
export function drawCable(
  svg,
  startX,
  startY,
  endX,
  endY,
  sagX = null,
  sagY = null,
  sagFt, // Expecting this now
  sagPointPercentFromStart, // Expecting this now
  isSafe = true // Ensure this is handled
) {
  console.log(
    "drawCable called with:",
    { startX, startY, endX, endY, sagX, sagY, sagFt, sagPointPercentFromStart, isSafe }
  );

  const cableColor = isSafe ? CABLE_COLOR_SAFE : CABLE_COLOR_UNSAFE;

  // The "Not Safe" label and sound should only trigger if `isSafe` is false
  if (!isSafe) {
    drawNotSafe(svg, sagX ?? (startX + endX) / 2, sagY ?? (startY + endY) / 2);
  }

  if (sagX !== null && sagY !== null) {
    // Draw sagging cable in two segments
    svg.appendChild(createLine(startX, startY, sagX, sagY, cableColor, CABLE_THICKNESS));
    svg.appendChild(createLine(sagX, sagY, endX, endY, cableColor, CABLE_THICKNESS));
    // Draw a small red circle at the sag point
    svg.appendChild(createCircle(sagX, sagY, 3, "red"));

    // Annotate the sag point with its value and position
    let label = "Cable Sag Point";
    // Check if sagFt and sagPointPercentFromStart are valid numbers before using toFixed
    if (typeof sagFt === 'number' && typeof sagPointPercentFromStart === 'number') {
      label += `\n(${sagFt.toFixed(1)} ft sag @ ${sagPointPercentFromStart.toFixed(1)}% from start)`;
    }

    // Position the label slightly above and to the left of the sag point
    svg.appendChild(createText(sagX - 45, sagY - 25, label));
  } else {
    // Draw straight cable if no sag point is provided
    svg.appendChild(createLine(startX, startY, endX, endY, cableColor, CABLE_THICKNESS));
  }

  // Draw a dashed reference line representing a straight line between anchors
  // This helps visualize the sag
  svg.appendChild(createLine(startX, startY, endX, endY, "#ccc", 1, [4, 4]));
}

// --- Helper functions ---

// Adds a red warning label and plays a crash sound
export function drawNotSafe(svg, midX, midY) {
  svg.appendChild(createText(midX - 20, midY - 100, "⚠ DANGER! Not Safe!", 10, CABLE_COLOR_UNSAFE));
  playCrashSound(); 
}

// Ensure playBeep is correctly imported for playCrashSound or define it here
// if it's a local helper for this file.
function playCrashSound() {
  playBeep();
}