// main.js

// Only add <base> tag if hosted on GitHub Pages
if (location.hostname === 'denisecase.github.io') {
  const base = document.createElement('base');
  base.setAttribute('href', '/zipline-estimator/');
  document.head.appendChild(base);
}

// Special styling for Safari browsers
if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
    console.log('Safari browser detected: applying .is-safari class');
    document.body.classList.add("is-safari");
}

import { startApp } from './app.js';

async function loadAndStart() {
  console.log('Loading config.json...');
  try {
    const res = await fetch('config.json');
    const config = await res.json();
    startApp(config);
  } catch (err) {
    console.error('Failed to load config.json:', err);
    // Fallback hardcoded defaults
    startApp({
      runFt: 81,
      slopeDeltaFt: 3.5,
      transitionPointPercent: 67,
      earlySlopePercent: 20,
      cableDropFt: 4,
      endAnchorHeightFromEndGroundFt: 11,
      seatDropFt: 3.0,
      clearanceFt: 2,
      riderWeightLbs: 180,
      riderSagTable: [
        {
          riderWeightLbs: 60,
          sagPointPercentFromEnd: 41,
          sagBelowStartAnchorFt: 5.2,
        },
        {
          riderWeightLbs: 250,
          sagPointPercentFromEnd: 44,
          sagBelowStartAnchorFt: 6.2,
        },
      ],
    });
  }
}

window.addEventListener('DOMContentLoaded', loadAndStart);