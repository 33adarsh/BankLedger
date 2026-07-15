import { pool } from "./db.js";

async function initDatabase() {
    try {
        const connection = await pool.getConnection();
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                password VARCHAR(255),
                system_user BOOLEAN DEFAULT FALSE,
                is_blacklisted BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // IF NOT EXISTS is not standard in MySQL for CREATE INDEX, but can use CREATE INDEX...
        // MySQL 8 doesn't support IF NOT EXISTS in CREATE INDEX.
        // Let's create a helper function or just try catch.
        
        const createIndex = async (query) => {
            try {
                await connection.query(query);
            } catch (e) {
                // Ignore index already exists error
                if (e.code !== 'ER_DUP_KEYNAME') {
                    throw e;
                }
            }
        };

        await createIndex(`CREATE INDEX idx_users_email ON users(email)`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                id CHAR(36) PRIMARY KEY,
                user_id CHAR(36),
                status ENUM('ACTIVE','BLOCKED','CLOSED') DEFAULT 'ACTIVE',
                currency VARCHAR(10) DEFAULT 'INR',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await createIndex(`CREATE INDEX idx_accounts_user_id ON accounts(user_id)`);

        // Need to add 'COMPLETED' in enum because old logic used 'COMPLETED' and 'REVERSED', but prompt asked for 'SUCCESS'
        // I will use 'SUCCESS' instead of 'COMPLETED' but I need to make sure controllers are updated accordingly.
        // I'll stick with what user requested.
        await connection.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id CHAR(36) PRIMARY KEY,
                from_account CHAR(36),
                to_account CHAR(36),
                amount DECIMAL(18,2),
                status ENUM('PENDING','SUCCESS','FAILED', 'COMPLETED', 'REVERSED') DEFAULT 'PENDING',
                idempotency_key VARCHAR(255) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (from_account) REFERENCES accounts(id) ON DELETE RESTRICT,
                FOREIGN KEY (to_account) REFERENCES accounts(id) ON DELETE RESTRICT
            )
        `);
        
        await createIndex(`CREATE INDEX idx_transactions_from_account ON transactions(from_account)`);
        await createIndex(`CREATE INDEX idx_transactions_to_account ON transactions(to_account)`);
        await createIndex(`CREATE INDEX idx_transactions_idempotency_key ON transactions(idempotency_key)`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS ledgers (
                id CHAR(36) PRIMARY KEY,
                account_id CHAR(36),
                transaction_id CHAR(36),
                amount DECIMAL(18,2),
                type ENUM('CREDIT','DEBIT'),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
                FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE RESTRICT
            )
        `);

        await createIndex(`CREATE INDEX idx_ledgers_account_id ON ledgers(account_id)`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS token_blacklist (
                token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await createIndex(`CREATE INDEX idx_token_blacklist_token ON token_blacklist(token(255))`);

        connection.release();
        console.log("✅ Database initialized successfully");
    } catch (error) {
        console.error("❌ Database Initialization Error:", error.message);
        process.exit(1);
    }
}

export default initDatabase;
