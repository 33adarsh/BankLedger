import { accountModel } from "../models/account.model.js";
import { ledgerModel } from "../models/ledger.model.js";
import crypto from "crypto";

async function createAccountController(req, res, next) {
    const user = req.user;
    const id = crypto.randomUUID();

    try {
        const account = await accountModel.create({ id, userId: user._id });
        account._id = account.id;
        account.user = account.user_id; 

        res.status(201).json({
            account
        });
    } catch (error) {
        console.error("❌ Create Account Error:", error.message);
        return next(error);
    }
}


async function getUserAccountsController(req, res, next) {
    try {
        const accounts = await accountModel.findByUserId(req.user._id);
        
        const formattedAccounts = accounts.map(acc => ({
            ...acc,
            _id: acc.id,
            user: acc.user_id
        }));

        res.status(200).json({
            accounts: formattedAccounts
        });
    } catch (error) {
        console.error("❌ Get Accounts Error:", error.message);
        return next(error);
    }
}


async function getAccountBalanceController(req, res, next) {
    const { accountId } = req.params;

    try {
        const account = await accountModel.findByIdAndUserId(accountId, req.user._id);
        
        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        const balance = await ledgerModel.getBalance(accountId);

        res.status(200).json({
            accountId: account.id,
            balance: balance
        });
    } catch (error) {
        console.error("❌ Get Balance Error:", error.message);
        return next(error);
    }
}

export {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}