import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { Ngo } from "../models/ngoModel.js";
import { options } from "../configs/options.js";
const verifyJWTUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    ErrorHandler(error, req, res);
  }
};
const verifyJWTNgo = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const ngo = await Ngo.findById(decoded?._id).select(
      "-password -refreshToken"
    );
    if (!ngo) {
      throw new ApiError(401, "Unauthorized");
    }
    req.ngo = ngo;
    next();
  } catch (error) {
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    ErrorHandler(error, req, res);
  }
}

export { verifyJWTUser, verifyJWTNgo };

