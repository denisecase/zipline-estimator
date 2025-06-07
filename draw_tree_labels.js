// draw_tree_labels.js
import { createText } from "./draw_utils.js";

const XOFFSET_START = 7;
const XOFFSET_END = 120; 
const YOFFSET_HT = 20;
const YOFFSET_DELTA = 50;

/**
 * Labels the height of the start anchor relative to the end ground baseline.
 * @param {SVGElement} svg - The SVG container to draw on.
 * @param {number} startAnchorXPx - X pixel coordinate for the label's position.
 * @param {number} startAnchorYPx - Y pixel coordinate for the label's position.
 * @param {number} startAnchorAboveEndGroundFt - The height value in feet to display.
 */
export function labelStartAnchorHeightAboveGroundEnd(
  svg,
  startAnchorXPx,
  startAnchorYPx, // Renamed for clarity: this is the primary Y of the start anchor.
  startAnchorAboveEndGroundFt
) {
  svg.appendChild(
    createText(
      startAnchorXPx + XOFFSET_START,
      startAnchorYPx - YOFFSET_HT,
      `(Start Anchor=${startAnchorAboveEndGroundFt.toFixed(1)}ft above End Ground)`
    )
  );
}

/**
 * Labels the height of the start anchor relative to the start ground level.
 * @param {SVGElement} svg - The SVG container to draw on.
 * @param {number} startAnchorXPx - X pixel coordinate for the label's position.
 * @param {number} startAnchorAtStartGroundYPx - Y pixel coordinate for the label's position, specifically relative to start ground.
 * @param {number} startAnchorAboveStartGroundFt - The height value in feet to display.
 */
export function labelStartAnchorHeightAboveGroundStart(
  svg,
  startAnchorXPx,
  startAnchorAtStartGroundYPx, // Renamed to reflect its specific meaning from dwg.
  startAnchorAboveStartGroundFt
) {
  svg.appendChild(
    createText(
      startAnchorXPx + XOFFSET_START,
      startAnchorAtStartGroundYPx - YOFFSET_HT - 12, // Adjusted Y for stacking labels.
      `Start Anchor = ${startAnchorAboveStartGroundFt.toFixed(1)} ft above Start Ground`
    )
  );
}

/**
 * Labels the vertical difference between the start and end anchors (cable drop).
 * @param {SVGElement} svg - The SVG container to draw on.
 * @param {number} startAnchorXPx - X pixel coordinate for the label's position.
 * @param {number} startAnchorYPx - Y pixel coordinate for the label's position.
 * @param {number} cableDropFt - The vertical drop value in feet to display.
 */
export function labelStartAnchorToAnchorDelta(svg, startAnchorXPx, startAnchorYPx, cableDropFt) {
  let labelText;
  if (cableDropFt > 0) {
    labelText = `Start Anchor ${cableDropFt.toFixed(1)}ft above End Anchor`;
  } else if (cableDropFt < 0) {
    labelText = `Start Anchor ${Math.abs(cableDropFt).toFixed(1)}ft below End Anchor`;
  } else {
    labelText = `Start Anchor level with End Anchor`;
  }

  svg.appendChild(
    createText(
      startAnchorXPx + XOFFSET_START,
      startAnchorYPx - YOFFSET_DELTA,
      labelText
    )
  );
}

/**
 * Labels the vertical difference between the end and start anchors (inverted cable drop).
 * @param {SVGElement} svg - The SVG container to draw on.
 * @param {number} endAnchorXPx - X pixel coordinate for the label's position.
 * @param {number} endAnchorYPx - Y pixel coordinate for the label's position.
 * @param {number} cableDropFt - The vertical drop value in feet (positive if start is above end).
 */
export function labelEndAnchorToAnchorDelta(svg, endAnchorXPx, endAnchorYPx, cableDropFt) {
  let labelText;
  if (cableDropFt > 0) {
    // If cableDropFt is positive, Start is above End, so End is BELOW Start
    labelText = `End Anchor ${cableDropFt.toFixed(1)}ft below Start Anchor`;
  } else if (cableDropFt < 0) {
    // If cableDropFt is negative, Start is below End, so End is ABOVE Start
    labelText = `End Anchor ${Math.abs(cableDropFt).toFixed(1)}ft above Start Anchor`;
  } else {
    labelText = `End Anchor level with Start Anchor`;
  }

  svg.appendChild(
    createText(
      endAnchorXPx - XOFFSET_END,
      endAnchorYPx - YOFFSET_DELTA,
      labelText
    )
  );
}

/**
 * Labels the height of the end anchor relative to the end ground.
 * @param {SVGElement} svg - The SVG container to draw on.
 * @param {number} endAnchorXPx - X pixel coordinate for the label's position.
 * @param {number} endAnchorYPx - Y pixel coordinate for the label's position.
 * @param {string} anchorHeightRounded - The height value (already rounded) in feet to display.
 */
export function labelEndAnchorHeight(svg, endAnchorXPx, endAnchorYPx, anchorHeightRounded) {
  svg.appendChild(
    createText(
      endAnchorXPx - XOFFSET_END,
      endAnchorYPx - YOFFSET_HT,
      `End Anchor=${anchorHeightRounded}ft above End Ground`
    )
  );
}