import { userModel } from "../models/user.model.js";
import { tokenBlackListModel } from "../models/blackList.model.js";
import jwt from "jsonwebtoken";
import { emailService } from "../services/email.service.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

/**
* - user register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res, next){
    const {email, password, name} = req.body;

    try {
        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {
            return res.status(422).json({
                message: "User already exists with email.",
                status: "failed"
            });
        }

        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({ id, email, name, password: hashedPassword });

        await emailService(email, name);

        const token = jwt.sign({userId: id}, process.env.JWT_SECRET, {expiresIn: "3d"});

        res.cookie("token", token);

        return res.status(201).json({
            user:{
                _id: id,
                email: email,
                name: name
            },
            token
        });
    } catch (error) {
        console.error("❌ Auth Registration Error:", error.message);
        return next(error);
    }
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */ 
async function userLoginController(req, res, next){
    const {email, password} = req.body;

    try {
        const user = await userModel.findByEmail(email);

        if(!user){
            return res.status(401).json({
                message: "Email or Password is Invalid"
            });
        }

        if (user.is_blacklisted) {
            return res.status(403).json({
                message: "Your account has been blacklisted. Please contact support."
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword){
            return res.status(401).json({
                message: "Email or Password is Invalid"
            });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("token", token);

        res.status(200).json({
            user: {
                _id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        console.error("❌ Auth Login Error:", error.message);
        return next(error);
    }
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        });
    }

    try {
        await tokenBlackListModel.create(token);
        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("❌ Auth Logout Error:", error.message);
        res.clearCookie("token");
        return next(error);
    }
}

export {
    userRegisterController,
    userLoginController,
    userLogoutController
};