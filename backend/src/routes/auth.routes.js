import express from "express";
import {userRegisterController, userLoginController, userLogoutController} from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";
import { emailService } from "../services/email.service.js";

const userRouter = express.Router()

/* POST /api/auth/register */
userRouter.post("/register", userRegisterController)

/* POST /api/auth/login */
userRouter.post("/login", userLoginController)


/**
 * - POST /api/auth/logout
 */
userRouter.post("/logout",userLogoutController)

export default userRouter;