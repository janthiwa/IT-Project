const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

let users = []
let counter = 1;
let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8821
    });
}

//path = GET /users สำหรับด get ข้อมูล users ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users ORDER BY id DESC')
    res.json(results[0]);
});

const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname) {
        errors.push('กรุณากรอกชื่อผู้ป่วย');
    }
    if (!userData.lastname) {
        errors.push('กรุณากรอกนามสกุลผู้ป่วย');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุผู้ป่วย');
    }
    if (!userData.checkup_date) {
        errors.push('กรุณาระบุวันที่เข้าตรวจ');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศผู้ป่วย');
    }
    if (!userData.congenital_disease || userData.congenital_disease.length === 0) {
        errors.push('กรุณาเลือกโรคประจำตัวอย่างน้อย 1 โรค , อื่นๆ หรือ ไม่มี');
    }
    if (!userData.diagnosis) {
        errors.push('กรุณากรอกผลการวินิจฉัย การรักษา หรือ ยาที่ได้รับ');
    }
    return errors;
}

//path = POST /users สำหรับเพิ่ม user ใหม่
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        const errors = validateData(user);
    if (errors.length > 0) {
    //ถ้ามี error
    throw {
        message: 'กรอกข้อมูลไม่ครบถ้วน',
        errors: errors
    }
}
        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'User created successfully',
            data: results[0]
        })
    } catch (error) {
        const errorMessage = error.message || 'Error creating user';
        const errors = error.errors || [];
        console.error('Error creating user:', error.message);
        res.status(500).json({
            message: errorMessage,
            errors: errors
        });
    }
});

// path GET /users/:id สำหรับด get ข้อมูล user ที่มี id ตรงกับที่ส่งมา
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        if (results[0].length == 0) {
            throw { statusCode: 404, message: 'User not found' };
        }
        res.json(results[0][0]);
    }
    catch (error) {
        console.error('Error fetching user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: 'Error fetching user',
            error: error.message
        });
    }
})

//PUT /users/:id สำหรับแก้ไขข้อมูล user ที่มี id ตรงกับที่ส่งมา
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, age, gender, checkup_date, congenital_disease, diagnosis } = req.body;
        
        const query = `
            UPDATE users 
            SET firstname = ?, lastname = ?, age = ?, gender = ?, checkup_date = ?, congenital_disease = ?, diagnosis = ? 
            WHERE id = ?`;
        
        await conn.query(query, [firstname, lastname, age, gender, checkup_date, congenital_disease, diagnosis, id]);
        res.json({ message: 'แก้ไขข้อมูลสำเร็จแล้ว' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Backend งอแง: ' + error.message });
    }
});


// ดึงข้อมูลนัดหมายรายคน
app.get('/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM appointments WHERE id = ?';
        const [results] = await conn.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'ไม่พบนัดหมายหมายเลขนี้' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('ดึงข้อมูลนัดหมายล้มเหลว:', error);
        res.status(500).json({ message: 'Backend งอแง: ' + error.message });
    }
});

app.put('/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { doctor_name, app_date, app_time, location, note } = req.body;
        
        const query = `
            UPDATE appointments 
            SET doctor_name = ?, app_date = ?, app_time = ?, location = ?, note = ? 
            WHERE id = ?`;
        
        await conn.query(query, [doctor_name, app_date, app_time, location, note, id]);
        res.json({ message: 'แก้ไขใบนัดหมายสำเร็จแล้ว' });
    } catch (error) {
        console.error('แก้ไขนัดหมายพลาด:', error);
        res.status(500).json({ message: 'Backend งอแง: ' + error.message });
    }
});

// DELETE /users/:id สำหรับลบ user ที่มี id ตรงกับที่ส่งมา
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('DELETE FROM users WHERE id = ?', [id]);
        if (results[0].affectedRows == 0) {
            throw { statusCode: 404, message: 'User not found' };
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: 'Error deleting user', error: error.message });
    }
});

// ส่วนของการลบนัดหมาย (Appointments)
app.delete('/appointments/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('DELETE FROM appointments WHERE id = ?', [id]);
        if (results[0].affectedRows == 0) {
            throw { statusCode: 404, message: 'Appointment not found' };
        }
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: 'Error deleting appointment', error: error.message });
    }
});

// ส่วนการจัดการนัดหมาย (Appointments)
app.post('/appointments', async (req, res) => {
    try {
        const { user_id, doctor_name, app_date, app_time, location, note } = req.body;
        const query = `INSERT INTO appointments (user_id, doctor_name, app_date, app_time, location, note) VALUES (?, ?, ?, ?, ?, ?)`;
        

        const [results] = await conn.query(query, [user_id, doctor_name, app_date, app_time, location, note]);
        
       
        res.status(201).json(results); 
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/appointments', async (req, res) => {
    try {
        const query = `
            SELECT 
            a.*, 
            u.firstname, u.lastname 
            FROM appointments a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.id DESC
        `;
        const [results] = await conn.query(query);
        res.json(results);
    } catch (error) {
        console.error('ดึงข้อมูลนัดหมายรวมพลาด:', error);
        res.status(500).json({ message: 'เซิร์ฟเวอร์งอแง' });
    }
});

app.get('/appointment-card/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                a.*, 
                u.firstname, u.lastname, u.age, u.congenital_disease
            FROM appointments a
            JOIN users u ON a.user_id = u.id
            WHERE a.id = ? 
        `;
        
        const [results] = await conn.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'ไม่พบนัดหมายนี้' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('ดึงใบนัดหมายพลาด:', error);
        res.status(500).json({ message: 'เซิร์ฟเวอร์งอแง' });
    }
});

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});