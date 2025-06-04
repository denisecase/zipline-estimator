// draw_cable.js
import { createLine, createCircle, createText } from "./draw_utils.js";


/**
 * Draws the cable, sag line, and visual indicators for zipline safety.
 *
 * @param {SVGElement} svg - The SVG element to draw on.
 * @param {number} startX - X position of the start anchor.
 * @param {number} anchorStartY - Y position of the start anchor.
 * @param {number} endX - X position of the end anchor.
 * @param {number} anchorEndY - Y position of the end anchor.
 * @param {number} runFeet - Total horizontal run in feet.
 * @param {number} pixelsPerFoot - Scale factor.
 * @param {number|null} sagFeet - Vertical sag in feet.
 * @param {number|null} sagPointPercent - Percent from end anchor where sag occurs.
 * @param {object} geometry - Calculated geometry including bottomClearanceElevationFt.
 */
export function drawCable(
  svg,
  startX,
  anchorStartY,
  endX,
  anchorEndY,
  runFeet,
  pixelsPerFoot,
  sagFeet = null,
  sagPointPercent = null,
  geometry = null
) {
  const fromStartPercent =
    sagPointPercent !== null ? 100 - sagPointPercent : 50;

  const sagX = startX + runFeet * (fromStartPercent / 100) * pixelsPerFoot;
  const anchorLineMidY = (anchorStartY + anchorEndY) / 2;
  const sagY = anchorLineMidY + (sagFeet ?? 0) * pixelsPerFoot;

  // Determine color based on safety, default to black
  const cableColor = getCableColorBasedOnClearance(geometry, svg, sagX, sagY);

  // Draw actual sagging cable
  svg.appendChild(createLine(startX, anchorStartY, sagX, sagY, cableColor, 2));
  svg.appendChild(createLine(sagX, sagY, endX, anchorEndY, cableColor, 2));
  svg.appendChild(createCircle(sagX, sagY, 3, "red"));

  // Draw dashed un-sagged reference line
  svg.appendChild(
    createLine(startX, anchorStartY, endX, anchorEndY, "#ccc", 1)
  );

  // Annotate
  let label = "Cable Sag Point";
  if (sagFeet !== null && sagPointPercent !== null) {
    label += `\n${sagFeet.toFixed(1)} ft sag @ ${fromStartPercent.toFixed(1)}% from start`;
  }

  svg.appendChild(createText(sagX - 45, sagY - 25, label));
}

// Returns the default safe cable color
export function drawSafe(svg, cableColor = "black") {
  return cableColor;
}

// Adds a red warning label and plays a crash sound
export function drawNotSafe(svg, midX, midY) {
  const cableColor = "red";
  svg.appendChild(createText(midX - 20, midY - 100, "⚠ DANGER! Not Safe!", "red"));
  playCrashSound();
  return cableColor;
}

// Sound effect on collision or failed safety check
function playCrashSound() {
  //const audio = new Audio("sounds/crash.mp3");
  //audio.play();
  playBeep(); // Fallback to a simple beep sound
}

export function getCableColorBasedOnClearance(geometry, svg, x, y) {
  if (!geometry) return "black";
  return geometry.isSafe ? drawSafe(svg) : drawNotSafe(svg, x, y);
}

// Create one global AudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();


export function playBeep() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = "triangle"; // "sine" "square", "triangle", "sawtooth"
  oscillator.frequency.value = 880; // Hz kind of high

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.15); // 150ms

  // Optional: brief fade-out to avoid click sound
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
}