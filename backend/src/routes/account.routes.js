import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createAccountController, getAccountBalanceController, getUserAccountsController } from "../controllers/account.controller.js";



const accountRouter = express.Router()

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
accountRouter.post("/", authMiddleware, createAccountController);


/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */

accountRouter.get("/", authMiddleware, getUserAccountsController)


/**
 * - GET /api/accounts/balance/:accountId
 */

accountRouter.get("/balance/:accountId", authMiddleware, getAccountBalanceController);



export default accountRouter;