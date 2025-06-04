import { drawZipline } from "./draw.js";
import { computeSag, computeVelocity, computeRideTime } from "./utils.js";

const { createApp } = Vue;

function interpolate(table, weight, key) {
  const sorted = [...table].sort(
    (a, b) => a.rider_weight_lbs - b.rider_weight_lbs
  );
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (weight >= a.rider_weight_lbs && weight <= b.rider_weight_lbs) {
      const ratio =
        (weight - a.rider_weight_lbs) /
        (b.rider_weight_lbs - a.rider_weight_lbs);
      return a[key] + ratio * (b[key] - a[key]);
    }
  }
  return sorted.length > 0 ? sorted[0][key] : 0;
}

export function startApp() {
  fetch("config.json")
    .then((res) => res.json())
    .then(start)
    .catch(() => {
      console.warn("Using default config");
      start({
        runFeet: 81,
        slopeDeltaFeet: 3.5,
        cableDropFeet: 4,
        seatDropFeet: 3.5,
        clearanceFeet: 2,
        initialEndAnchorHeightFeet: 7,
        transitionPointRatio: 100,
        earlySlopeRatio: 100,
        riderWeightLbs: 250,
        riderSagTable: [
          { rider_weight_lbs: 60, sag_point_percent: 41, sag_vertical_ft: 5.2 },
          {
            rider_weight_lbs: 250,
            sag_point_percent: 44,
            sag_vertical_ft: 6.2,
          },
        ],
      });
    });

  function start(defaults) {
    createApp({
      data() {
        return {
          ...defaults,
          selectedRiderWeight: defaults.riderWeightLbs,
        };
      },
      computed: {
        initialStartAnchorHeightFeet() {
          return this.initialEndAnchorHeightFeet + this.cableDropFeet;
        },
        sagFeet() {
          const tableSagFeet = interpolate(
            this.riderSagTable,
            this.selectedRiderWeight,
            "sag_vertical_ft"
          );

          // Calculate where the sag point falls as a ratio along the cable
          const sagRatio = this.sagPointPercent / 100;

          // Linear vertical drop from start to end anchor
          const cableDrop = this.cableDropFeet;

          // Height of the straight cable line at the sag point (relative to start anchor)
          const cableHeightAtSagPoint = cableDrop * sagRatio;

          // True sag is how far below that straight line the sag point is
          return tableSagFeet - cableHeightAtSagPoint;
        },
        sagPointPercent() {
          return interpolate(
            this.riderSagTable,
            this.selectedRiderWeight,
            "sag_point_percent"
          );
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
        },
      },
      watch: {
        runFeet: "updateDrawing",
        slopeDeltaFeet: "updateDrawing",
        cableDropFeet: "updateDrawing",
        seatDropFeet: "updateDrawing",
        clearanceFeet: "updateDrawing",
        initialEndAnchorHeightFeet: "updateDrawing",
        selectedRiderWeight: "updateDrawing",
        transitionPointRatio: "updateDrawing",
        earlySlopeRatio: "updateDrawing",
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
            sagPointPercent: this.sagPointPercent,
            seatDropFeet: this.seatDropFeet,
            clearanceFeet: this.clearanceFeet,
            initialEndAnchorHeightFeet: this.initialEndAnchorHeightFeet,
            initialStartAnchorHeightFeet: this.initialStartAnchorHeightFeet,
            transitionPointRatio: this.transitionPointRatio,
            earlySlopeRatio: this.earlySlopeRatio,
          });
        },
      },
    }).mount("#app");
  }
}
