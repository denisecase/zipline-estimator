import { createLine, createCircle, createText } from "./draw_utils.js";

const XOFFSET_START = 7;
const XOFFSET_END = 120;
const YOFFSET_HT = 20;
const YOFFSET_DELTA = 50;

export function getGroundStartY({ axisY }) {
  return axisY;
}

export function getAnchorStartY({ groundY, cableDropFeet, pixelsPerFoot }) {
  return groundY - cableDropFeet * pixelsPerFoot;
}

export function getTreeHeightFeet({
  groundY,
  anchorY,
  paddingFeet = 2,
  pixelsPerFoot,
}) {
  const anchorHeightFeet = (groundY - anchorY) / pixelsPerFoot;
  return anchorHeightFeet + paddingFeet;
}

export function computeTreeHeightFeet({
  cableDropFeet,
  sagFeet,
  seatDropFeet,
  clearanceFeet,
  slopeDeltaFeet = 0,
  paddingFeet = 2,
}) {
  const midlineDropFeet =
    cableDropFeet + sagFeet + seatDropFeet + clearanceFeet;
  const effectiveHeight = midlineDropFeet - slopeDeltaFeet;
  return effectiveHeight + paddingFeet;
}

export function drawTree({ svg, x, groundY, heightFeet, pixelsPerFoot }) {
  const treeTopY = groundY - heightFeet * pixelsPerFoot;
  svg.appendChild(createLine(x, groundY, x, treeTopY, "#654321", 6));
  svg.appendChild(createCircle(x, treeTopY, 10, "green"));
}

export function drawStartTree({
  svg,
  startX,
  anchorStartY,
  startGroundY,
  endGroundY,
  pixelsPerFoot,
  cableDropFeet,
  sagFeet,
  seatDropFeet,
  clearanceFeet,
  startAnchorAboveStartGroundFeet,
  startAnchorAboveEndGroundFeet,
}) {
  // Draw the tree trunk
  const trunkWidth = 10;
  const treeHeightFeet = computeTreeHeightFeet({
    cableDropFeet,
    sagFeet,
    seatDropFeet,
    clearanceFeet,
  });
  const treeHeightPixels = treeHeightFeet * pixelsPerFoot;
  const trunkBaseY = startGroundY;
  const trunkTopY = trunkBaseY - treeHeightPixels;

  const trunk = createLine(
    startX,
    trunkBaseY,
    startX,
    trunkTopY,
    "saddlebrown",
    trunkWidth
  );
  svg.appendChild(trunk);

  // Draw tree top
  svg.appendChild(createCircle(startX, trunkTopY, 10, "green"));

  // Label: Start Anchor height above End Ground
  labelStartAnchorHeightAboveGroundEnd(
    svg,
    startX,
    anchorStartY,
    startAnchorAboveEndGroundFeet
  );

  // Label: Start Anchor height above Start Ground
  labelStartAnchorHeightAboveGroundStart(
    svg,
    startX,
    anchorStartY,
    startAnchorAboveStartGroundFeet
  );

  // Label: Anchor delta (Start Anchor vs End Anchor)
  labelStartAnchorToAnchorDelta(svg, startX, anchorStartY, cableDropFeet);
}

function labelStartAnchorHeightAboveGroundEnd(
  svg,
  startX,
  anchorStartY,
  startAnchorAboveEndGroundFeet 
) {
  svg.appendChild(
    createText(
      startX + XOFFSET_START,
      anchorStartY - YOFFSET_HT,
      `Start Anchor = ${startAnchorAboveEndGroundFeet.toFixed(1)} ft above End Ground`
    )
  );
}

function labelStartAnchorHeightAboveGroundStart(
  svg,
  startX,
  anchorStartY,
  startAnchorAboveStartGroundFeet
) {
  svg.appendChild(
    createText(
      startX + XOFFSET_START,
      anchorStartY - YOFFSET_HT - 12,
      `Start Anchor = ${startAnchorAboveStartGroundFeet.toFixed(1)} ft above Start Ground`
    )
  );
}

function labelStartAnchorToAnchorDelta(
  svg,
  startX,
  anchorStartY,
  cableDropFeet
) {
  svg.appendChild(
    createText(
      startX + XOFFSET_START,
      anchorStartY - YOFFSET_DELTA,
      `Start Anchor=${cableDropFeet}ft above End Anchor`
    )
  );
}

export function drawEndTree({
  svg,
  endX,
  axisY,
  anchorEndY,
  cableDropFeet,
  pixelsPerFoot,
}) {
  const endAnchorAboveEndGroundFeet = (axisY - anchorEndY) / pixelsPerFoot;
  const treeHeightFeet = endAnchorAboveEndGroundFeet + 2;
  const treeHeightPixels = treeHeightFeet * pixelsPerFoot;
  const trunkBaseY = axisY;
  const trunkTopY = trunkBaseY - treeHeightPixels;

  // Trunk
  svg.appendChild(
    createLine(endX, trunkBaseY, endX, trunkTopY, "saddlebrown", 10)
  );
  // Tree top
  svg.appendChild(createCircle(endX, trunkTopY, 10, "green"));

  labelEndAnchorHeight(
    svg,
    endX,
    anchorEndY,
    endAnchorAboveEndGroundFeet.toFixed(1)
  );

  labelEndAnchorToAnchorDelta(svg, endX, anchorEndY, cableDropFeet);
}

function labelEndAnchorToAnchorDelta(svg, endX, anchorEndY, cableDropFeet) {
  svg.appendChild(
    createText(
      endX - XOFFSET_END,
      anchorEndY - YOFFSET_DELTA,
      `End Anchor=${cableDropFeet}ft below Start Anchor`
    )
  );
}

function labelEndAnchorHeight(svg, endX, anchorEndY, anchorHeightRounded) {
  svg.appendChild(
    createText(
      endX - XOFFSET_END,
      anchorEndY - YOFFSET_HT,
      `End Anchor=${anchorHeightRounded}ft above End Ground`
    )
  );
}
