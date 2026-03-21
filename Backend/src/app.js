const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `ไม่พบเส้นทาง (Route) ${req.originalUrl} บนเซิร์ฟเวอร์นี้`
    });
});

app.use((err, req, res, next) => {
    console.error('Global Error:', err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
    });
});

module.exports = app;