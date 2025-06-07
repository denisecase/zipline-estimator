import { calcGeo } from "./calc_geo.js";
import { computeVelocity, computeRideTime } from "./utils.js";

function runTestCases() {
  const testCases = [
    {
      label: "Flat Ground, No Drop, No Sag",
      input: {
        runFt: 60,
        slopeDeltaFt: 0,
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
    },
    {
      label: "Flat Ground, Moderate Drop and Sag",
      input: {
        runFt: 80,
        slopeDeltaFt: 0,
        cableDropFt: 4,
        seatDropFt: 3,
        clearanceFt: 2,
        endAnchorHeightFromEndGroundFt: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 3 },
        ],
      },
    },
    {
      label: "Uphill Ground (Reverse Slope), Sagging Line",
      input: {
        runFt: 100,
        slopeDeltaFt: 5,
        cableDropFt: 6,
        seatDropFt: 3.5,
        clearanceFt: 2.5,
        endAnchorHeightFromEndGroundFt: 6,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 4 },
        ],
      },
    },
    {
      label: "Downhill Ground, Extreme Sag",
      input: {
        runFt: 90,
        slopeDeltaFt: -8,
        cableDropFt: 3,
        seatDropFt: 3,
        clearanceFt: 2,
        endAnchorHeightFromEndGroundFt: 5,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 6 },
        ],
      },
    },
    {
      label: "Short Run, High Clearance Needed",
      input: {
        runFt: 30,
        slopeDeltaFt: 1,
        cableDropFt: 2,
        seatDropFt: 2,
        clearanceFt: 4,
        endAnchorHeightFromEndGroundFt: 4,
        riderWeightLbs: 250,
        riderSagTable: [
          { riderWeightLbs: 250, sagPointPercentFromEnd: 50, sagBelowStartAnchorFt: 1 },
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
    const maxDrop = result.maxDropFt ?? result.cableDropFt + result.sagFt;
    const velocityFPS = computeVelocity(maxDrop);
    const velocityMPH = velocityFPS * 0.681818;
    const rideTime = computeRideTime(result.runFt, velocityFPS);

    const row = `
      <tr>
        <td>${label}</td>
        <td>${input.runFt}</td>
        <td>${input.cableDropFt}</td>
        <td>${input.seatDropFt}</td>
        <td>${input.clearanceFt}</td>
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
