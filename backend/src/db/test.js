import pool from "./config/db.js";

async function test() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL");
        connection.release();
    } catch (err) {
        console.log(err);
    }
}

test();