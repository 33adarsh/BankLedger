import { pool } from "../db/db.js";
import { accountModel } from "../models/account.model.js";
import { transactionModel } from "../models/transaction.model.js";
import { ledgerModel } from "../models/ledger.model.js";
import crypto from "crypto";
import { emailService } from "../services/email.service.js";
import { userModel } from "../models/user.model.js";

async function createTransaction(req, res, next) {
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const isTransactionAlreadyExists = await transactionModel.findByIdempotencyKey(idempotencyKey, connection);
        
        if (isTransactionAlreadyExists) {
            await connection.rollback();
            connection.release();

            if (isTransactionAlreadyExists.status === "SUCCESS" || isTransactionAlreadyExists.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already processed",
                    transaction: { ...isTransactionAlreadyExists, _id: isTransactionAlreadyExists.id }
                });
            }
            if (isTransactionAlreadyExists.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction is still processing",
                });
            }
            if (isTransactionAlreadyExists.status === "FAILED") {
                return res.status(500).json({
                    message: "Transaction processing failed, please retry"
                });
            }
            if (isTransactionAlreadyExists.status === "REVERSED") {
                return res.status(500).json({
                    message: "Transaction was reversed, please retry"
                });
            }
        }

        const fromUserAccount = await accountModel.findById(fromAccount, connection);
        const toUserAccount = await accountModel.findById(toAccount, connection);
        
        if (!fromUserAccount || !toUserAccount) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
                message: "Invalid fromAccount or toAccount"
            });
        }

        const fromUser = await userModel.findById(fromUserAccount.user_id);
        const toUser = await userModel.findById(toUserAccount.user_id);

        if (fromUser?.is_blacklisted || toUser?.is_blacklisted) {
            await connection.rollback();
            connection.release();
            return res.status(403).json({
                message: "One of the users involved in this transaction is blacklisted"
            });
        }

        const account1 = fromAccount < toAccount ? fromAccount : toAccount;
        const account2 = fromAccount < toAccount ? toAccount : fromAccount;

        await accountModel.findByIdWithLock(account1, connection);
        await accountModel.findByIdWithLock(account2, connection);

        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
                message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
            });
        }

        const balance = await ledgerModel.getBalance(fromAccount, connection);

        if (balance < amount) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
                message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
            });
        }

        const transactionId = crypto.randomUUID();

        await transactionModel.create({
            id: transactionId,
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: 'PENDING'
        }, connection);

        const debitLedgerId = crypto.randomUUID();
        await ledgerModel.create({
            id: debitLedgerId,
            accountId: fromAccount,
            transactionId: transactionId,
            amount,
            type: 'DEBIT'
        }, connection);

        const creditLedgerId = crypto.randomUUID();
        await ledgerModel.create({
            id: creditLedgerId,
            accountId: toAccount,
            transactionId: transactionId,
            amount,
            type: 'CREDIT'
        }, connection);

        await transactionModel.updateStatus(transactionId, 'SUCCESS', connection);

        await connection.commit();
        connection.release();

        await emailService(req.user.email, req.user.name, amount, toAccount);

        const finalTx = await transactionModel.findById(transactionId);
        finalTx._id = finalTx.id;

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction: finalTx
        });

    } catch (error) {
        await connection.rollback();
        connection.release();
        
        console.error("❌ Transaction Error:", error.message);
        return next(error);
    }
} 

