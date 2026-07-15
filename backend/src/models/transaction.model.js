import { pool } from "../db/db.js";

const transactionModel = {
    async create({ id, fromAccount, toAccount, amount, idempotencyKey, status }, connection = pool) {
        await connection.query(
            'INSERT INTO transactions (id, from_account, to_account, amount, idempotency_key, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, fromAccount, toAccount, amount, idempotencyKey, status]
        );
        return { id, fromAccount, toAccount, amount, idempotencyKey, status };
    },

    async findByIdempotencyKey(key, connection = pool) {
        const [transactions] = await connection.query('SELECT * FROM transactions WHERE idempotency_key = ?', [key]);
        return transactions.length ? transactions[0] : null;
    },

    async updateStatus(transactionId, status, connection = pool) {
        await connection.query(
            'UPDATE transactions SET status = ? WHERE id = ?',
            [status, transactionId]
        );
    },

    async findById(transactionId, connection = pool) {
        const [transactions] = await connection.query('SELECT * FROM transactions WHERE id = ?', [transactionId]);
        return transactions.length ? transactions[0] : null;
    }
};

export { transactionModel };
