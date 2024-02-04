import { Router } from "express";
import upload from "../middlewares/multerMiddleware.js";
import {
  acceptDonation,
  acceptVolunteer,
  applyAsVolunteer,
  createCamp,
  donateToCamp,
  editCamp,
  generateCampDescription,
  getAllCamps,
  getCampById,
  getCampByNgoId,
  getMyDonations,
  getMyVolunteering,
  removeVolunteering,
} from "../controllers/campController.js";
import { verifyJWTNgo, verifyJWTUser } from "../middlewares/authMiddleware.js";

const campRouter = Router();

campRouter.post("/createcamp", upload.single("banner"), createCamp);
campRouter.post('/generatecampdescription',generateCampDescription)
campRouter.get("/getcampbyid/:id", getCampById);
campRouter.get("/getallcampsbyngo", verifyJWTNgo, getCampByNgoId);
campRouter.patch("/editcamp/:id", verifyJWTNgo, upload.single("banner"), editCamp);
campRouter.get("/getallcamps", getAllCamps);


export default campRouter;
