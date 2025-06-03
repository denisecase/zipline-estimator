// Only add <base> tag if hosted on GitHub Pages
if (location.hostname === 'denisecase.github.io') {
  const base = document.createElement('base');
  base.setAttribute('href', '/zipline-estimator/');
  document.head.appendChild(base);
}

import { startApp } from './app.js';

window.addEventListener('DOMContentLoaded', () => {
  startApp();
});
