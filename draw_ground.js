// draw_ground.js

import { createLine, createText } from "./draw_utils.js";

const GROUND_COLOR = "green";

export function drawGround(
  svg,
  startGroundXPx,      // dwg.startGroundXPx
  startGroundYPx,      // dwg.startGroundYPx
  endGroundXPx,        // dwg.endGroundXPx
  endGroundYPx,        // dwg.endGroundYPx
  transitionGroundXPx, // dwg.transitionGroundXPx
  transitionGroundYPx  // dwg.transitionGroundYPx
) {
  console.log(
    "drawGround called with:",
    startGroundXPx,
    startGroundYPx,
    endGroundXPx,
    endGroundYPx,
    transitionGroundXPx,
    transitionGroundYPx
  );

  // Draw first ground slope segment
  svg.appendChild(
    createLine(
      startGroundXPx,
      startGroundYPx,
      transitionGroundXPx, // Use pre-calculated X
      transitionGroundYPx, // Use pre-calculated Y
      GROUND_COLOR
    )
  );

  // Draw second ground slope segment
  svg.appendChild(
    createLine(
      transitionGroundXPx, // Start from transition point
      transitionGroundYPx, // Start from transition point
      endGroundXPx,
      endGroundYPx,
      GROUND_COLOR
    )
  );
}

export function labelGroundSlopeAtStart(
  svg,
  startX,
  startGroundY,
  slopeDeltaFt
) {
  const XOFFSET_START = 5;
  const label = `Start Ground = ${slopeDeltaFt.toFixed(1)} ft above End`;
  svg.appendChild(createText(startX + XOFFSET_START, startGroundY - 5, label));
}