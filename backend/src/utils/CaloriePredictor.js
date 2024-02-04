import { modelVision } from "../configs/geminiConfig.js";
import { PROMPT } from "../constants.js";

async function predictCalories(file) {
  try {
    
    const result = await modelVision.generateContent([PROMPT, file]);
    const response=await result.response;
    const text=await response.text()
    return text;
  } catch (error) {
    throw new Error("Error in predicting calories")
  }
}

export { predictCalories };