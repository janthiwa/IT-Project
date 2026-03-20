const db = require('../config/db');

// 1. (GET ALL) ดึงข้อมูลผู้ป่วยทั้งหมด
exports.getAllUsers = async (req, res) => {
try {
const query = `
            SELECT id, id_card, firstname, lastname, 
            DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, age, gender, 
            DATE_FORMAT(checkup_date, '%Y-%m-%d') AS checkup_date, congenital_disease, diagnosis 
            FROM users 
            ORDER BY id DESC`;
const [results] = await db.execute(query);
        res.json(results);
} catch (error) {
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

// 2. (POST) บันทึกข้อมูลผู้ป่วยใหม่
exports.createUser = async (req, res) => {
const { id_card, firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis } = req.body;

try {
const query = `INSERT INTO users (id_card, firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const values = [id_card, firstname, lastname, birthday, age, gender, checkup_date, congenital_disease || '', diagnosis];

const [results] = await db.execute(query, values);

    res.status(201).json({ 
    message: 'บันทึกข้อมูลผู้ป่วยสำเร็จ', 
    id: results.insertId 
});
} catch (error) {
console.error("SQL Error:", error.message);
    res.status(500).json({ message: 'บันทึกไม่สำเร็จ: ' + error.message });
    }
};

// 3. (DELETE) ลบข้อมูลผู้ป่วย
exports.deleteUser = async (req, res) => {
try {
    const [results] = await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
if (results.affectedRows === 0) {
return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยที่ต้องการลบ' });
}
        res.json({ message: 'ลบข้อมูลผู้ป่วยเรียบร้อยแล้ว' });
} catch (error) {
        res.status(500).json({ message: 'ลบข้อมูลไม่ได้: ' + error.message });
    }
};

// 4. (GET ID) ดึงข้อมูลผู้ป่วยรายบุคคล
exports.getUserById = async (req, res) => {
try {
const query = `SELECT *, DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, 
                       DATE_FORMAT(checkup_date, '%Y-%m-%d') AS checkup_date 
                       FROM users WHERE id = ?`;
const [results] = await db.execute(query, [req.params.id]);
if (results.length === 0) {
return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วย' });
}
    res.json(results[0]);
} catch (error) {
    res.status(500).json({ message: 'Error: ' + error.message });
    }
};

// 5. (PUT ID) แก้ไขข้อมูลผู้ป่วย
exports.updateUser = async (req, res) => {
const { id } = req.params;
const { id_card, firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis } = req.body;

try {
const query = `UPDATE users 
                SET id_card = ?, firstname = ?, lastname = ?, birthday = ?, age = ?, gender = ?, checkup_date = ?, congenital_disease = ?, diagnosis = ?
                WHERE id = ?`;

const values = [id_card, firstname, lastname, birthday, age, gender, checkup_date, congenital_disease || '', diagnosis, id];

const [results] = await db.execute(query, values);

if (results.affectedRows === 0) {
return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยที่ต้องการแก้ไข' });
}

        res.json({ message: 'อัปเดตข้อมูลสำเร็จ' });
} catch (error) {
        res.status(500).json({ message: 'อัปเดตไม่สำเร็จ: ' + error.message });
    }
};