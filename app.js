// app.js
import { drawZipline } from "./draw.js";
import { calcGeo } from "./calc_geo.js";
import {
  computeMaxVelocityFtPerSec,
  computeAvgVelocityFtPerSec,
  computeMaxVelocityMph,
  computeAvgVelocityMph,
  computeRideTimeSeconds,
} from "./calc_ride.js";

const { createApp } = Vue;

export function startApp(config) {
  console.log("Starting app with config:", config);

  const app = createApp({
    data() {
      return {
        inputs: config, // Load from JSON
      };
    },
    computed: {
      geometry() {
        return calcGeo({ ...this.inputs });
      },
      maxDropFt() {
        const g = this.geometry;
        // This calculates the total vertical drop from start anchor to the bottom of the clearance zone.
        return g?.startAnchorElevationFt !== undefined &&
          g?.lowestClearanceAboveEndGroundFt !== undefined
          ? g.startAnchorElevationFt - g.lowestClearanceAboveEndGroundFt
          : NaN; // Return NaN if values are not ready
      },
      maxVelocityFtPerSec() {
        return computeMaxVelocityFtPerSec(this.maxDropFt || 0);
      },
      avgVelocityFtPerSec() {
        return computeAvgVelocityFtPerSec(this.maxDropFt || 0);
      },
      maxVelocityMph() {
        return computeMaxVelocityMph(this.maxDropFt || 0);
      },
      avgVelocityMph() {
        return computeAvgVelocityMph(this.maxDropFt || 0);
      },
      rideTimeSeconds() {
        return computeRideTimeSeconds(
          this.inputs.runFt,
          this.avgVelocityFtPerSec 
        );
      },
      startAnchorHeightFromEndGroundFt() {
        return this.geometry?.startAnchorElevationFt ?? "—";
      },
      endAnchorHeightFromEndGroundFt() {
        return this.inputs.endAnchorHeightFromEndGroundFt;
      },
      runFt() {
        return this.inputs.runFt;
      },
      slopeDeltaFt() {
        return this.inputs.slopeDeltaFt;
      },
      cableDropFt() {
        return this.inputs.cableDropFt;
      },
      seatDropFt() {
        return this.inputs.seatDropFt;
      },
      clearanceFt() {
        return this.inputs.clearanceFt;
      },
      riderWeightLbs() {
        return this.inputs.riderWeightLbs;
      },
      transitionPointPercent() {
        return this.inputs.transitionPointPercent;
      },
      earlySlopePercent() {
        return this.inputs.earlySlopePercent;
      },
    },
    watch: {
      geometry: {
        handler() {
          this.updateDrawing();
        },
        deep: true,
      },
    },
    mounted() {
      this.updateDrawing();
    },
    methods: {
      updateDrawing() {
        if (this.geometry?.runFt != null) {
          drawZipline(this.geometry);
        }
      },
    },
  });

  // Mount the app directly, no asynchronous data to wait for.
  app.mount("#app");
}
