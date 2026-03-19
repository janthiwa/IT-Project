const mysql = require('mysql2/promise');

const db = {
    conn: null,
    init: async () => {
try {
    db.conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8821
});
    console.log('Database connected!');
} catch (error) {
    console.error('DB Connection Error:', error.message);
        }
    }
};

module.exports = db;