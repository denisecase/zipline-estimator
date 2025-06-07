// A new test file, or integrate this into a separate test runner HTML page
// Create a simple HTML file with a div id="test-results" for this to work.

import { calcGeo } from "./calc_geo.js";
import { calcDwg } from "./calc_dwg.js"; // Import calcDwg
import {
  computeMaxVelocityFtPerSec, // Assuming these are correctly imported now
  computeAvgVelocityFtPerSec,
  computeMaxVelocityMph,
  computeAvgVelocityMph,
  computeRideTimeSeconds,
} from "./calc_ride.js"; // Corrected import path based on app.js

// Function to safely get a value, returning 'N/A' if null/undefined
function safeGet(value) {
  return value !== null && value !== undefined ? value.toFixed(2) : "N/A";
}

function runTestCases() {
  const testCases = [
    {
      label: "Flat Ground, No Drop, No Sag",
      input: {
        runFt: 60,
        slopeDeltaFt: 0,
        transitionPointPercent: 0.5, // Added missing params for calcGeo
        earlySlopePercent: 0.2,      // Added missing params for calcGeo
        cableDropFt: 0,
        seatDropFt: 2,
        clearanceFt: 1,
        endAnchorHeightFromEndGroundFt: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 60, sagPointPercentFromEnd: 41, sagBelowStartAnchorFt: 0 },
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 0 },
        ],
      },
      // Expected dwg values (pre-calculate these for verification)
      expectedDwg: {
        svgWidthPx: 60 * 10 + 50 * 2, // 700
        svgHeightPx: 300,
        axisYPx: 300 - 50, // 250
        startGroundXPx: 50,
        endGroundXPx: 50 + 60 * 10, // 650
        startGroundYPx: 250 - 0 * 10, // 250
        endGroundYPx: 250 - 0 * 10,   // 250
        startAnchorXPx: 50,
        endAnchorXPx: 650,
        startAnchorYPx: 250 - 5 * 10, // 200 (endAnchorHeight + cableDrop = 5+0 = 5)
        endAnchorYPx: 250 - 5 * 10,   // 200 (endAnchorHeight = 5)
        sagPointXPx: 50 + 60 * 0.5 * 10, // 350
        sagPointYPx: 250 - (5-0)*10 + 0*10 // This will depend on actual sag, need to verify cableHeightAtSagPointFt and sagFtFromCableAtSagPointFt
      }
    },
    {
      label: "Flat Ground, Moderate Drop and Sag",
      input: {
        runFt: 80,
        slopeDeltaFt: 0,
        transitionPointPercent: 0.5,
        earlySlopePercent: 0.2,
        cableDropFt: 4,
        seatDropFt: 3,
        clearanceFt: 2,
        endAnchorHeightFromEndGroundFt: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 3 },
        ],
      },
       expectedDwg: {
        svgWidthPx: 80 * 10 + 50 * 2, // 900
        svgHeightPx: 300,
        axisYPx: 300 - 50, // 250
        startGroundXPx: 50,
        endGroundXPx: 50 + 80 * 10, // 850
        startGroundYPx: 250 - 0 * 10, // 250
        endGroundYPx: 250 - 0 * 10,   // 250
        startAnchorXPx: 50,
        endAnchorXPx: 850,
        startAnchorYPx: 250 - (5+4) * 10, // 250 - 90 = 160
        endAnchorYPx: 250 - 5 * 10,   // 200
        sagPointXPx: 50 + 80 * 0.5 * 10, // 450
        // sagPointYPx will depend on calc_sag's exact output, need to calculate or run and get actuals
      }
    },
    {
      label: "Uphill Ground (Reverse Slope), Sagging Line",
      input: {
        runFt: 100,
        slopeDeltaFt: 5, // Start ground is 5ft higher than end ground
        transitionPointPercent: 0.5,
        earlySlopePercent: 0.2,
        cableDropFt: 6,
        seatDropFt: 3.5,
        clearanceFt: 2.5,
        endAnchorHeightFromEndGroundFt: 6,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 4 },
        ],
      },
       expectedDwg: {
        svgWidthPx: 100 * 10 + 50 * 2, // 1100
        svgHeightPx: 300,
        axisYPx: 300 - 50, // 250
        startGroundXPx: 50,
        endGroundXPx: 50 + 100 * 10, // 1050
        startGroundYPx: 250 - 5 * 10, // 200
        endGroundYPx: 250 - 0 * 10,   // 250
        startAnchorXPx: 50,
        endAnchorXPx: 1050,
        startAnchorYPx: 250 - (6+6) * 10, // 250 - 120 = 130
        endAnchorYPx: 250 - 6 * 10,   // 190
        sagPointXPx: 50 + 100 * 0.5 * 10, // 550
        // sagPointYPx will depend on calc_sag's exact output
      }
    },
    {
      label: "Downhill Ground, Extreme Sag",
      input: {
        runFt: 90,
        slopeDeltaFt: -8, // Start ground is 8ft lower than end ground
        transitionPointPercent: 0.5,
        earlySlopePercent: 0.2,
        cableDropFt: 3,
        seatDropFt: 3,
        clearanceFt: 2,
        endAnchorHeightFromEndGroundFt: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 6 },
        ],
      },
      expectedDwg: {
        svgWidthPx: 90 * 10 + 50 * 2, // 1000
        svgHeightPx: 300,
        axisYPx: 300 - 50, // 250
        startGroundXPx: 50,
        endGroundXPx: 50 + 90 * 10, // 950
        startGroundYPx: 250 - (-8) * 10, // 250 + 80 = 330 (This will draw off the SVG!)
        endGroundYPx: 250 - 0 * 10,   // 250
        startAnchorXPx: 50,
        endAnchorXPx: 950,
        startAnchorYPx: 250 - (5+3) * 10, // 250 - 80 = 170
        endAnchorYPx: 250 - 5 * 10,   // 200
        sagPointXPx: 50 + 90 * 0.5 * 10, // 500
        // sagPointYPx will depend on calc_sag's exact output
      }
    },
    {
      label: "Short Run, High Clearance Needed",
      input: {
        runFt: 30,
        slopeDeltaFt: 1,
        transitionPointPercent: 0.5,
        earlySlopePercent: 0.2,
        cableDropFt: 2,
        seatDropFt: 2,
        clearanceFt: 4,
        endAnchorHeightFromEndGroundFt: 4,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 1 },
        ],
      },
       expectedDwg: {
        svgWidthPx: 30 * 10 + 50 * 2, // 400
        svgHeightPx: 300,
        axisYPx: 300 - 50, // 250
        startGroundXPx: 50,
        endGroundXPx: 50 + 30 * 10, // 350
        startGroundYPx: 250 - 1 * 10, // 240
        endGroundYPx: 250 - 0 * 10,   // 250
        startAnchorXPx: 50,
        endAnchorXPx: 350,
        startAnchorYPx: 250 - (4+2) * 10, // 250 - 60 = 190
        endAnchorYPx: 250 - 4 * 10,   // 210
        sagPointXPx: 50 + 30 * 0.5 * 10, // 200
        // sagPointYPx will depend on calc_sag's exact output
      }
    },
  ];

  const container = document.getElementById("test-results");

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "2em";
  table.style.fontSize = "0.7em"; // Increased slightly for readability
  table.style.maxWidth = "100%";
  table.style.overflowX = "auto";

  // Define the headers for both geo and dwg results
  const headerRow = `
    <tr>
      <th rowspan="2">Label</th>
      <th colspan="5" style="border-bottom: 1px solid #ccc;">Input Params</th>
      <th colspan="7" style="border-bottom: 1px solid #ccc;">Geo Results (Ft)</th>
      <th colspan="15" style="border-bottom: 1px solid #ccc;">Dwg Results (Px)</th>
    </tr>
    <tr>
      <th>Run<br>(ft)</th>
      <th>Slope<br>&Delta;(ft)</th>
      <th>Cable<br>Drop(ft)</th>
      <th>Seat<br>Drop(ft)</th>
      <th>End<br>Anchor<br>H(ft)</th>

      <th>Start Grd<br>Elev (ft)</th>
      <th>End Grd<br>Elev (ft)</th>
      <th>Start Anchor<br>H (ft)</th>
      <th>Lowest Seat<br>Elev (ft)</th>
      <th>Lowest Clr<br>Above End Grd (ft)</th>
      <th>Sag From<br>Cable (ft)</th>
      <th>Max Drop<br>(ft)</th>

      <th>SVG W (px)</th>
      <th>SVG H (px)</th>
      <th>Axis Y (px)</th>
      <th>Start Grd<br>X (px)</th>
      <th>Start Grd<br>Y (px)</th>
      <th>End Grd<br>X (px)</th>
      <th>End Grd<br>Y (px)</th>
      <th>Start Anchor<br>X (px)</th>
      <th>Start Anchor<br>Y (px)</th>
      <th>End Anchor<br>X (px)</th>
      <th>End Anchor<br>Y (px)</th>
      <th>Sag Point<br>X (px)</th>
      <th>Sag Point<br>Y (px)</th>
      <th>Start Anchor<br>@End Grd Y (px)</th>
      <th>Start Anchor<br>@Start Grd Y (px)</th>
    </tr>
  `;
  table.innerHTML = headerRow;

  testCases.forEach(({ label, input, expectedDwg }) => {
    // Calculate geo object
    let geo;
    try {
      geo = calcGeo(input);
    } catch (e) {
      console.error(`calcGeo failed for ${label}:`, e);
      const row = `<tr><td colspan="30" style="color: red;">Error in calcGeo for ${label}: ${e.message}</td></tr>`;
      table.innerHTML += row;
      return;
    }

    // Calculate dwg object
    let dwg;
    try {
      dwg = calcDwg(geo);
    } catch (e) {
      console.error(`calcDwg failed for ${label}:`, e);
      const row = `<tr><td colspan="30" style="color: red;">Error in calcDwg for ${label}: ${e.message}</td></tr>`;
      table.innerHTML += row;
      return;
    }

    // Calculate ride metrics using geo
    const maxDropFt = geo.maxDropFt; // Use geo.maxDropFt directly
    const velocityFPS = computeMaxVelocityFtPerSec(maxDropFt);
    const velocityMPH = computeMaxVelocityMph(maxDropFt);
    const rideTime = computeRideTimeSeconds(geo.runFt, velocityFPS);


    const row = `
      <tr>
        <td>${label}</td>
        <td>${input.runFt}</td>
        <td>${input.slopeDeltaFt}</td>
        <td>${input.cableDropFt}</td>
        <td>${input.seatDropFt}</td>
        <td>${input.endAnchorHeightFromEndGroundFt}</td>

        <td>${safeGet(geo.startGroundElevationFt)}</td>
        <td>${safeGet(geo.endGroundElevationFt)}</td>
        <td>${safeGet(geo.startAnchorHeightFromEndGroundFt)}</td>
        <td>${safeGet(geo.lowestSeatElevationFt)}</td>
        <td>${safeGet(geo.lowestClearanceAboveEndGroundFt)}</td>
        <td>${safeGet(geo.sagFtFromCableAtSagPointFt)}</td>
        <td>${safeGet(geo.maxDropFt)}</td>

        <td style="${dwg.svgWidthPx !== expectedDwg.svgWidthPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.svgWidthPx)} (${safeGet(expectedDwg.svgWidthPx)})</td>
        <td>${safeGet(dwg.svgHeightPx)}</td>
        <td>${safeGet(dwg.axisYPx)}</td>
        <td style="${dwg.startGroundXPx !== expectedDwg.startGroundXPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.startGroundXPx)} (${safeGet(expectedDwg.startGroundXPx)})</td>
        <td style="${dwg.startGroundYPx !== expectedDwg.startGroundYPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.startGroundYPx)} (${safeGet(expectedDwg.startGroundYPx)})</td>
        <td style="${dwg.endGroundXPx !== expectedDwg.endGroundXPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.endGroundXPx)} (${safeGet(expectedDwg.endGroundXPx)})</td>
        <td style="${dwg.endGroundYPx !== expectedDwg.endGroundYPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.endGroundYPx)} (${safeGet(expectedDwg.endGroundYPx)})</td>
        <td style="${dwg.startAnchorXPx !== expectedDwg.startAnchorXPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.startAnchorXPx)} (${safeGet(expectedDwg.startAnchorXPx)})</td>
        <td style="${dwg.startAnchorYPx !== expectedDwg.startAnchorYPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.startAnchorYPx)} (${safeGet(expectedDwg.startAnchorYPx)})</td>
        <td style="${dwg.endAnchorXPx !== expectedDwg.endAnchorXPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.endAnchorXPx)} (${safeGet(expectedDwg.endAnchorXPx)})</td>
        <td style="${dwg.endAnchorYPx !== expectedDwg.endAnchorYPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.endAnchorYPx)} (${safeGet(expectedDwg.endAnchorYPx)})</td>
        <td style="${dwg.sagPointXPx !== expectedDwg.sagPointXPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.sagPointXPx)} (${safeGet(expectedDwg.sagPointXPx)})</td>
        <td style="${dwg.sagPointYPx !== expectedDwg.sagPointYPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.sagPointYPx)} (${safeGet(expectedDwg.sagPointYPx)})</td>
        <td style="${dwg.startAnchorAtEndGroundYPx !== expectedDwg.startAnchorAtEndGroundYPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.startAnchorAtEndGroundYPx)} (${safeGet(expectedDwg.startAnchorAtEndGroundYPx)})</td>
        <td style="${dwg.startAnchorAtStartGroundYPx !== expectedDwg.startAnchorAtStartGroundYPx ? 'background-color: yellow;' : ''}">${safeGet(dwg.startAnchorAtStartGroundYPx)} (${safeGet(expectedDwg.startAnchorAtStartGroundYPx)})</td>
      </tr>
    `;
    table.innerHTML += row;
  });

  table.querySelectorAll("th, td").forEach((el) => {
    el.style.border = "1px solid #ccc";
    el.style.padding = "0.3em 0.5em";
    el.style.textAlign = "center";
    el.style.wordBreak = "break-word";
    el.style.whiteSpace = "nowrap"; // Keep content on single line if possible
  });

  container.innerHTML = `<h2>Test Case Results</h2>`;
  container.appendChild(table);
}

// Ensure this runs when the DOM is ready
document.addEventListener("DOMContentLoaded", runTestCases);