const db = require('../config/db');

const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname) errors.push('กรุณากรอกชื่อผู้ป่วย');
    if (!userData.lastname) errors.push('กรุณากรอกนามสกุลผู้ป่วย');
    if (!userData.age) errors.push('กรุณากรอกอายุผู้ป่วย');
    if (!userData.checkup_date) errors.push('กรุณาระบุวันที่เข้าตรวจ');
    if (!userData.gender) errors.push('กรุณาเลือกเพศผู้ป่วย');
    if (!userData.congenital_disease || userData.congenital_disease.length === 0) {
        errors.push('กรุณาเลือกโรคประจำตัวอย่างน้อย 1 โรค , อื่นๆ หรือ ไม่มี');
    }
    if (!userData.diagnosis) errors.push('กรุณากรอกผลการวินิจฉัย การรักษา หรือ ยาที่ได้รับ');
    return errors;
}

exports.getAllUsers = async (req, res) => {
    const [results] = await db.conn.query('SELECT * FROM users ORDER BY id DESC');
    res.json(results);
};

exports.getUserById = async (req, res) => {
    const [results] = await db.conn.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(results[0]);
};

exports.createUser = async (req, res) => {
    try {
        const errors = validateData(req.body);
        if (errors.length > 0) throw { message: 'กรอกข้อมูลไม่ครบถ้วน', errors };
        const [results] = await db.conn.query('INSERT INTO users SET ?', [req.body]);
        res.json({ message: 'User created successfully', data: results });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis } = req.body;
    const query = `UPDATE users SET firstname=?, lastname=?, birthday=?, age=?, gender=?, checkup_date=?, congenital_disease=?, diagnosis=? WHERE id=?`
    await db.conn.query(query, [firstname, lastname, birthday, age, gender, checkup_date, congenital_disease, diagnosis, id]);  
    res.json({ message: 'แก้ไขข้อมูลสำเร็จแล้ว' });
};

exports.deleteUser = async (req, res) => {
    await db.conn.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
};