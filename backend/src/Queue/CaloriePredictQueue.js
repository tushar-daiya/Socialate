import { Queue } from "bullmq";
const caloriePredictQueue = new Queue("caloriePredict", {
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
});

export { caloriePredictQueue };