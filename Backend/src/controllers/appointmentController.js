const db = require('../config/db');

exports.getAppointments = async (req, res) => {
    const query = `SELECT a.*, u.firstname, u.lastname FROM appointments a JOIN users u ON a.user_id = u.id ORDER BY a.id DESC`;
    const [results] = await db.conn.query(query);
    res.json(results);
};

exports.createAppointment = async (req, res) => {
    const values = Object.values(req.body);
    const query = `INSERT INTO appointments (user_id, doctor_name, app_date, app_time, location, note) VALUES (?, ?, ?, ?, ?, ?)`;
    const [results] = await db.conn.query(query, values);
    res.status(201).json(results);
};

exports.getAppointmentCard = async (req, res) => {
    const query = `SELECT a.*, u.firstname, u.lastname, u.age, u.congenital_disease FROM appointments a JOIN users u ON a.user_id = u.id WHERE a.id = ?`;
    const [results] = await db.conn.query(query, [req.params.id]);
    res.json(results[0]);
};

exports.deleteAppointment = async (req, res) => {
    await db.conn.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Appointment deleted successfully' });
};