// draw_midline.js
import { createRect, createText } from "./draw_utils.js";



//Draw three vertical/horizontal rectangles:
//1. Orange vertical bar = rope from cable to seat
//2. Blue horizontal bar = seat (1 ft wide × 2 in tall)
//3. Gray vertical bar = seat clearance to ground

export function drawSeatAssembly(
  svg,
  midX,
  midY,
  seatDropFeet,
  clearanceFeet,
  pixelsPerFoot
) {
  const seatX = midX;
  const ropeHeight = seatDropFeet * pixelsPerFoot;
  const clearanceHeight = clearanceFeet * pixelsPerFoot;
  const seatY = midY + ropeHeight;
  const seatWidth = 10; // 1 foot
  const seatHeight = 2; // ~2 inches

  console.log("drawSeatAssembly values", {
  midY,
  seatDropFeet,
  clearanceFeet,
  ropeHeight,
  seatHeight,
  clearanceHeight,
  totalHeight: ropeHeight + seatHeight + clearanceHeight
});

  // 1. Rope (orange vertical rect from cable to seat)
  svg.appendChild(createRect(seatX - 2, midY, 4, ropeHeight, "orange"));
  svg.appendChild(createText(seatX + 6, seatY - 10, `Rope (${seatDropFeet }ft)`));

  // 2. Seat (blue horizontal 1ft × 2in)

  svg.appendChild(
    createRect(
      seatX - seatWidth / 2,
      seatY - seatHeight,
      seatWidth,
      seatHeight,
      "blue"
    )
  );

  // 3. Clearance (gray vertical rect from seat to ground)
  svg.appendChild(
    createRect(seatX - 2, seatY, 4, clearanceHeight, "lightgray")
  );

  // 4. Label
  svg.appendChild(createText(seatX + 6, seatY + 10, `Seat Clearance (${clearanceFeet }ft)`));
}

export function drawMidlineLabel(
  sagFeet,
  seatDropFeet,
  clearanceFeet,
  midY,
  svg,
  midX
) {
  const totalDropFeet = sagFeet + seatDropFeet + clearanceFeet;
  const totalDropText = `Midline Drop = ${totalDropFeet.toFixed(1)} ft = sag (${sagFeet.toFixed(1)}) + rope (${seatDropFeet.toFixed(1)}) + clearance (${clearanceFeet.toFixed(1)})`;
  svg.appendChild(createText(midX-100, midY - 40, totalDropText));
}