async function createInitialFundsTransaction(req, res, next) {
     const { toAccount, amount, idempotencyKey } = req.body;

     if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        });
     }

     const connection = await pool.getConnection();

     try {
        await connection.beginTransaction();

        const isTransactionAlreadyExists = await transactionModel.findByIdempotencyKey(idempotencyKey, connection);
        
        if (isTransactionAlreadyExists) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: "Transaction already processed" });
        }

        const toUserAccount = await accountModel.findById(toAccount, connection);

        if (!toUserAccount) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
                message: "Invalid toAccount"
            });
        }

        const toUser = await userModel.findById(toUserAccount.user_id);
        if (toUser?.is_blacklisted) {
            await connection.rollback();
            connection.release();
            return res.status(403).json({
                message: "The receiving user is blacklisted"
            });
        }

        const accounts = await accountModel.findByUserId(req.user._id);

        if (!accounts || accounts.length === 0) {
             await connection.rollback();
            connection.release();
            return res.status(400).json({
                message: "System user account not found"
            });
        }

        const fromAccountId = accounts[0].id;
        
        const account1 = fromAccountId < toAccount ? fromAccountId : toAccount;
        const account2 = fromAccountId < toAccount ? toAccount : fromAccountId;

        await accountModel.findByIdWithLock(account1, connection);
        await accountModel.findByIdWithLock(account2, connection);

        const transactionId = crypto.randomUUID();

        await transactionModel.create({
            id: transactionId,
            fromAccount: fromAccountId,
            toAccount,
            amount,
            idempotencyKey,
            status: 'PENDING'
        }, connection);

        const debitLedgerId = crypto.randomUUID();
        await ledgerModel.create({
            id: debitLedgerId,
            accountId: fromAccountId,
            transactionId: transactionId,
            amount,
            type: 'DEBIT'
        }, connection);

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
        })();

        const creditLedgerId = crypto.randomUUID();
        await ledgerModel.create({
            id: creditLedgerId,
            accountId: toAccount,
            transactionId: transactionId,
            amount,
            type: 'CREDIT'
        }, connection);

        await transactionModel.updateStatus(transactionId, 'SUCCESS', connection);

        await connection.commit();
        connection.release();

        const finalTx = await transactionModel.findById(transactionId);
        finalTx._id = finalTx.id;

        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction: finalTx
        });
    } catch(error) {
        await connection.rollback();
        connection.release();
        console.error("❌ Initial Funds Transaction Error:", error.message);
        return next(error);
    }
}

async function depositFunds(req, res, next) {
    const { accountId, amount } = req.body;

    if (!accountId || amount === undefined) {
        return res.status(400).json({
            message: "accountId and amount are required"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            message: "amount must be greater than zero"
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const toUserAccount = await accountModel.findById(accountId, connection);

        if (!toUserAccount) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
                message: "Invalid accountId"
            });
        }

        if (toUserAccount.user_id !== req.user._id) {
            await connection.rollback();
            connection.release();
            return res.status(403).json({
                message: "Forbidden: You do not own this account"
            });
        }

        const toUser = await userModel.findById(toUserAccount.user_id);
        if (toUser?.is_blacklisted) {
            await connection.rollback();
            connection.release();
            return res.status(403).json({
                message: "The receiving user is blacklisted"
            });
        }

        const [systemUsers] = await connection.query('SELECT id FROM users WHERE system_user = true LIMIT 1');
        if (systemUsers.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(500).json({ message: "System user not found" });
        }
        
        const [systemAccounts] = await connection.query('SELECT id FROM accounts WHERE user_id = ? LIMIT 1', [systemUsers[0].id]);
        if (systemAccounts.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(500).json({ message: "System account not found" });
        }
        
        const fromAccountId = systemAccounts[0].id;

        const account1 = fromAccountId < accountId ? fromAccountId : accountId;
        const account2 = fromAccountId < accountId ? accountId : fromAccountId;

        await accountModel.findByIdWithLock(account1, connection);
        await accountModel.findByIdWithLock(account2, connection);

        if (toUserAccount.status !== "ACTIVE") {
            await connection.rollback();
            connection.release();
            return res.status(400).json({
                message: "Account must be ACTIVE to process deposit"
            });
        }

        const transactionId = crypto.randomUUID();

        await transactionModel.create({
            id: transactionId,
            fromAccount: fromAccountId,
            toAccount: accountId,
            amount,
            idempotencyKey: req.body.idempotencyKey || crypto.randomUUID(),
            status: 'PENDING'
        }, connection);

        const debitLedgerId = crypto.randomUUID();
        await ledgerModel.create({
            id: debitLedgerId,
            accountId: fromAccountId,
            transactionId: transactionId,
            amount,
            type: 'DEBIT'
        }, connection);

        const creditLedgerId = crypto.randomUUID();
        await ledgerModel.create({
            id: creditLedgerId,
            accountId: accountId,
            transactionId: transactionId,
            amount,
            type: 'CREDIT'
        }, connection);

        await transactionModel.updateStatus(transactionId, 'SUCCESS', connection);

        await connection.commit();
        connection.release();

        const finalTx = await transactionModel.findById(transactionId);
        finalTx._id = finalTx.id;

        return res.status(201).json({
            message: "Deposit completed successfully",
            transaction: finalTx
        });

    } catch (error) {
        await connection.rollback();
        connection.release();
        
        console.error("❌ Deposit Error:", error.message);
        return next(error);
    }
}

const transactionController = {createTransaction, createInitialFundsTransaction, depositFunds};

export default transactionController;