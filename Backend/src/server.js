require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {

        if (db.init) {
            await db.init(); 
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log('✅ Database connected and ready!');
            console.log('🔐 Environment variables loaded successfully.');
        });
    } catch (error) {
        console.error('❌ อุ๊ย! สตาร์ทเครื่องไม่ได้จ๊ะคุณหนู:', error.message);
        process.exit(1); 
    }
};

startServer();