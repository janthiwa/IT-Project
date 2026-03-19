require('dotenv').config();
const mysql = require('mysql2/promise');

const db = {
    pool: null,
    init: async () => {
        try {

            db.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            console.log('Database connected with Pool! 🌊✨');
        } catch (error) {
            console.error('DB Connection Error:', error.message);
        }
    },

    query: async (sql, params) => {
        return await db.pool.execute(sql, params);
    }
};

module.exports = db;