import { pool } from "../db/db.js";

const accountModel = {
    async create({ id, userId }) {
        await pool.query('INSERT INTO accounts (id, user_id) VALUES (?, ?)', [id, userId]);
        const [accounts] = await pool.query('SELECT * FROM accounts WHERE id = ?', [id]);
        return accounts[0];
    },

    async findByUserId(userId) {
        const [accounts] = await pool.query('SELECT * FROM accounts WHERE user_id = ?', [userId]);
        return accounts;
    },

    async findByIdAndUserId(accountId, userId) {
        const [accounts] = await pool.query('SELECT * FROM accounts WHERE id = ? AND user_id = ?', [accountId, userId]);
        return accounts.length ? accounts[0] : null;
    },

    async findById(accountId, connection = pool) {
        const [accounts] = await connection.query('SELECT * FROM accounts WHERE id = ?', [accountId]);
        return accounts.length ? accounts[0] : null;
    },

    async findByIdWithLock(accountId, connection) {
        const [accounts] = await connection.query('SELECT * FROM accounts WHERE id = ? FOR UPDATE', [accountId]);
        return accounts.length ? accounts[0] : null;
    }
};

export { accountModel };
