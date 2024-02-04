import { Router } from "express";
import {
  getMyProfile,
  getUserById,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";
import upload from "../middlewares/multerMiddleware.js";
import { verifyJWTUser } from "../middlewares/authMiddleware.js";
const userRouter = Router();
userRouter.post("/register", upload.none(), userRegister);
userRouter.post("/login", upload.none(), userLogin);
userRouter.get("/logout", verifyJWTUser, userLogout);
userRouter.get("/me", verifyJWTUser, getMyProfile);

export default userRouter;
