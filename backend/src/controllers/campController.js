import { caloriePredictQueue } from "../Queue/CaloriePredictQueue.js";
import { modelPro } from "../configs/geminiConfig.js";
import { DonationCamp } from "../models/campModel.js";
import { Donation } from "../models/donationModel.js";
import { Ngo } from "../models/ngoModel.js";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { predictCalories } from "../utils/CaloriePredictor.js";
import { convertImageToBase64 } from "../utils/ImageToBase64.js";
import { uploadImagetoCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
const createCamp = async (req, res, next) => {
  try {
    const {
      campName,
      street,
      city,
      state,
      pincode,
      campPhone,
      campDescription,
      campTiming,
      campNgo,
    } = req.body;
    if (
      !campName ||
      !street ||
      !city ||
      !state ||
      !pincode ||
      !campPhone ||
      !campDescription ||
      !campTiming ||
      !campNgo
    ) {
      throw new ApiError(400, "All fields are required");
    }
    if (
      [
        campName,
        street,
        city,
        state,
        pincode,
        campPhone,
        campDescription,
        campTiming,
        campNgo,
      ].some((field) => !field.trim())
    ) {
      throw new ApiError(400, "All fields are required");
    }
    const file = req?.file;
    if (!file) {
      throw new ApiError(400, "Banner is required");
    }
    const { imgSrcString } = await convertImageToBase64(file);
    const banner = await uploadImagetoCloudinary(imgSrcString);
    if (!banner) {
      throw new ApiError(500, "Something went wrong");
    }

    const camp = await DonationCamp.create({
      campName,
      campAddress: {
        street,
        city,
        state,
        pincode,
      },
      campPhone,
      campDescription,
      campBanner: banner?.secure_url,
      campTiming,
      campNgo,
    });
    const ngo = await Ngo.findById(campNgo);
    ngo.donationCamps.unshift(camp._id);
    await ngo.save();
    return res.status(201).json(new ApiResponse(201, camp, "Camp created"));
  } catch (error) {
    next(error);
  }
};

const getCampById = async (req, res, next) => {
  try {
    const camp = await DonationCamp.findById(req.params.id)
      .populate({
        path: "campNgo",
        select: "name email logoUrl _id address",
      })
      .populate({
        path: "campVolunteers",
        populate: {
          path: "user",
          select: "fullName phone _id",
        },
      })
      .populate({
        path: "campDonations",
        select: "foodName status foodQuantity additionalInfo foodImage donatedBy",
        populate: {
          path: "donatedBy",
          select: "fullName _id",
        },
      });
    if (!camp) {
      throw new ApiError(404, "Camp not found");
    }
    res.status(200).json(new ApiResponse(200, camp, "Camp found"));
  } catch (error) {
    next(error);
  }
};

const getCampByNgoId = async (req, res, next) => {
  try {
    const camps = await DonationCamp.find({ campNgo: req.ngo._id })
      .populate({
        path: "campNgo",
        select: "name email logoUrl _id",
      })
      .select("-campDonations");
    if (!camps) {
      throw new ApiError(404, "Camp not found");
    }
    res.status(200).json(new ApiResponse(200, camps, "Camp found"));
  } catch (error) {
    next(error);
  }
};

const getAllCamps = async (req, res, next) => {
  try {
    const camps = await DonationCamp.find().select(
      "campAddress campBanner campName campTiming"
    );
    if (!camps) {
      throw new ApiError(404, "No camps to display");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, camps, "Camps fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const donateToCamp = async (req, res, next) => {
  try {
    const { donatedBy, donatedTo, foodName, quantity, unit, preparedOn } =
      req.body;
    if (!donatedBy || !donatedTo || !foodName || !quantity || !unit) {
      throw new ApiError(400, "All fields are required");
    }
    if (
      [donatedBy, donatedTo, foodName, quantity, unit].some(
        (field) => !field.trim()
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
    const file = req?.file;
    if (!file) {
      throw new ApiError(400, "Food image is required");
    }
    const { imgSrcString, b64 } = await convertImageToBase64(file);
    const foodImage = await uploadImagetoCloudinary(imgSrcString);
    if (!foodImage) {
      throw new ApiError(500, "Something went wrong");
    }
    const data = {
      inlineData: {
        data: b64,
        mimeType: file.mimetype,
      },
    };

    const donation = await Donation.create({
      donatedBy,
      donatedTo,
      foodName,
      foodQuantity: {
        quantity,
        unit,
      },
      foodImage: foodImage?.secure_url,
      preparedOn,
    });
    const user = await User.findById(donatedBy);
    user.donations.unshift(donation._id);
    await user.save();
    const camp = await DonationCamp.findById(donatedTo);
    camp.campDonations.unshift(donation._id);
    await camp.save();
    await caloriePredictQueue.add("caloriePredict", {
      file: data,
      donationId: donation._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, donation, "Donation created"));
  } catch (error) {
    next(error);
  }
};

const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donatedBy: req.user._id })
      .populate({
        path: "donatedTo",
        select: "campName",
      })
      .select("-foodImage -donatedBy");
    if (!donations) {
      throw new ApiError(404, "No donations found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, donations, "Donations fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getMyVolunteering = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "volunteering",
      populate: {
        path: "camp",
        select: "campName campTiming",
      },
    });
    if (!user.volunteering) {
      throw new ApiError(404, "No volunteering found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user.volunteering,
          "Volunteering fetched successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const removeVolunteering = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.volunteering) {
      throw new ApiError(404, "No volunteering found");
    }
    const volunteering = user.volunteering.find(
      (volunteer) => volunteer.camp == req.params.id
    );
    if (!volunteering) {
      throw new ApiError(404, "Volunteering not found");
    }
    user.volunteering = user.volunteering.filter(
      (volunteer) => volunteer.camp.toString() != req.params.id.toString()
    );
    await user.save();
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      throw new ApiError(404, "Camp not found");
    }
    camp.campVolunteers = camp.campVolunteers.filter(
      (volunteer) => volunteer.user.toString() != req.user._id.toString()
    );
    await camp.save();
    res.status(200).json(new ApiResponse(200, null, "Volunteering removed"));
  } catch (error) {
    next(error);
  }
};

const acceptDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      throw new ApiError(404, "Donation not found");
    }
    donation.isAccepted = true;
    await donation.save();
    res.status(200).json(new ApiResponse(200, donation, "Donation accepted"));
  } catch (error) {
    next(error);
  }
};

