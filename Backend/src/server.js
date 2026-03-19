require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 8821;

const startServer = async () => {
    try {
        await db.init();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log('ความลับ (Password) ถูกซ่อนไว้!');
        });
    } catch (error) {
        console.error('อุ๊ย! สตาร์ทเครื่องไม่ได้:', error);
    }
};

startServer();