import { createLine, createCircle, createText } from "./draw_utils.js";

export function drawCable(
  svg,
  startX,
  anchorStartY,
  endX,
  anchorEndY,
  runFeet,
  pixelsPerFoot,
  sagFeet = null,
  sagPointPercent = null
) {
  const fromStartPercent =
    sagPointPercent !== null ? 100 - sagPointPercent : 50;
  const sagX = startX + runFeet * (fromStartPercent / 100) * pixelsPerFoot;
  const anchorLineMidY = (anchorStartY + anchorEndY) / 2;
  const sagY = anchorLineMidY + (sagFeet ?? 0) * pixelsPerFoot;

  svg.appendChild(createLine(startX, anchorStartY, sagX, sagY, "black", 2));
  svg.appendChild(createLine(sagX, sagY, endX, anchorEndY, "black", 2));
  svg.appendChild(createCircle(sagX, sagY, 3, "red"));
  // Show the unsagged cable line for reference
  svg.appendChild(
    createLine(
      startX,
      anchorStartY,
      endX,
      anchorEndY,
      "#ccc", // light gray
      1 // thin line
    )
  );

  let label = "Cable Sag Point";
  if (sagFeet !== null && sagPointPercent !== null) {
    label += `\n${sagFeet.toFixed(1)} ft sag @ ${fromStartPercent.toFixed(
      1
    )}% from start`;
  }

  svg.appendChild(createText(sagX - 45, sagY - 25, label));
}
