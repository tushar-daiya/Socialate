import { Worker } from "bullmq";
import { predictCalories } from "../utils/CaloriePredictor.js";
import { Donation } from "../models/donationModel.js";
import fs from "fs";
const caloriePredictWorker = new Worker(
  "caloriePredict",
  async (job) => {
    try {
      console.log("Job started");
      const { file, donationId } = job.data;
      const result = await predictCalories(file);
      const donation = await Donation.findById(donationId);
      donation.additionalInfo = result;
      await donation.save({ validateBeforeSave: false });
      console.log("Job finished");
      return;
    } catch (error) {
      console.log(error);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
    limiter: {
      max: 30,
      duration: 60000,
    },
  }
);
export { caloriePredictWorker };
