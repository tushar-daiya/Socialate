import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { options } from "../configs/options.js";
const generateAccessandRefreshTokens = async (userId) => {
  try {
    let user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
};
export const userRegister = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !phone || !password) {
      throw new ApiError(400, "All fields are required");
    }
    if ([fullName, email, password].some((field) => !field.trim())) {
      throw new ApiError(400, "All fields are required");
    }
    let user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, "User already exists");
    }
    user = await User.create({
      fullName,
      email,
      phone,
      password,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully"));
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    if ([email, password].some((field) => !field.trim())) {
      throw new ApiError(400, "All fields are required");
    }
    let user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    let isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
      user._id
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken,options)
      .cookie("refreshToken", refreshToken,options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { refreshToken: null },
      { new: true }
    );
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id)
      .populate("donations volunteering")
      .select("-password -refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("donations volunteering")
      .select("-password -refreshToken");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};
