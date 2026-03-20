const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webdb',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('--- Hospital System: DB Config ---');
console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`User: ${dbConfig.user}`);
console.log(`DB Name: ${dbConfig.database}`);
console.log('------------------------------------');

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('DB Connection Error!');
        switch (err.code) {
    case 'PROTOCOL_CONNECTION_LOST':
        console.error('Database connection was closed.');
    break;
    case 'ER_CON_COUNT_ERROR':
        console.error('Database has too many connections.');
    break;
    case 'ECONNREFUSED':
        console.error('Database connection was refused. (Is MySQL running?)');
    break;
    default:
        console.error(`Error Code: ${err.code} | Message: ${err.message}`);
}
} else {
    console.log(`✅ Database Connected: ${dbConfig.database} (Ready to serve)`);
    connection.release();
    }
});


module.exports = pool.promise();