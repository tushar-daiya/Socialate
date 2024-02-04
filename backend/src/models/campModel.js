import mongoose from "mongoose";
const Schema = mongoose.Schema;

const campModel = new Schema(
  {
    campName: {
      type: String,
      required: true,
    },
    campAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    campPhone: {
      type: Number,
      required: true,
    },
    campDescription: {
      type: String,
      required: true,
    },
    campBanner: {
      type: String,
      required: true,
    },
    campTiming: {
      type: String,
      required: true,
    },
    campVolunteers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          default: "pending",
          enum: ["pending", "accepted"],
        },
      },
    ],
    campDonations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
    campVolunteersCount: {
      type: Number,
      required: true,
      default: 0,
    },
    campNgo: {
      type: Schema.Types.ObjectId,
      ref: "Ngo",
    },
  },
  {
    timestamps: true,
  }
);

export const DonationCamp = mongoose.model("DonationCamp", campModel);
