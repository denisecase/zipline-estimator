import { drawZipline } from './draw.js';
import {
  computeSag,
  computeVelocity,
  computeRideTime,
} from './utils.js';

const { createApp } = Vue;

export function startApp() {
  fetch('config.json')
    .then((res) => res.json())
    .then(start)
    .catch(() => {
      console.warn('Using default config');
      start({
        runFeet: 81,
        slopeDeltaFeet: 3.5,
        cableDropFeet: 4,
        sagPercent: 4,
        seatDropFeet: 3.5,
        clearanceFeet: 2
      });
    });

  function start(defaults) {
    createApp({
      data() {
        return { ...defaults };
      },
      computed: {
        sagFeet() {
          return computeSag(this.runFeet, this.sagPercent);
        },
        maxDropFeet() {
          return this.cableDropFeet + this.sagFeet;
        },
        velocityFeetPerSecond() {
          return computeVelocity(this.maxDropFeet);
        },
        velocityMilesPerHour() {
          return this.velocityFeetPerSecond * 0.681818;
        },
        rideTimeSeconds() {
          return computeRideTime(this.runFeet, this.velocityFeetPerSecond);
        }
      },
      watch: {
        runFeet: 'updateDrawing',
        slopeDeltaFeet: 'updateDrawing',
        cableDropFeet: 'updateDrawing',
        sagPercent: 'updateDrawing',
        seatDropFeet: 'updateDrawing',
        clearanceFeet: 'updateDrawing'
      },
      mounted() {
        this.updateDrawing();
      },
      methods: {
        updateDrawing() {
          drawZipline({
            runFeet: this.runFeet,
            slopeDeltaFeet: this.slopeDeltaFeet,
            cableDropFeet: this.cableDropFeet,
            sagFeet: this.sagFeet,
            seatDropFeet: this.seatDropFeet,
            clearanceFeet: this.clearanceFeet
          });
        }
      }
    }).mount('#app');
  }
}
