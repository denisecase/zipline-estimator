import { createLine, createCircle, createText } from "./draw_utils.js";
import {
  isClearanceSafe,
  drawSafe,
  drawNotSafe,getCableColorBasedOnClearance
} from "./draw_midline.js";

/**
 * Draws the cable, sag line, and visual indicators for zipline safety.
 *
 * @param {SVGElement} svg - The SVG element to draw on.
 * @param {number} startX - X position of the start anchor.
 * @param {number} anchorStartY - Y position of the start anchor.
 * @param {number} endX - X position of the end anchor.
 * @param {number} anchorEndY - Y position of the end anchor.
 * @param {number} runFeet - Total horizontal run in feet.
 * @param {number} pixelsPerFoot - Scale factor.
 * @param {number|null} sagFeet - Vertical sag in feet.
 * @param {number|null} sagPointPercent - Percent from end anchor where sag occurs.
 * @param {object} geometry - Calculated geometry including bottomClearanceElevationFt.
 */
export function drawCable(
  svg,
  startX,
  anchorStartY,
  endX,
  anchorEndY,
  runFeet,
  pixelsPerFoot,
  sagFeet = null,
  sagPointPercent = null,
  geometry = null
) {
  const fromStartPercent =
    sagPointPercent !== null ? 100 - sagPointPercent : 50;

  const sagX = startX + runFeet * (fromStartPercent / 100) * pixelsPerFoot;
  const anchorLineMidY = (anchorStartY + anchorEndY) / 2;
  const sagY = anchorLineMidY + (sagFeet ?? 0) * pixelsPerFoot;

  // Determine color based on safety, default to black
  const cableColor = getCableColorBasedOnClearance(geometry, svg, sagX, sagY);

  // Draw actual sagging cable
  svg.appendChild(createLine(startX, anchorStartY, sagX, sagY, cableColor, 2));
  svg.appendChild(createLine(sagX, sagY, endX, anchorEndY, cableColor, 2));
  svg.appendChild(createCircle(sagX, sagY, 3, "red"));

  // Draw dashed un-sagged reference line
  svg.appendChild(
    createLine(startX, anchorStartY, endX, anchorEndY, "#ccc", 1)
  );

  // Annotate
  let label = "Cable Sag Point";
  if (sagFeet !== null && sagPointPercent !== null) {
    label += `\n${sagFeet.toFixed(1)} ft sag @ ${fromStartPercent.toFixed(1)}% from start`;
  }

  svg.appendChild(createText(sagX - 45, sagY - 25, label));
}

