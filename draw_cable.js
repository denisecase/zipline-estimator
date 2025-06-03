
import { createLine, createCircle, createText } from "./draw_utils.js";

export function drawCable(
  svg,
  startX,
  anchorStartY,
  midX,
  midY,
  endX,
  anchorEndY
) {
  svg.appendChild(createLine(startX, anchorStartY, midX, midY, "black", 2));
  svg.appendChild(createLine(midX, midY, endX, anchorEndY, "black", 2));
  svg.appendChild(createCircle(midX, midY, 3, "red"));
  svg.appendChild(createText(midX, midY - 20, "Cable Sag Point"));
}

