require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log('\n' + '='.repeat(45));
    console.log(`HOSPITAL SYSTEM SERVER IS STARTING...`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`   - Users:        http://localhost:${PORT}/api/users`);
    console.log(`   - Appointments: http://localhost:${PORT}/api/appointments`);
    console.log('='.repeat(45));
    console.log('Reminder: Make sure Docker Desktop / MySQL is running!');
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} ถูกใช้งานอยู่แล้ว!`);
    } else {
        console.error('Server Error:', error.message);
    }
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\nServer is shutting down...');
    server.close(() => {
        console.log('Server closed. See you next time!');
        process.exit(0);
    });
});