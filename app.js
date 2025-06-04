// app.js
import { drawZipline } from "./draw.js";
import { calcGeo } from "./calcs.js";
import { computeVelocity, computeRideTime } from "./utils.js";

const { createApp } = Vue;

export function startApp() {
  const app = createApp({
    data() {
      return {

        inputs: {
          runFeet: 81,
          slopeDeltaFeet: 3.5,
          transitionPointRatio: 0.5,
          earlySlopeRatio: 0.5,
          cableDropFeet: 4,
          seatDropFeet: 3.5,
          clearanceFeet: 2,
          initialEndAnchorHeightFeet: 7,
          riderWeightLbs: 250,
          riderSagTable: [
            {
              rider_weight_lbs: 60,
              sag_point_percent: 41,
              sag_vertical_ft: 5.2,
            },
            {
              rider_weight_lbs: 250,
              sag_point_percent: 44,
              sag_vertical_ft: 6.2,
            },
          ],
        },
      };
    },
    computed: {
      geometry() {
        return calcGeo({ ...this.inputs });
      },
      velocityFeetPerSecond() {
        return computeVelocity(this.maxDropFeet || 0);
      },
      velocityMilesPerHour() {
        return this.velocityFeetPerSecond * 0.681818;
      },
      rideTimeSeconds() {
        return computeRideTime(this.inputs.runFeet, this.velocityFeetPerSecond);
      },
      maxDropFeet() {
        const g = this.geometry;
        return g?.startAnchorElevationFt - g?.bottomClearanceElevationFt;
      },
      initialStartAnchorHeightFeet() {
        return this.geometry?.startAnchorElevationFt ?? null;
      },
      riderWeightLbs() {
        return this.inputs.riderWeightLbs;
      },
      runFeet() {
        return this.inputs.runFeet;
      },
      slopeDeltaFeet() {
        return this.inputs.slopeDeltaFeet;
      },
      cableDropFeet() {
        return this.inputs.cableDropFeet;
      },
      seatDropFeet() {
        return this.inputs.seatDropFeet;
      },
      clearanceFeet() {
        return this.inputs.clearanceFeet;
      },
      transitionPointRatio() {
        return this.inputs.transitionPointRatio;
      },
      earlySlopeRatio() {
        return this.inputs.earlySlopeRatio;
      },
      initialEndAnchorHeightFeet() {
        return this.inputs.initialEndAnchorHeightFeet;
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
        if (this.geometry?.runFeet != null) {
          drawZipline(this.geometry);
        }
      },
    },
  });

  // Mount the app directly, as there's no asynchronous data to wait for.
  app.mount("#app");
}
