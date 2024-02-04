import mongoose from "mongoose";
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  donatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donatedTo: {
    type: Schema.Types.ObjectId,
    ref: "DonationCamp",
    required: true,
  },

  foodName: {
    type: String,
    required: true,
  },
  foodQuantity: {
    type: String,
    required: true,
  },
  foodImage: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
    required: false,
  },
  pickupAddress: {
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
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "pickedup", "distributed"],
  },
});

export const Donation = mongoose.model("Donation", donationSchema);
