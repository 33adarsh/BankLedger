import { tokenBlackListModel } from "../models/blackList.model.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    try {
        const blacklisted = await tokenBlackListModel.findOne(token);
        if (blacklisted) {
            return res.status(401).json({
                message: "Unauthorized access, token is invalid"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            });
        }

        if (user.is_blacklisted) {
            return res.status(403).json({
                message: "Forbidden access, your account has been blacklisted"
            });
        }

        user._id = user.id; 
        req.user = user;

        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
}

async function authSystemUserMiddleware(req,res,next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    try {
        const blacklisted = await tokenBlackListModel.findOne(token);
        if (blacklisted) {
            return res.status(401).json({
                message: "Unauthorized access, token is invalid"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId);
        
        if (!user) {
             return res.status(401).json({
                message: "Unauthorized access, user not found"
            });
        }

        if (user.is_blacklisted) {
            return res.status(403).json({
                message: "Forbidden access, your account has been blacklisted"
            });
        }
        
        if (!user.system_user) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            });
        }

        user._id = user.id;
        req.user = user;

        return next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }

}
export {
    authMiddleware,
    authSystemUserMiddleware
}