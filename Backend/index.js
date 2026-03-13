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
    const results = await conn.query('SELECT * FROM users')
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
        let id = req.params.id
        let updatedUser = req.body;
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id])
        if (results[0].affectedRows == 0) {
            throw { statusCode: 404, message: 'User not found' };
        }
        res.json({
            message: 'User updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        console.error('Error updating user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: 'Error updating user',
            error: error.message
        });
    }
})

// DELETE /users/:id สำหรับลบ user ที่มี id ตรงกับที่ส่งมา
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('DELETE FROM users WHERE id = ?', id)
        if (results[0].affectedRows == 0) {
            throw { statusCode: 404, message: 'User not found' };
        }   
        res.json({
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
})

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});