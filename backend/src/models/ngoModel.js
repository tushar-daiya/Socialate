import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const ngoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: false,
    },
    certificateId: {
      type: String,
      required: true,
    },
    donationCamps: [
      {
        type: Schema.Types.ObjectId,
        ref: "DonationCamp",
      },
    ],
    isValidated: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
ngoSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

ngoSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

ngoSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
ngoSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const Ngo = mongoose.model("Ngo", ngoSchema);
