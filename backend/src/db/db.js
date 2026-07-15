import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;

const connectDB = async () => {
    try {
        const dbConfig = {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        };

        if (process.env.DB_SSL === 'true' || process.env.DB_SSL === 'REQUIRED') {
            dbConfig.ssl = {
                rejectUnauthorized: false
            };
        }

        pool = mysql.createPool(dbConfig);

        const connection = await pool.getConnection();
        console.log("✅ MySQL Connected Successfully");
        connection.release();
        
        const initDatabase = (await import("./initDatabase.js")).default;
        await initDatabase();
    } catch (error) {
        console.error("❌ MySQL Connection Error:", error.message);
        process.exit(1);
    }
};

export { pool };
export default connectDB;