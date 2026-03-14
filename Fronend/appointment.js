const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // โหมดเริ่มต้น
let selectedId = ''; // เก็บ ID ของนัดหมายที่จะแก้ไข

window.onload = async () => {
    // 1. โหลดรายชื่อคนไข้ใส่ Dropdown ก่อนเสมอ
    await loadPatients();

    // 2. เช็คว่ามี ID วาร์ปมาบน URL ไหม (สำหรับการแก้ไขนัด)
    const urlParams = new URLSearchParams(window.location.search);
    const rawId = urlParams.get('id'); 
    const id = rawId ? rawId.split(':')[0] : null; 

    if (id) {
        mode = 'EDIT';
        selectedId = id;
        console.log('โหมดแก้ไขนัดหมาย ID:', id);

        try {
            // ดึงข้อมูลนัดหมายเดิมมาจาก Backend
            const response = await axios.get(`${BASE_URL}/appointments/${id}`);
            const app = response.data;

            // หยอดข้อมูลเก่าลงฟอร์ม
            document.getElementById('userSelect').value = app.user_id;
            document.querySelector('input[name="doctor_name"]').value = app.doctor_name || '';
            
            // จัดรูปแบบวันที่ให้เข้ากับ input type="date" (YYYY-MM-DD)
            if (app.app_date) {
                const date = new Date(app.app_date).toISOString().split('T')[0];
                document.querySelector('input[name="app_date"]').value = date;
            }
            
            document.querySelector('input[name="app_time"]').value = app.app_time || '';
            document.querySelector('textarea[name="note"]').value = app.note || '';

            // 3. จัดการเรื่องสถานที่
            const locationSelect = document.getElementById('locationSelect');
            const otherInput = document.getElementById('otherLocationInput');
            const options = Array.from(locationSelect.options).map(opt => opt.value);
            
            if (options.includes(app.location)) {
                // ถ้าสถานที่เดิม มีอยู่ในลิสต์ (เช่น แผนกศัลยกรรม)
                locationSelect.value = app.location;
                otherInput.style.display = 'none';
                otherInput.value = '';
            } else {
                // ถ้าไม่มีในลิสต์ แปลว่าเป็นที่ที่พิมพ์เอง (อื่นๆ)
                locationSelect.value = 'อื่นๆ';
                otherInput.value = app.location;
                otherInput.style.display = 'block'; // สั่งเปิดช่องค้างไว้เพื่อให้เห็นค่าเดิม
            }

            // เปลี่ยนหน้าตาปุ่มและหัวข้อให้รู้ว่ากำลังแก้
            document.querySelector('.header').innerText = 'แก้ไขใบนัดหมาย';
            document.querySelector('.submit-btn').innerText = 'ยืนยันการแก้ไขนัดหมาย';

        } catch (error) {
            console.error('ดึงข้อมูลนัดหมายล้มเหลว:', error);
            alert('ดึงข้อมูลมาแก้ไขไม่ได้ ลองเช็ค Server ดูนะ');
        }
    }
};

const loadPatients = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        const patients = response.data;
        const userSelect = document.getElementById('userSelect');

        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.innerText = `${patient.firstname} ${patient.lastname}`;
            userSelect.appendChild(option);
        });

        // กรณีวาร์ปมาจากหน้าเพิ่มคนไข้ใหม่ (จะมี userId แถมมา)
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('userId');
        if (userIdFromUrl && userSelect) {
            userSelect.value = userIdFromUrl;
        }

    } catch (error) {
        console.error('ดึงข้อมูลคนไข้ไม่สำเร็จ:', error);
    }
};

const submitAppointment = async () => {
    const messageDOM = document.getElementById('message');
    
    // 1. ดึงค่าจากหน้าจอมาก่อน
    let locationSelectValue = document.getElementById('locationSelect').value;
    let otherLocation = document.getElementById('otherLocationInput').value;
    let finalLocation = locationSelectValue;

    // 2. ถ้าเลือกอื่นๆ แต่ไม่พิมพ์ ให้ทำเป็นค่าว่าง เพื่อให้ดักจับ Error
    if (locationSelectValue === 'อื่นๆ') {
        finalLocation = otherLocation.trim() ? otherLocation : '';
    }

    // 3. สร้างก้อนข้อมูลโดยใช้ finalLocation ที่เราเช็คแล้ว
    const appointmentData = {
        user_id: document.getElementById('userSelect').value,
        doctor_name: document.querySelector('input[name="doctor_name"]').value,
        app_date: document.querySelector('input[name="app_date"]').value,
        app_time: document.querySelector('input[name="app_time"]').value,
        location: finalLocation,
        note: document.querySelector('textarea[name="note"]').value
    };

    // 4. ด่านตรวจ (Validation)
    let errors = [];
    if (!appointmentData.user_id) errors.push('กรุณาเลือกคนไข้');
    if (!appointmentData.doctor_name) errors.push('กรุณากรอกชื่อคุณหมอ');
    if (!appointmentData.app_date) errors.push('กรุณาเลือกวันที่นัดหมาย');
    if (!appointmentData.app_time) errors.push('กรุณาเลือกเวลานัดหมาย');
    if (!appointmentData.location) errors.push('กรุณาระบุสถานที่ (ถ้าเลือก "อื่นๆ" อย่าลืมพิมพ์ระบุด้วยนะ)');
    if (!appointmentData.note) errors.push('กรุณากรอกหมายเหตุ');
    

    if (errors.length > 0) {
        messageDOM.innerText = errors[0]; 
        messageDOM.className = 'notification-inline error';
        messageDOM.style.display = 'block';
        return;
    }

    try {
        let successMessage = 'บันทึกการนัดหมายสำเร็จแล้ว'; 
        let finalId = selectedId;

        if (mode === 'CREATE') {
            const response = await axios.post(`${BASE_URL}/appointments`, appointmentData);
            finalId = response.data.insertId;
        } else {
            await axios.put(`${BASE_URL}/appointments/${selectedId}`, appointmentData);
            successMessage = 'แก้ไขข้อมูลสำเร็จแล้ว';
        }
        
        messageDOM.innerText = successMessage;
        messageDOM.className = 'notification-inline success';
        messageDOM.style.display = 'block';
        
        alert(successMessage + '! กำลังเปิดใบนัดหมาย');

        // วาร์ปไปดูใบนัดหมาย (Card)
        window.location.href = `card.html?id=${finalId}`;

    } catch (error) {
        console.error('บันทึกไม่สำเร็จ:', error);
        messageDOM.innerText = 'เกิดข้อผิดพลาดในการบันทึก';
        messageDOM.className = 'notification-inline error';
        messageDOM.style.display = 'block';
    }
};

function toggleOtherLocation() {
    const select = document.getElementById('locationSelect');
    const otherInput = document.getElementById('otherLocationInput');
    
    if (select.value === 'อื่นๆ') {
        otherInput.style.display = 'block';
    } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
    }
}