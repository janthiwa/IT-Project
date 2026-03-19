const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);

app.listen(8000, async () => {
    await db.init();
    console.log(`Server is running on port 8000 🏁`);
});