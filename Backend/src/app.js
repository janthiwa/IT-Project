const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use((req, res) => {
    res.status(404).json({ message: 'หาเส้นทางนี้ไม่เจอเช็ก URL ดีๆ นะ' });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: 'หลังบ้านพัง: ' + err.message });
});

module.exports = app;