const applyAsVolunteer = async (req, res, next) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      throw new ApiError(404, "Camp not found");
    }
    if (
      camp.campVolunteers.find(
        (volunteer) => volunteer.user.toString() == req.user._id.toString()
      )
    ) {
      throw new ApiError(400, "Already applied");
    }
    camp.campVolunteers.push({ user: req.user._id });
    await camp.save();
    const user = await User.findById(req.user._id);
    user.volunteering.push({ camp: req.params.id });
    await user.save();
    res.status(200).json(new ApiResponse(200, camp, "Volunteer applied"));
  } catch (error) {
    next(error);
  }
};

const acceptVolunteer = async (req, res, next) => {
  try {
    const { userId, campId } = req.body;
    const camp = await DonationCamp.findById(campId);
    if (!camp) {
      throw new ApiError(404, "Camp not found");
    }
    const volunteer = camp.campVolunteers.find(
      (volunteer) => volunteer.user == userId
    );
    if (!volunteer) {
      throw new ApiError(404, "Volunteer not found");
    }
    volunteer.isAccepted = true;
    await camp.save();
    const user = await User.findById(userId);
    const volunteering = user.volunteering.find(
      (volunteer) => volunteer.camp == campId
    );
    volunteering.isAccepted = true;
    await user.save();
    res.status(200).json(new ApiResponse(200, camp, "Volunteer accepted"));
  } catch (error) {
    next(error);
  }
};

const editCamp = async (req, res, next) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      throw new ApiError(404, "Camp not found");
    }
    const {
      campName,
      street,
      city,
      state,
      pincode,
      campPhone,
      campDescription,
      campTiming,
    } = req.body;
    const file = req?.file;
    if (file) {
      const { imgSrcString } = await convertImageToBase64(file);
      const banner = await uploadImagetoCloudinary(imgSrcString);
      if (!banner) {
        throw new ApiError(500, "Something went wrong");
      }
      camp.campBanner = banner?.secure_url;
    }
    camp.campName = campName || camp.campName;
    camp.campAddress.street = street || camp.campAddress.street;
    camp.campAddress.city = city || camp.campAddress.city;
    camp.campAddress.state = state || camp.campAddress.state;
    camp.campAddress.pincode = pincode || camp.campAddress.pincode;
    camp.campPhone = campPhone || camp.campPhone;
    camp.campDescription = campDescription || camp.campDescription;
    camp.campTiming = campTiming || camp.campTiming;
    await camp.save();
    res
      .status(200)
      .json(new ApiResponse(200, camp, "Camp updated successfully"));
  } catch (error) {
    next(error);
  }
};

const generateCampDescription = async (req, res, next) => {
  try {
    const input = req.body.input;
    console.log(input)
    const prompt = `You are an expert in generating food donations camp descriptions based on the given details provided by the user. Genrate maximum 100 words The input is ${input}`;
    const result = await modelPro.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return res
      .status(200)
      .json(new ApiResponse(200, text, "Camp description generated"));
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export {
  createCamp,
  getCampById,
  getCampByNgoId,
  donateToCamp,
  acceptDonation,
  applyAsVolunteer,
  acceptVolunteer,
  getAllCamps,
  getMyDonations,
  getMyVolunteering,
  removeVolunteering,
  editCamp,
  generateCampDescription
};
