import { calcGeo } from "./calcs.js";
import { computeVelocity, computeRideTime } from "./utils.js";

function runTestCases() {
  const testCases = [
    {
      label: "Flat Ground, No Drop, No Sag",
      input: {
        runFeet: 60,
        slopeDeltaFeet: 0,
        cableDropFeet: 0,
        seatDropFeet: 2,
        clearanceFeet: 1,
        initialEndAnchorHeightFeet: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { rider_weight_lbs: 60, sag_point_percent: 41, sag_vertical_ft: 0 },
          { rider_weight_lbs: 250, sag_point_percent: 50, sag_vertical_ft: 0 },
        ],
      },
    },
    {
      label: "Flat Ground, Moderate Drop and Sag",
      input: {
        runFeet: 80,
        slopeDeltaFeet: 0,
        cableDropFeet: 4,
        seatDropFeet: 3,
        clearanceFeet: 2,
        initialEndAnchorHeightFeet: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { rider_weight_lbs: 250, sag_point_percent: 50, sag_vertical_ft: 3 },
        ],
      },
    },
    {
      label: "Uphill Ground (Reverse Slope), Sagging Line",
      input: {
        runFeet: 100,
        slopeDeltaFeet: 5,
        cableDropFeet: 6,
        seatDropFeet: 3.5,
        clearanceFeet: 2.5,
        initialEndAnchorHeightFeet: 6,
        riderWeightLbs: 250,
        riderSagTable: [
          { rider_weight_lbs: 250, sag_point_percent: 50, sag_vertical_ft: 4 },
        ],
      },
    },
    {
      label: "Downhill Ground, Extreme Sag",
      input: {
        runFeet: 90,
        slopeDeltaFeet: -8,
        cableDropFeet: 3,
        seatDropFeet: 3,
        clearanceFeet: 2,
        initialEndAnchorHeightFeet: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { rider_weight_lbs: 250, sag_point_percent: 50, sag_vertical_ft: 6 },
        ],
      },
    },
    {
      label: "Short Run, High Clearance Needed",
      input: {
        runFeet: 30,
        slopeDeltaFeet: 1,
        cableDropFeet: 2,
        seatDropFeet: 2,
        clearanceFeet: 4,
        initialEndAnchorHeightFeet: 4,
        riderWeightLbs: 250,
        riderSagTable: [
          { rider_weight_lbs: 250, sag_point_percent: 50, sag_vertical_ft: 1 },
        ],
      },
    },
  ];

  const container = document.getElementById("test-results");

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "2em";
  table.style.fontSize = "0.6em";
  table.style.maxWidth = "100%";
  table.style.overflowX = "auto";

  const headerRow = `
    <tr>
      <th>Label</th>
      <th>Run<br>(ft)</th>
      <th>Drop<br>(ft)</th>
      <th>Seat<br>Drop</th>
      <th>Clearance<br>(ft)</th>
      <th>Max<br>Drop (ft)</th>
      <th>Velocity<br>(ft/s)</th>
      <th>Velocity<br>(mph)</th>
      <th>Ride<br>Time (sec)</th>
    </tr>
  `;
  table.innerHTML = headerRow;

  testCases.forEach(({ label, input }) => {
    const result = calcGeo(input);
    const maxDrop = result.maxDropFeet ?? result.cableDropFeet + result.sagFeet;
    const velocityFPS = computeVelocity(maxDrop);
    const velocityMPH = velocityFPS * 0.681818;
    const rideTime = computeRideTime(result.runFeet, velocityFPS);

    const row = `
      <tr>
        <td>${label}</td>
        <td>${input.runFeet}</td>
        <td>${input.cableDropFeet}</td>
        <td>${input.seatDropFeet}</td>
        <td>${input.clearanceFeet}</td>
        <td>${maxDrop.toFixed(2)}</td>
        <td>${velocityFPS.toFixed(1)}</td>
        <td>${velocityMPH.toFixed(1)}</td>
        <td>${rideTime.toFixed(1)}</td>
      </tr>
    `;
    table.innerHTML += row;
  });

  table.querySelectorAll("th, td").forEach((el) => {
    el.style.border = "1px solid #ccc";
    el.style.padding = "0.3em 0.5em";
    el.style.textAlign = "center";
    el.style.wordBreak = "break-word";
  });

  container.innerHTML = `<h2>Test Case Results</h2>`;
  container.appendChild(table);
}

runTestCases();
