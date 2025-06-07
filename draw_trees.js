// draw_trees.js
import { createLine, createCircle, createText } from "./draw_utils.js";

const TRUNK_OPACITY = 0.6;
const TRUNK_WIDTH = 10;
const TREE_TOP_RADIUS = 10; // Consistent radius for tree top circles
const TREE_TOP_COLOR = "green";
const TREE_HEIGHT_MULTIPLIER = 1.3; // Multiplier to extend tree above anchor

/**
 * Draws start tree.
 * tree trunk will be drawn from start ground level, extending beyond anchor point.
 * tree top (green circle) will be at very top of this extended trunk.
 *
 * @param {SVGElement} svg - SVG container to draw on.
 * @param {number} startAnchorXPx - X pixel coordinate of start anchor.
 * @param {number} startGroundYPx - Y pixel coordinate of ground at start tree's base.
 * @param {number} startAnchorAtStartGroundYPx - Y pixel coordinate of start anchor relative to start ground.
 * This is effective Y-coordinate of anchor.
 */
export function drawStartTree(
  svg,
  startAnchorXPx,
  startGroundYPx,
  endGroundYPx, // Still passed, but not directly used for this tree's trunk calculation
  startAnchorAtEndGroundYPx, // Still passed, but not directly used for this tree's trunk calculation
  startAnchorAtStartGroundYPx // This is key Y for anchor point.
) {
  console.log(
    "drawStartTree called with precise pixel values:",
    {
      startAnchorXPx,
      startGroundYPx,
      startAnchorAtStartGroundYPx, // actual Y-pixel for anchor
    }
  );

  // Calculate height of tree from ground up to anchor point (in pixels)
  const anchorToGroundHeightPx = startGroundYPx - startAnchorAtStartGroundYPx;

  // Calculate top of tree by extending it beyond anchor
  // Y increases downwards, so we subtract to go "up"
  const trunkTopY = startAnchorAtStartGroundYPx - (anchorToGroundHeightPx * (TREE_HEIGHT_MULTIPLIER - 1));

  
  // Draw tree trunk (from ground up to extended top)
  const trunk = createLine(
    startAnchorXPx,             // X-coordinate of trunk
    startGroundYPx,             // Bottom Y-coordinate of trunk (on ground)
    startAnchorXPx,             // X-coordinate of trunk
    trunkTopY,                  // Top Y-coordinate of trunk (extended)
    "saddlebrown",
    TRUNK_WIDTH,
    TRUNK_OPACITY
  );
  svg.appendChild(trunk);
  console.log(`Start tree trunk drawn from X:${startAnchorXPx} Y:${startGroundYPx} to X:${startAnchorXPx} Y:${trunkTopY}`);


  // Draw tree top (green circle at *extended top of trunk*)
  svg.appendChild(createCircle(startAnchorXPx, trunkTopY, TREE_TOP_RADIUS, TREE_TOP_COLOR));
  console.log(`Start tree top drawn at X:${startAnchorXPx} Y:${trunkTopY}`);
}

/**
 * Draws end tree.
 * tree trunk will be drawn from end ground level, extending beyond anchor point.
 * tree top (green circle) will be at very top of this extended trunk.
 *
 * @param {SVGElement} svg - SVG container to draw on.
 * @param {number} endAnchorXPx - X pixel coordinate of end anchor.
 * @param {number} axisYPx - Y pixel coordinate of main SVG axis/end ground baseline (effectively endGroundYPx).
 * @param {number} endAnchorYPx - Y pixel coordinate of end anchor.
 */
export function drawEndTree(
  svg,
  endAnchorXPx,
  axisYPx, 
  endAnchorYPx
) {
  console.log(
    "drawEndTree called with precise pixel values:",
    {
      endAnchorXPx,
      axisYPx,      
      endAnchorYPx, // actual Y-pixel for end anchor
    }
  );

  // Calculate height of tree from ground up to anchor point (in pixels)
  const anchorToGroundHeightPx = axisYPx - endAnchorYPx;

  // Calculate top of tree by extending it beyond anchor
  // Y increases downwards, so we subtract to go "up"
  const trunkTopY = endAnchorYPx - (anchorToGroundHeightPx * (TREE_HEIGHT_MULTIPLIER - 1));

  // Draw tree trunk (from ground up to extended top)
  const trunk = createLine(
    endAnchorXPx,       // X-coordinate of trunk
    axisYPx,            // Bottom Y-coordinate of trunk (on ground)
    endAnchorXPx,       // X-coordinate of trunk
    trunkTopY,          // Top Y-coordinate of trunk (extended)
    "saddlebrown",
    TRUNK_WIDTH,
    TRUNK_OPACITY
  );
  svg.appendChild(trunk);
  console.log(`End tree trunk drawn from X:${endAnchorXPx} Y:${axisYPx} to X:${endAnchorXPx} Y:${trunkTopY}`);


  // Draw tree top (green circle at *extended top of trunk*)
  svg.appendChild(createCircle(endAnchorXPx, trunkTopY, TREE_TOP_RADIUS, TREE_TOP_COLOR));
  console.log(`End tree top drawn at X:${endAnchorXPx} Y:${trunkTopY}`);
}

// Re-exporting label functions for draw.js
// Implementation is in draw_tree_labels.js
export {
  labelStartAnchorHeightAboveGroundEnd,
  labelStartAnchorHeightAboveGroundStart,
  labelStartAnchorToAnchorDelta,
  labelEndAnchorToAnchorDelta,
  labelEndAnchorHeight,
} from "./draw_tree_labels.js";