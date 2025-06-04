import { drawAxes } from "./draw_axes.js";
import { drawCable } from "./draw_cable.js";
import { drawSeatAssembly, drawMidlineLabel } from "./draw_midline.js";
import { drawStartTree, drawEndTree } from "./draw_trees.js";
import { drawGround, labelGroundSlopeAtStart } from "./draw_ground.js";

export function drawZipline(geo) {
  const svg = document.getElementById("zipline-diagram");
  svg.innerHTML = "";

  const pixelsPerFoot = 10;
  const margin_pixels = 50;
  const svg_height_pixels = 300;
  const svg_width_pixels = geo.runFeet * pixelsPerFoot + margin_pixels * 2;

  svg.setAttribute("width", svg_width_pixels);
  svg.setAttribute("height", svg_height_pixels);

  const axisY_pixels = svg_height_pixels - margin_pixels;

  const startX_pixels = margin_pixels + geo.startXFt * pixelsPerFoot;
  const endX_pixels = margin_pixels + geo.endXFt * pixelsPerFoot;
  const midX_pixels = margin_pixels + geo.midXFt * pixelsPerFoot;

  const startGroundY_pixels = axisY_pixels - geo.startGroundElevationFt * pixelsPerFoot;
  const endGroundY_pixels = axisY_pixels - geo.endGroundElevationFt * pixelsPerFoot;
  const anchorStartY_pixels = axisY_pixels - geo.startAnchorElevationFt * pixelsPerFoot;
  const anchorEndY_pixels = axisY_pixels - geo.endAnchorElevationFt * pixelsPerFoot;
  const midY_pixels = axisY_pixels - geo.midCableElevationFt * pixelsPerFoot;

  console.log("Calculated Geometry (Feet):", geo);
  console.log("Transformed Pixels:", {
    startX_pixels,
    endX_pixels,
    midX_pixels,
    startGroundY_pixels,
    endGroundY_pixels,
    anchorStartY_pixels,
    anchorEndY_pixels,
    midY_pixels,
    axisY_pixels,
  });

  drawCable(
    svg,
    startX_pixels,
    anchorStartY_pixels,
    endX_pixels,
    anchorEndY_pixels,
    geo.runFeet,
    pixelsPerFoot,
    geo.sagFeet,
    geo.sagPointPercent,
    geo
  );

  const fromStartPercent = 100 - geo.sagPointPercent;
  const sagX_pixels = startX_pixels + geo.runFeet * (fromStartPercent / 100) * pixelsPerFoot;
  const sagAnchorY_pixels = (anchorStartY_pixels + anchorEndY_pixels) / 2;
  const sagY_pixels = sagAnchorY_pixels + geo.sagFeet * pixelsPerFoot;

  drawSeatAssembly(
    svg,
    sagX_pixels,
    sagY_pixels,
    geo.seatDropFeet,
    geo.clearanceFeet,
    pixelsPerFoot,
    geo.isSafe
  );

  drawMidlineLabel(
    geo.sagFeet,
    geo.seatDropFeet,
    geo.clearanceFeet,
    midY_pixels,
    svg,
    midX_pixels
  );

  drawGround(
    svg,
    startX_pixels,
    startGroundY_pixels,
    endX_pixels,
    axisY_pixels,
    geo.transitionPointRatio,
    geo.earlySlopeRatio
  );

  labelGroundSlopeAtStart(
    svg,
    startX_pixels,
    startGroundY_pixels,
    geo.slopeDeltaFeet
  );

  drawStartTree({
    svg,
    startX: startX_pixels,
    anchorStartY: anchorStartY_pixels,
    startGroundY: startGroundY_pixels,
    endGroundY: endGroundY_pixels,
    pixelsPerFoot: pixelsPerFoot,
    cableDropFeet: geo.cableDropFeet,
    sagFeet: geo.sagFeet,
    seatDropFeet: geo.seatDropFeet,
    clearanceFeet: geo.clearanceFeet,
    startAnchorAboveStartGroundFeet: geo.startAnchorAboveStartGroundFeet,
    startAnchorAboveEndGroundFeet: geo.startAnchorAboveEndGroundFeet,
  });

  drawEndTree({
    svg,
    endX: endX_pixels,
    axisY: axisY_pixels,
    anchorEndY: anchorEndY_pixels,
    cableDropFeet: geo.cableDropFeet,
    pixelsPerFoot: pixelsPerFoot,
    endAnchorAboveEndGroundFeet: geo.endAnchorAboveEndGroundFeet,
  });

  drawAxes(
    geo.runFeet,
    startX_pixels,
    pixelsPerFoot,
    svg,
    axisY_pixels,
    endX_pixels
  );
}
