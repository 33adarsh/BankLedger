import { pool } from "../db/db.js";

const userModel = {
    async findByEmail(email) {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return users.length ? users[0] : null;
    },

    async findById(id) {
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return users.length ? users[0] : null;
    },

    async create({ id, email, name, password }) {
        await pool.query(
            'INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)',
            [id, email, name, password]
        );
        return { id, email, name };
    }
};

export { userModel };
