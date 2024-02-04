import { caloriePredictQueue } from "../Queue/CaloriePredictQueue.js";
import { DonationCamp } from "../models/campModel.js";
import { Donation } from "../models/donationModel.js";
import { Ngo } from "../models/ngoModel.js";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { convertImageToBase64 } from "../utils/ImageToBase64.js";
import { uploadImagetoCloudinary } from "../utils/cloudinary.js";

export const donateToCamp = async (req, res, next) => {
  try {
    const { donatedBy, donatedTo, foodName, foodQuantity, amount,street,state,city,pincode } = req.body;
    if (!donatedBy || !donatedTo || !foodName || !foodQuantity || !amount||!state||!city||!pincode||!street) {
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
      foodQuantity,
      foodImage: foodImage?.secure_url,
      amount,
      pickupAddress: {
        street,
        state,
        city,
        pincode,
      },
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
    console.log(error)
    next(error);
  }
};

export const applyVolunteer = async (req, res, next) => {
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

export const removeVolunteerApplication = async (req, res, next) => {
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

export const getUserDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donatedBy: req.user._id }).populate(
      {
        path: "donatedTo",
        select: "campName",
      }
    );
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

export const getMyVolunteering = async (req, res, next) => {
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

export const getAllDonations = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.ngo._id);
    if (!ngo) {
      return res.status(404).json(new ApiResponse(404, null, "NGO not found"));
    }

    await ngo.populate("donationCamps");

    const donationCamps = ngo.donationCamps;

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

    res
      .status(200)
      .json(new ApiResponse(200, allDonations, "Donations fetched"));
  } catch (error) {
    next(error);
  }
};

export const getallvolunteers = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.ngo._id);

    if (!ngo) {
      return res.status(404).json(new ApiResponse(404, null, "NGO not found"));
    }
    await ngo.populate({
      path: "donationCamps",
      populate: {
        path: "campVolunteers",
        populate: {
          path: "user",
          select: "fullName phone",
        },
      },
    });
    const donationCamps = ngo.donationCamps;
    let allVolunteers = [];
    donationCamps.forEach((camp) => {
      
      camp.campVolunteers.forEach((volunteer) => {
        let oneVolunteer = {
          user:{
            _id: "",
            fullName: "",
            phone: "",
          },
          camp: {
            _id: "",
            campName: "",
            campTiming: "",
          },
        };
        oneVolunteer.user._id = volunteer.user._id;
        oneVolunteer.user.fullName = volunteer.user.fullName;
        oneVolunteer.user.phone= volunteer.user.phone;
        oneVolunteer.status = volunteer.status;
        oneVolunteer.camp.campName = camp.campName;
        oneVolunteer.camp.campTiming = camp.campTiming;
        oneVolunteer.camp._id = camp._id;
        allVolunteers.push(oneVolunteer);
      });
    });

    res
      .status(200)
      .json(new ApiResponse(200, allVolunteers, "Volunteers fetched"));
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      throw new ApiError(404, "Donation not found");
    }
    donation.status = req.body.status;
    await donation.save();
    res.status(200).json(new ApiResponse(200, donation, "Status changed"));
  } catch (error) {
    next(error);
  }
};

export const acceptVolunteer = async (req, res, next) => {
  try {
    const { userId, campId } = req.body;
    const camp = await DonationCamp.findById(campId);
    if (!camp) {
      throw new ApiError(404, "Camp not found");
    }
    const volunteer = camp.campVolunteers.find(
      (volunteer) => volunteer.user.toString() == userId.toString()
    );
    if (!volunteer) {
      throw new ApiError(404, "Volunteer not found");
    }
    volunteer.status = "accepted";
    await camp.save();
    const user = await User.findById(userId);
    const volunteering = user.volunteering.find(
      (volunteer) => volunteer.camp.toString() == campId.toString()
    );
    volunteering.status = "accepted";
    await user.save();
    res.status(200).json(new ApiResponse(200, camp, "Volunteer accepted"));
  } catch (error) {
    next(error);
  }
};
