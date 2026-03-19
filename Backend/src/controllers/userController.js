const db = require('../config/db');

const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname) errors.push('กรุณากรอกชื่อผู้ป่วย');
    if (!userData.lastname) errors.push('กรุณากรอกนามสกุลผู้ป่วย');
    if (!userData.age) errors.push('กรุณากรอกอายุผู้ป่วย');
    if (!userData.checkup_date) errors.push('กรุณาระบุวันที่เข้าตรวจ');
    if (!userData.gender) errors.push('กรุณาเลือกเพศผู้ป่วย');
    if (!userData.congenital_disease) errors.push('กรุณาระบุโรคประจำตัว');
    if (!userData.diagnosis) errors.push('กรุณากรอกผลการวินิจฉัย');
    return errors;
}

// 1. ดึงข้อมูลผู้ป่วยทั้งหมด
exports.getAllUsers = async (req, res) => {
    try {
        const [results] = await db.pool.execute('SELECT * FROM users ORDER BY id DESC');
        res.json(results);
    } catch (error) {
        console.error('Error getAllUsers:', error.message);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย' });
    }
};

// 2. ดึงข้อมูลผู้ป่วยรายบุคคล
exports.getUserById = async (req, res) => {
    try {
        const [results] = await db.pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยคนนี้' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error getUserById:', error.message);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
};

// 3. เพิ่มข้อมูลผู้ป่วยใหม่
exports.createUser = async (req, res) => {
    try {
        const errors = validateData(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบถ้วนนะ', errors });
        }

        const { firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis } = req.body;
        const query = `INSERT INTO users (firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [results] = await db.pool.execute(query, [firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis]);
        
        res.status(201).json({ message: 'เพิ่มข้อมูลผู้ป่วยสำเร็จแล้ว', id: results.insertId });
    } catch (error) {
        console.error('Error createUser:', error.message);
        res.status(500).json({ message: 'บันทึกข้อมูลผู้ป่วยไม่สำเร็จ' });
    }
};

// 4. แก้ไขข้อมูลผู้ป่วย
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis } = req.body;
        
        const query = `UPDATE users SET firstname=?, lastname=?, birthday=?, age=?, gender=?, checkup_date=?, congenital_disease=?, diagnosis=? WHERE id=?`;
        const [results] = await db.pool.execute(query, [firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis, id]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยที่ต้องการแก้ไข' });
        }
        res.json({ message: 'แก้ไขข้อมูลสำเร็จแล้ว' });
    } catch (error) {
        console.error('Error updateUser:', error.message);
        res.status(500).json({ message: 'ไม่สามารถแก้ไขข้อมูลได้' });
    }
};

// 5. ลบข้อมูลผู้ป่วย
exports.deleteUser = async (req, res) => {
    try {
        const [results] = await db.pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ป่วยที่ต้องการลบ' });
        }
        res.json({ message: 'ลบข้อมูลผู้ป่วยเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Error deleteUser:', error.message);
        res.status(500).json({ message: 'ไม่สามารถลบข้อมูลผู้ป่วยได้' });
    }
};