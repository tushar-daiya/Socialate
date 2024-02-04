import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import { ErrorHandler } from "./utils/ErrorHandler.js";
import ngoRouter from "./routes/ngoRouter.js";
import campRouter from "./routes/campRouter.js";
import { caloriePredictWorker } from "./Queue/CaloriePredictWorker.js";
import donationRouter from "./routes/donationRouter.js";
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/ngos", ngoRouter);
app.use("/api/v1/camps", campRouter);
app.use("/api/v1/donations",donationRouter)

app.use(ErrorHandler);
