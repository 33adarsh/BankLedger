import express from "express";
import cookieParser from "cookie-parser";

/**
 * - Routes required
 */
import userRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import { transactionRoutes } from "./routes/transaction.routes.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));


/**
 * - Use Routes
 */
app.use(express.json())
app.use(cookieParser())

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});

app.use("/api/auth", authLimiter, userRouter);
app.use("/api/accounts",accountRouter);
app.use("/api/transactions", transactionRoutes);


/**
 * - Use Routes
 */

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

app.use((err, req, res, next) => {
    console.error("❌ Global Error Handler:", err);
    res.status(err.status || 500).json({
        message: err.isOperational ? err.message : "Internal server error",
        status: "error"
    });
});

export default app;