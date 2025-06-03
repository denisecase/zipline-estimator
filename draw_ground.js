import { createLine, createText } from "./draw_utils.js";

export function drawGround(
    svg,
    startX,
    startGroundY,
    endX,
    axisY
) {
  svg.appendChild(
    createLine(startX, startGroundY, endX, axisY, "brown")
  );
}

export function labelGroundSlopeAtStart(
    svg,
    startX,
    startGroundY,
    slopeDeltaFeet
) {
  const XOFFSET_START = 5;
  const label = `Start Ground=${slopeDeltaFeet.toFixed(1)}ft above End Ground`;
  svg.appendChild(createText(startX + XOFFSET_START, startGroundY - 5, label));
}
