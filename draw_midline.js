// draw_midline.js
import { createLine, createCircle, createText, createRect } from "./draw_utils.js"; // Ensure createRect is imported

/**
 * Draws the seat assembly hanging below the sag point.
 *
 * @param {SVGElement} svg - SVG element to draw on.
 * @param {number} sagX - X coordinate of the cable sag point (in pixels).
 * @param {number} sagY - Y coordinate of the cable sag point (in pixels).
 * @param {number} seatDropFt - Distance from cable to seat (in feet).
 * @param {number} clearanceFt - Distance from seat bottom to ground (in feet).
 * @param {number} pixelsPerFoot - Scale used for vertical drawing.
 */
export function drawSeatAssembly(
  svg,
  sagX,
  sagY,
  seatDropFt,
  clearanceFt,
  pixelsPerFoot
) {
  console.log(
    "drawSeatAssembly called with:",
    sagX,
    sagY,
    seatDropFt,
    clearanceFt,
    pixelsPerFoot
  );

  // Define dimensions in pixels
  const ropeHeightPixels = seatDropFt * pixelsPerFoot;
  const clearanceHeightPixels = clearanceFt * pixelsPerFoot;
  const seatWidthPixels = 10; // Fixed pixel width for the seat
  const seatHeightPixels = 2; // Fixed pixel height for the seat

  // Define consistent width for rope and clearance rectangles
  const verticalElementWidth = 4; // Width for rope and clearance rects

  // Calculate Y-coordinates for the elements
  const ropeTopY = sagY;
  const ropeBottomY = sagY + ropeHeightPixels;

  const seatTopY = ropeBottomY; // Seat starts immediately below the rope
  const seatBottomY = seatTopY + seatHeightPixels;

  const clearanceTopY = seatBottomY; // Clearance starts immediately below the seat
  const clearanceBottomY = clearanceTopY + clearanceHeightPixels;

  // --- Draw Rope (Orange Rectangle) ---
  svg.appendChild(
    createRect(
      sagX - verticalElementWidth / 2, // Center the rope rectangle
      ropeTopY,
      verticalElementWidth,
      ropeHeightPixels,
      "orange"
    )
  );
  svg.appendChild(
    createText(sagX + 6, ropeTopY + ropeHeightPixels / 2, `Rope (${seatDropFt.toFixed(1)} ft)`)
  );

  // --- Draw Seat (Blue Rectangle) ---
  svg.appendChild(
    createRect(
      sagX - seatWidthPixels / 2, // Center the seat rectangle
      seatTopY,
      seatWidthPixels,
      seatHeightPixels,
      "blue"
    )
  );

  // --- Draw Clearance (Light Gray Vertical Rectangle) ---
  svg.appendChild(
    createRect(
      sagX - verticalElementWidth / 2, // Center the clearance rectangle
      clearanceTopY,
      verticalElementWidth,
      clearanceHeightPixels,
      "lightgray"
    )
  );
  svg.appendChild(
    createText(sagX + 6, clearanceTopY + clearanceHeightPixels / 2, `Clearance (${clearanceFt.toFixed(1)} ft)`)
  );
}

// Adds a summary label showing sag + rope + clearance
export function drawMidlineLabel(
  sagFt,
  seatDropFt,
  clearanceFt,
  midLineYPx,
  svg,
  midLineXPx
) {
  const totalDropFt = sagFt + seatDropFt + clearanceFt;
  const totalDropText = `Max Drop = ${totalDropFt.toFixed(1)} ft (Sag: ${sagFt.toFixed(1)}ft + Rope: ${seatDropFt.toFixed(1)}ft + Clr: ${clearanceFt.toFixed(1)}ft)`;

  svg.appendChild(createText(midLineXPx - 45, midLineYPx - 40, totalDropText));
}