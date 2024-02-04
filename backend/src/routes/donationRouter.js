import { Router } from "express";
import upload from "../middlewares/multerMiddleware.js";
import { verifyJWTNgo, verifyJWTUser } from "../middlewares/authMiddleware.js";
import {
  acceptVolunteer,
  applyVolunteer,
  changeStatus,
  donateToCamp,
  getAllDonations,
  getMyVolunteering,
  getUserDonations,
  getallvolunteers,
  removeVolunteerApplication,
} from "../controllers/donationController.js";
const donationRouter = Router();

donationRouter.post(
  "/donate",
  verifyJWTUser,
  upload.single("foodImage"),
  donateToCamp
);
donationRouter.patch("/applyvolunteer/:id", verifyJWTUser, applyVolunteer);
donationRouter.patch(
  "/removevolunteerapplication/:id",
  verifyJWTUser,
  removeVolunteerApplication
);
donationRouter.get("/getuserdonations", verifyJWTUser, getUserDonations);
donationRouter.get("/getmyvolunteering", verifyJWTUser, getMyVolunteering);
donationRouter.get("/getalldonations", verifyJWTNgo, getAllDonations);
donationRouter.get("/getallvolunteers", verifyJWTNgo, getallvolunteers);
donationRouter.patch("/changestatus/:id", verifyJWTNgo, changeStatus);
donationRouter.patch("/acceptvolunteer", verifyJWTNgo, acceptVolunteer);
export default donationRouter;
