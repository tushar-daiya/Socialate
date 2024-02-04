import { options } from "../configs/options.js";
import { Donation } from "../models/donationModel.js";
import { Ngo } from "../models/ngoModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { convertImageToBase64 } from "../utils/ImageToBase64.js";
import { uploadImagetoCloudinary } from "../utils/cloudinary.js";

const generateAccessandRefreshTokens = async (ngoId) => {
  try {
    let ngo = await Ngo.findById(ngoId);
    const accessToken = await ngo.generateAccessToken();
    const refreshToken = await ngo.generateRefreshToken();
    ngo.refreshToken = refreshToken;
    await ngo.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
};
const ngoRegister = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      certificateId,
      city,
      pincode,
      state,
      street,
    } = req.body;
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !certificateId ||
      !city ||
      !pincode ||
      !state ||
      !street
    ) {
      throw new ApiError(400, "All fields are required");
    }
    if (
      [
        name,
        email,
        phone,
        password,
        certificateId,
        city,
        pincode,
        state,
        street,
      ].some((field) => !field.trim())
    ) {
      throw new ApiError(400, "All fields are required");
    }
    let ngo = await Ngo.findOne({ email });
    if (ngo) {
      throw new ApiError(400, "NGO already exists");
    }
    const file = req.file;
    if (!file) {
      throw new ApiError(400, "Logo is required");
    }
    const { imgSrcString } = await convertImageToBase64(file);
    const logo = await uploadImagetoCloudinary(imgSrcString);
    if (!logo) {
      throw new ApiError(500, "Internal server error");
    }
    ngo = await Ngo.create({
      name,
      email,
      phone,
      address: {
        street,
        city,
        pincode,
        state,
      },
      password,
      certificateId,
      logoUrl: logo.secure_url,
    });
    res
      .status(201)
      .json(new ApiResponse(201, ngo, "NGO registered successfully"));
  } catch (error) {
    next(error);
  }
};

const ngoLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    if ([email, password].some((field) => !field.trim())) {
      throw new ApiError(400, "All fields are required");
    }
    let ngo = await Ngo.findOne({ email });
    if (!ngo) {
      throw new ApiError(404, "NGO not found");
    }
    let isMatch = await ngo.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
      ngo._id
    );
    const loggedInNgo = await Ngo.findById(ngo._id).select(
      "-password -refreshToken"
    );
    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json(new ApiResponse(200, loggedInNgo, "NGO logged in successfully"));
  } catch (error) {
    next(error);
  }
};

const ngoLogout = async (req, res, next) => {
  try {
    await Ngo.findByIdAndUpdate(
      req.ngo._id,
      { refreshToken: null },
      { new: true }
    );
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "Ngo logged out successfully"));
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.ngo._id)
      .populate("donationCamps")
      .select("-password -certificateId");
    return res
      .status(200)
      .json(new ApiResponse(200, ngo, "NGO profile fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {street,city,state,pincode,about}=req.body
    const ngo=await Ngo.findById(req.ngo._id)
    if(!ngo){
      throw new ApiError(404,"NGO not found")
    }
    ngo.address.street=street||ngo.address.street
    ngo.address.city=city||ngo.address.city
    ngo.address.state=state||ngo.address.state
    ngo.address.pincode=pincode||ngo.address.pincode
    ngo.about=about||ngo.about
    await ngo.save()
    return res.status(200).json(new ApiResponse(200,ngo,"NGO profile updated successfully"))
  } catch (error) {
    next(error)
  }
}

const getNgoById = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.params.id)
      .populate({
        path: "donationCamps",
        select: "campName campBanner campTiming campAddress",
      })
      .select("-password -refreshToken -certificateId");
    if (!ngo) {
      throw new ApiError(404, "NGO not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, ngo, "NGO fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllNgos = async (req, res, next) => {
  try {
    const ngos = await Ngo.find().select("name address email logoUrl isValidated");
    return res
      .status(200)
      .json(new ApiResponse(200, ngos, "All ngos fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllDonations = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.ngo._id);
    if (!ngo) {
      return res.status(404).json({ error: "NGO not found." });
    }

    // Populate the donationsCamps field in the NGO model
    await ngo.populate("donationCamps");

    // Extract the donationsCamps from the populated field
    const donationCamps = ngo.donationCamps;

    // Create an array to store all donations associated with the NGO
    let allDonations = [];

    // Loop through each donation camp and retrieve the donations
    for (const camp of donationCamps) {
      const donations = await Donation.find({ donatedTo: camp._id })
        .populate({
          path: "donatedBy",
          select: "fullName email phone",
        })
        .populate({
          path: "donatedTo",
          select: "campName",
        });

      allDonations = allDonations.concat(donations);
    }

    res.status(200).json({ donations: allDonations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  ngoRegister,
  ngoLogin,
  ngoLogout,
  updateProfile,
  getMyProfile,
  getNgoById,
  getAllNgos,
  getAllDonations,
};
