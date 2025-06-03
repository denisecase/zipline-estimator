import {
  estimateZipline
} from './utils.js';

function runTestCases() {
  const testCases = [
    {
      label: 'Standard Run',
      input: {
        runFeet: 81,
        cableDropFeet: 4,
        sagPercent: 4,
        seatDropFeet: 3.5,
        clearanceFeet: 2
      }
    },
    {
      label: 'Flat Terrain, Short Run',
      input: {
        runFeet: 40,
        cableDropFeet: 1,
        sagPercent: 5,
        seatDropFeet: 2,
        clearanceFeet: 1.5
      }
    },
    {
      label: 'Steep Decline, Long Run',
      input: {
        runFeet: 150,
        cableDropFeet: 10,
        sagPercent: 3,
        seatDropFeet: 4,
        clearanceFeet: 3
      }
    },
    {
      label: 'No Sag',
      input: {
        runFeet: 100,
        cableDropFeet: 5,
        sagPercent: 0,
        seatDropFeet: 3,
        clearanceFeet: 2
      }
    }
  ];

  const container = document.getElementById('test-results');

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '2em';
  table.style.fontSize = '0.9em';

  const headerRow = `
    <tr>
      <th>Label</th>
      <th>Run (ft)</th>
      <th>Drop (ft)</th>
      <th>Sag (%)</th>
      <th>Seat Drop (ft)</th>
      <th>Clearance (ft)</th>
      <th>Total Sag (ft)</th>
      <th>Max Drop (ft)</th>
      <th>Velocity (ft/s)</th>
      <th>Velocity (mph)</th>
      <th>Ride Time (sec)</th>
    </tr>
  `;
  table.innerHTML = headerRow;

  testCases.forEach(({ label, input }) => {
    const {
      runFeet,
      cableDropFeet,
      sagPercent,
      seatDropFeet,
      clearanceFeet
    } = input;

    const result = estimateZipline(
      runFeet,
      cableDropFeet,
      sagPercent,
      seatDropFeet,
      clearanceFeet
    );

    const row = `
      <tr>
        <td>${label}</td>
        <td>${runFeet}</td>
        <td>${cableDropFeet}</td>
        <td>${sagPercent}</td>
        <td>${seatDropFeet}</td>
        <td>${clearanceFeet}</td>
        <td>${result.sagFeet.toFixed(2)}</td>
        <td>${result.maxDropFeet.toFixed(2)}</td>
        <td>${result.velocityFeetPerSecond.toFixed(1)}</td>
        <td>${result.velocityMilesPerHour.toFixed(1)}</td>
        <td>${result.rideTimeSeconds.toFixed(1)}</td>
      </tr>
    `;
    table.innerHTML += row;
  });

  // Style table
  table.querySelectorAll('th, td').forEach((el) => {
    el.style.border = '1px solid #ccc';
    el.style.padding = '0.4em 0.6em';
    el.style.textAlign = 'center';
  });

  container.innerHTML = `<h2>Test Case Results</h2>`;
  container.appendChild(table);
}
runTestCases();
