import { pool } from "../db/db.js";

const tokenBlackListModel = {
    async create(token) {
        await pool.query('INSERT INTO token_blacklist (token) VALUES (?)', [token]);
        return { token };
    },

    async findOne(token) {
        const [tokens] = await pool.query('SELECT * FROM token_blacklist WHERE token = ?', [token]);
        return tokens.length ? tokens[0] : null;
    }
};

export { tokenBlackListModel };
