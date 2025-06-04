// draw_midline.js
import { createRect, createText } from "./draw_utils.js";

//Draw three vertical/horizontal rectangles:
//1. Orange vertical bar = rope from cable to seat
//2. Blue horizontal bar = seat (1 ft wide × 2 in tall)
//3. Gray vertical bar = seat clearance to ground

export function drawSeatAssembly(
  svg,
  sagX_pixels,
  sagY_pixels,
  seatDropFeet,
  clearanceFeet,
  pixelsPerFoot
) {
  console.log("Seat Assembly Inputs:", {
    sagX_pixels,
    sagY_pixels,
    seatDropFeet,
    clearanceFeet,
    pixelsPerFoot,
  });

  const ropeHeight = seatDropFeet * pixelsPerFoot;
  const clearanceHeight = clearanceFeet * pixelsPerFoot;
  const seatY = sagY_pixels + ropeHeight;
  const seatWidth = 10; // 1 foot
  const seatHeight = 2; // ~2 inches

  console.log("drawSeatAssembly values", {
    sagY_pixels,
    seatDropFeet,
    clearanceFeet,
    ropeHeight,
    seatHeight,
    clearanceHeight,
    totalHeight: ropeHeight + seatHeight + clearanceHeight,
  });

  // 1. Rope (orange vertical rect from cable to seat)
  svg.appendChild(createRect(sagX_pixels - 2, sagY_pixels, 4, ropeHeight, "orange"));
  svg.appendChild(
    createText(sagX_pixels + 6, seatY - 10, `Rope (${seatDropFeet} ft)`)
  );

  // 2. Seat (blue horizontal 1ft × 2in)
  svg.appendChild(
    createRect(
      sagX_pixels - seatWidth / 2,
      seatY - seatHeight,
      seatWidth,
      seatHeight,
      "blue"
    )
  );

  // 3. Clearance (gray vertical rect from seat to ground)
  svg.appendChild(
    createRect(sagX_pixels - 2, seatY, 4, clearanceHeight, "lightgray")
  );

  // 4. Label
  svg.appendChild(
    createText(sagX_pixels + 6, seatY + 10, `Seat Clearance (${clearanceFeet} ft)`)
  );
}


// Adds a summary label showing sag + rope + clearance
export function drawMidlineLabel(
  sagFeet,
  seatDropFeet,
  clearanceFeet,
  midY,
  svg,
  midX
) {
  const totalDropFeet = sagFeet + seatDropFeet + clearanceFeet;
  const totalDropText = `Max=${totalDropFeet.toFixed(
    1
  )} ft = sag (${sagFeet.toFixed(1)}) + rope (${seatDropFeet.toFixed(
    1
  )}) + clearance (${clearanceFeet.toFixed(1)})`;
  svg.appendChild(createText(midX - 45, midY - 40, totalDropText));
}

// Logical check: Is the bottom of the rider assembly above the ground?
export function isClearanceSafe(
  bottomClearanceElevationFt,
  minGroundElevationFt
) {
  return bottomClearanceElevationFt >= minGroundElevationFt;
}

