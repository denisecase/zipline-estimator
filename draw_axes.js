import { createLine, createCircle, createText } from "./draw_utils.js";

// --- Constants ---
const AXIS_COLOR = "#333";
const AXIS_STROKE_WIDTH = 1;
const HORIZONTAL_TICK_LENGTH = 5;
const HORIZONTAL_TICK_LABEL_OFFSET_Y = 18;
const HORIZONTAL_TICK_LABEL_OFFSET_X = 6;
const HORIZONTAL_TICK_INTERVAL_FEET = 10; // Major ticks every 10 feet
const VERTICAL_AXIS_LABEL_OFFSET_Y = 10;
const VERTICAL_MAJOR_TICK_LENGTH = 5;
const VERTICAL_MINOR_TICK_LENGTH = 5;
const VERTICAL_MAJOR_TICK_LABEL_OFFSET_X = 30;
const VERTICAL_MAJOR_TICK_LABEL_OFFSET_Y = 4;
const DEFAULT_MAX_HEIGHT_FEET = 40;
const DEFAULT_VERTICAL_MAJOR_TICK_INTERVAL = 10;
const DEFAULT_VERTICAL_MINOR_TICK_INTERVAL = 2;
const VERTICAL_AXIS_LABEL_TEXT = "Elevation";

function drawHorizontalAxis(svg, startX, axisY, endX, runFeet, pixelsPerFoot) {
  svg.appendChild(createLine(startX, axisY, endX, axisY, AXIS_COLOR, AXIS_STROKE_WIDTH));

  const numTicks = Math.floor(runFeet / HORIZONTAL_TICK_INTERVAL_FEET);
  for (let i = 0; i <= numTicks; i++) {
    const tickX = startX + i * HORIZONTAL_TICK_INTERVAL_FEET * pixelsPerFoot;
    svg.appendChild(createLine(tickX, axisY, tickX, axisY + HORIZONTAL_TICK_LENGTH, AXIS_COLOR, AXIS_STROKE_WIDTH));
    svg.appendChild(createText(tickX - HORIZONTAL_TICK_LABEL_OFFSET_X, axisY + HORIZONTAL_TICK_LABEL_OFFSET_Y, `${i * HORIZONTAL_TICK_INTERVAL_FEET}`));
  }
}

function drawVerticalAxis({
  svg,
  x,
  axisY,
  maxHeightFeet = DEFAULT_MAX_HEIGHT_FEET,
  pixelsPerFoot,
  label = VERTICAL_AXIS_LABEL_TEXT,
  majorTickInterval = DEFAULT_VERTICAL_MAJOR_TICK_INTERVAL,
  minorTickInterval = DEFAULT_VERTICAL_MINOR_TICK_INTERVAL,
}) {
  const axisTopY = axisY - maxHeightFeet * pixelsPerFoot;

  // Draw main vertical line
  svg.appendChild(createLine(x, axisY, x, axisTopY, AXIS_COLOR, AXIS_STROKE_WIDTH));

  for (let ft = 0; ft <= maxHeightFeet; ft += minorTickInterval) {
    const y = axisY - ft * pixelsPerFoot;
    const isMajor = ft % majorTickInterval === 0;
    const tickLength = isMajor ? VERTICAL_MAJOR_TICK_LENGTH : VERTICAL_MINOR_TICK_LENGTH;
    svg.appendChild(createLine(x - tickLength, y, x, y, AXIS_COLOR, AXIS_STROKE_WIDTH));
    if (isMajor) {
      svg.appendChild(createText(x - VERTICAL_MAJOR_TICK_LABEL_OFFSET_X, y + VERTICAL_MAJOR_TICK_LABEL_OFFSET_Y, `${ft} ft`));
    }
  }
  svg.appendChild(createText(x - 40, axisTopY - VERTICAL_AXIS_LABEL_OFFSET_Y, label));
}

export function drawAxes(runFeet, startX, pixelsPerFoot, svg, axisY, endX) {

  // Horizontal axis (ground level at the END of the run)
  drawHorizontalAxis(svg, startX, axisY, endX, runFeet, pixelsPerFoot);

  // Vertical axis on left (start)
  drawVerticalAxis({
    svg,
    x: startX,
    axisY,
    maxHeightFeet: 40,
    pixelsPerFoot,
    majorTickInterval: 10,
    minorTickInterval: 2,
  });

   // Vertical axis on right (end)
  drawVerticalAxis({
    svg,
    x: endX,
    axisY,
    maxHeightFeet: 40,
    pixelsPerFoot,
    majorTickInterval: 10,
    minorTickInterval: 2,
  });
}
