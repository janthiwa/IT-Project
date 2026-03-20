const db = require('../config/db');

// 1. ดึงข้อมูลนัดหมายทั้งหมด (GET ALL)
exports.getAllAppointments = async (req, res) => {
    try {
        const query = 
        `SELECT a.id,a.user_id,u.firstname,u.lastname,a.doctor_name,
        DATE_FORMAT(a.app_date, '%Y-%m-%d') AS app_date,a.app_time,a.location,a.note
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.app_date DESC, a.app_time DESC`;

        const [results] = await db.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลนัดหมาย' });
    }
};

// 2. สร้างการนัดหมายใหม่ (POST)
exports.createAppointment = async (req, res) => {
const { user_id, doctor_name, app_date, app_time, location, note } = req.body;

try {
const query = `
        INSERT INTO appointments (user_id, doctor_name, app_date, app_time, location, note) VALUES (?, ?, ?, ?, ?, ?)`;
        
const [result] = await db.execute(query, [user_id, doctor_name, app_date, app_time, location || '', note || '']);

res.status(201).json({ 
    message: 'บันทึกนัดหมายสำเร็จ', 
    appointmentId: result.insertId 
});
} catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'ไม่สามารถบันทึกนัดหมายได้: ' + error.message });
    }
};

// 3. ลบนัดหมาย (DELETE)
exports.deleteAppointment = async (req, res) => {
const { id } = req.params;
try {
    const query = `DELETE FROM appointments WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
if (result.affectedRows === 0) {
return res.status(404).json({ message: 'ไม่พบรายการนัดหมายที่ต้องการลบ' });
}

        res.json({ message: 'ยกเลิกนัดหมายเรียบร้อยแล้ว' });
} catch (error) {
console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};

// 4. ดึงข้อมูลนัดหมายรายบุคคล (GET ID)
exports.getAppointmentById = async (req, res) => {
const { id } = req.params;
try {
const query = 
        `SELECT a.*, u.firstname, u.lastname
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        WHERE a.id = ?`;

const [results] = await db.execute(query, [id]);
        
if (results.length === 0) {
return res.status(404).json({ message: 'ไม่พบข้อมูลนัดหมาย' });
}
        res.json(results[0]);
} catch (error) {
        res.status(500).json({ message: error.message });
}
};

// 5. แก้ไขข้อมูลนัดหมาย (PUT)
exports.updateAppointment = async (req, res) => {
const { id } = req.params;
const { user_id, doctor_name, app_date, app_time, location, note } = req.body;
try {
    const query = `
        UPDATE appointments
        SET user_id = ?, doctor_name = ?, app_date = ?,app_time = ?, location = ?, note = ?
        WHERE id = ?`;
const values = [user_id,doctor_name,app_date,app_time,location,note,id];
const [results] = await db.execute(query, values);
if (results.affectedRows === 0) {
return res.status(404).json({ message: 'ไม่พบรายการนัดหมายที่ต้องการแก้ไข' });
}
        res.json({ message: 'อัปเดตนัดหมายสำเร็จแล้ว' });
} catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ message: 'อัปเดตไม่สำเร็จ: ' + error.message });
    }
};