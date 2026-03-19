const db = require('../config/db');

// 1. ดึงข้อมูลนัดหมายทั้งหมด
exports.getAllAppointments = async (req, res) => {
    try {
        const query = `
            SELECT a.*, u.firstname, u.lastname 
            FROM appointments a 
            JOIN users u ON a.user_id = u.id 
            ORDER BY a.app_date DESC, a.app_time DESC`;
            
        const [results] = await db.query(query); 
        res.json(results);
    } catch (error) {
        console.error('Error fetching appointments:', error.message);
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลนัดหมายได้' });
    }
};

// 2. สร้างนัดหมายใหม่
exports.createAppointment = async (req, res) => {
    try {
        const { user_id, doctor_name, app_date, app_time, location, note } = req.body;
        const query = `
            INSERT INTO appointments 
            (user_id, doctor_name, app_date, app_time, location, note) 
            VALUES (?, ?, ?, ?, ?, ?)`;
            
        const [results] = await db.query(query, [user_id, doctor_name, app_date, app_time, location, note]);
        res.status(201).json({ 
            message: 'บันทึกนัดหมายสำเร็จแล้ว', 
            id: results.insertId 
        });
    } catch (error) {
        console.error('หลังบ้านพัง:', error.message);
        res.status(500).json({ message: 'อุ๊ย! บันทึกลงฐานข้อมูลไม่ได้: ' + error.message });
    }
};

// 3. ดึงข้อมูลใบนัด (Card) รายบุคคล
exports.getAppointmentCard = async (req, res) => {
    try {
        const query = `
            SELECT a.*, u.firstname, u.lastname, u.age, u.congenital_disease 
            FROM appointments a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.id = ?`;
        const [results] = await db.query(query, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลใบนัดนี้' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching appointment card:', error.message);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลใบนัด' });
    }
};

// 4. ลบนัดหมาย
exports.deleteAppointment = async (req, res) => {
    try {
        const [results] = await db.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }
        res.json({ message: 'ลบนัดหมายเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Error deleting appointment:', error.message);
        res.status(500).json({ message: 'ไม่สามารถลบนัดหมายได้' });
    }
};

// 5. อัปเดตนัดหมาย
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, doctor_name, app_date, app_time, location, note } = req.body;
        
        const query = `
            UPDATE appointments 
            SET user_id = ?, doctor_name = ?, app_date = ?, app_time = ?, location = ?, note = ? 
            WHERE id = ?`;
            
        const [results] = await db.query(query, [user_id, doctor_name, app_date, app_time, location, note, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบใบนัดที่ต้องการแก้ไข' });
        }
        res.json({ message: 'อัปเดตนัดหมายเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('แก้ไขไม่ได้:', error.message);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไข' });
    }
};