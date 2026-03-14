const BASE_URL = 'http://localhost:8000';
window.onload = async () => {
    await loadPatients();
};

const loadPatients = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        const patients = response.data;
        const userSelect = document.getElementById('userSelect');

        // วนลูปสร้างตัวเลือกรายชื่อคนไข้ลงใน Dropdown
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id; // เก็บ ID ไว้เบื้องหลังเพื่อใช้ส่งไปบันทึกนัดหมาย
            option.innerText = `${patient.firstname} ${patient.lastname}`;
            userSelect.appendChild(option);
        });

        // แกะรหัส userId ที่แถมมากับ URL (เช่น ?userId=10)
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('userId');

        // ถ้ามี ID วาร์ปมา ให้สั่ง Dropdown เลือกคนนั้นทันที
        if (userIdFromUrl && userSelect) {
            userSelect.value = userIdFromUrl;
        }

    } catch (error) {
        console.error('ดึงข้อมูลคนไข้ไม่สำเร็จนะจ๊ะ:', error);
    }
};

// 2. ฟังก์ชันส่งข้อมูลนัดหมาย
const submitAppointment = async () => {
    const messageDOM = document.getElementById('message');
    
    const appointmentData = {
        user_id: document.getElementById('userSelect').value,
        doctor_name: document.querySelector('input[name="doctor_name"]').value,
        app_date: document.querySelector('input[name="app_date"]').value,
        app_time: document.querySelector('input[name="app_time"]').value,
        location: document.getElementById('locationSelect').value,
        note: document.querySelector('textarea[name="note"]').value
    };

    // เช็คก่อนว่าเลือกคนไข้หรือยัง
    let errors = [];

    if (!appointmentData.user_id) {
        errors.push('กรุณาเลือกคนไข้');
    }
    if (!appointmentData.doctor_name) {
        errors.push('กรุณากรอกชื่อคุณหมอ');
    }
    if (!appointmentData.app_date) {
        errors.push('กรุณาเลือกวันที่นัดหมาย');
    }
    if (!appointmentData.app_time) {
        errors.push('กรุณาเลือกเวลานัดหมาย');
    }
    if (!appointmentData.location) {
        errors.push('กรุณาระบุสถานที่นัดหมาย');
    }
    if (!appointmentData.note) {
        errors.push('กรุณากรอกหมายเหตุ');
    }

    // 3. ตรวจสอบว่ามี Error ใน Array ไหม
    if (errors.length > 0) {
        // แสดง Error ตัวแรกที่เจอ
        messageDOM.innerText = `${errors[0]}`; 
        messageDOM.className = 'notification-inline error';
        messageDOM.style.display = 'block';
        return; // หยุดการทำงาน ไม่ส่งข้อมูลต่อ
    }

    try {
        // ส่งข้อมูลไปที่ Backend (เดี๋ยวเราต้องไปสร้าง Route นี้ใน index.js ฝั่ง Server)
        const response = await axios.post(`${BASE_URL}/appointments`, appointmentData);
        
        messageDOM.innerText = 'บันทึกการนัดหมายสำเร็จแล้ว';
        messageDOM.className = 'notification-inline success';
        messageDOM.style.display = 'block';
        
        // รับ ID ที่เพิ่งสร้างใหม่ (insertId) มาจาก Backend
        const newAppointmentId = response.data.insertId;

        // แจ้งเตือนความสำเร็จ
        alert('บันทึกสำเร็จ! กำลังเปิดใบนัดหมาย');

        // วาร์ปไปหน้า card.html พร้อมส่ง ID ไปทาง URL
        window.location.href = `card.html?id=${newAppointmentId}`;
        // แถม: ถ้าสำเร็จแล้วให้รีเฟรชหน้าเบาๆ หรือล้างฟอร์มก็ได้
    } catch (error) {
        console.error('บันทึกไม่สำเร็จ:', error);
        messageDOM.innerText = 'เกิดข้อผิดพลาดในการบันทึก';
        messageDOM.className = 'notification-inline error';
        messageDOM.style.display = 'block';
    }
};