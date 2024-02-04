import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImagetoCloudinary = async (dataUri) => {
  try {
    if (!dataUri) {
      return null;
    }
    const res = await cloudinary.uploader.upload(dataUri,{
      folder: 'images',
    });
    return res;
  } catch (error) {
    console.log(error)
    return error;
  }
};

export { uploadImagetoCloudinary };
