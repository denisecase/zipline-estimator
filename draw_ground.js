import { createLine, createText } from "./draw_utils.js";

export function drawGround(
  svg,
  startX_pixels,
  startGroundY_pixels,
  endX_pixels,
  axisY_pixels,
  transitionPointRatio,
  earlySlopeRatio
) {
  console.log(
    "drawGround called with:",
    startX_pixels,
    startGroundY_pixels,
    endX_pixels,
    axisY_pixels,
    transitionPointRatio,
    earlySlopeRatio
  );

  // Total horizontal and vertical differences
  const runPixels = endX_pixels - startX_pixels;
  const totalDropPixels = axisY_pixels - startGroundY_pixels;
  console.log("runPixels, totalDropPixels", runPixels, totalDropPixels);

  // Calculate the transition point based on the ratios
  // X of transition point (horizontal position)
  const transitionX = startX_pixels + (transitionPointRatio / 100) * runPixels;
  console.log("transitionX", transitionX);

  // Y of transition point (vertical position)
  const transitionY =
    startGroundY_pixels + (earlySlopeRatio / 100) * totalDropPixels;

  if (transitionX > endX_pixels) {
    console.warn("transitionX exceeds diagram width — clamping to endX");
  }

  // Draw first ground slope
  svg.appendChild(
    createLine(
      startX_pixels,
      startGroundY_pixels,
      transitionX,
      transitionY,
      "brown"
    )
  );

  // Draw second ground slope
  svg.appendChild(
    createLine(transitionX, transitionY, endX_pixels, axisY_pixels, "brown")
  );
}

export function labelGroundSlopeAtStart(
  svg,
  startX,
  startGroundY,
  slopeDeltaFeet
) {
  const XOFFSET_START = 5;
  const label = `Start Ground = ${slopeDeltaFeet.toFixed(1)} ft above End`;
  svg.appendChild(createText(startX + XOFFSET_START, startGroundY - 5, label));
}
