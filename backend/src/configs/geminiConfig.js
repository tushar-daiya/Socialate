import { GoogleGenerativeAI } from "@google/generative-ai";
const generativeAI = new GoogleGenerativeAI(process.env.API_KEY);
const modelVision = generativeAI.getGenerativeModel({ model: "gemini-pro-vision" });
const modelPro=generativeAI.getGenerativeModel({model:"gemini-pro"})
export {modelVision,modelPro};
