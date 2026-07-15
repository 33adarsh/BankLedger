import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('DROP TABLE IF EXISTS token_blacklist, ledgers, transactions, accounts, users');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Dropped');
    process.exit(0);
})();
