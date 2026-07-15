import { pool } from "../db/db.js";

const ledgerModel = {
    async create({ id, accountId, transactionId, amount, type }, connection = pool) {
        await connection.query(
            'INSERT INTO ledgers (id, account_id, transaction_id, amount, type) VALUES (?, ?, ?, ?, ?)',
            [id, accountId, transactionId, amount, type]
        );
        return { id, accountId, transactionId, amount, type };
    },

    async getBalance(accountId, connection = pool) {
        const [balanceData] = await connection.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END), 0) AS balance
            FROM ledgers
            WHERE account_id = ?
        `, [accountId]);

        return balanceData[0].balance ? parseFloat(balanceData[0].balance) : 0;
    }
};

export { ledgerModel };
