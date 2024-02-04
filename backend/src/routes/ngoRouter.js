import { Router } from "express";
import { getAllDonations, getAllNgos, getMyProfile, getNgoById, ngoLogin, ngoLogout, ngoRegister, updateProfile } from "../controllers/ngoController.js";
import upload from "../middlewares/multerMiddleware.js";
import { verifyJWTNgo } from "../middlewares/authMiddleware.js";
const ngoRouter = Router();

ngoRouter.post("/register",upload.single("logo"), ngoRegister);
ngoRouter.post("/login",upload.none(), ngoLogin);
ngoRouter.get("/logout",verifyJWTNgo,ngoLogout)
ngoRouter.get("/me",verifyJWTNgo,getMyProfile)
ngoRouter.get("/getallngos",getAllNgos)
ngoRouter.patch("/editprofile",verifyJWTNgo,upload.none(),updateProfile)
ngoRouter.get("/getngobyid/:id",getNgoById)
export default ngoRouter;