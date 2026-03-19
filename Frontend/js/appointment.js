const BASE_URL = 'http://localhost:8000/api';
let mode = 'CREATE';
let selectedId = '';

window.onload = async () => {
    await loadPatients();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id && id !== 'undefined') {
        mode = 'EDIT';
        selectedId = id;
        try {
            const response = await axios.get(`${BASE_URL}/appointments/${id}`);
            const app = response.data;
            
            // เติมข้อมูลลงฟอร์ม
            document.getElementById('userSelect').value = app.user_id;
            document.querySelector('input[name="doctor_name"]').value = app.doctor_name || '';
            
            if (app.app_date) {
                document.querySelector('input[name="app_date"]').value = new Date(app.app_date).toISOString().split('T')[0];
            }
            document.querySelector('input[name="app_time"]').value = app.app_time || '';
            document.querySelector('textarea[name="note"]').value = app.note || '';

            // จัดการเรื่องสถานที่
            const locSelect = document.getElementById('locationSelect');
            const otherInp = document.getElementById('otherLocationInput');
            if (Array.from(locSelect.options).some(opt => opt.value === app.location)) {
                locSelect.value = app.location;
            } else {
                locSelect.value = 'อื่นๆ';
                otherInp.value = app.location;
                otherInp.style.display = 'block';
            }
            
            document.querySelector('.header').innerText = 'แก้ไขใบนัดหมาย';
            document.querySelector('.submit-btn').innerText = 'ยืนยันการแก้ไขนัดหมาย';
        } catch (error) {
            console.error('ดึงข้อมูลพลาด:', error);
        }
    }
};

const submitAppointment = async () => {
    const messageDOM = document.getElementById('message');
    const locVal = document.getElementById('locationSelect').value;
    const otherLoc = document.getElementById('otherLocationInput').value;

    const appointmentData = {
        user_id: document.getElementById('userSelect').value,
        doctor_name: document.querySelector('input[name="doctor_name"]').value,
        app_date: document.querySelector('input[name="app_date"]').value,
        app_time: document.querySelector('input[name="app_time"]').value,
        location: locVal === 'อื่นๆ' ? otherLoc.trim() : locVal,
        note: document.querySelector('textarea[name="note"]').value
    };

    try {
        let finalId = selectedId;
        let successText = mode === 'CREATE' ? 'บันทึกนัดหมายสำเร็จแล้ว' : 'อัปเดตนัดหมายเรียบร้อยแล้ว';

        if (mode === 'CREATE') {
            const res = await axios.post(`${BASE_URL}/appointments`, appointmentData);
            finalId = res.data.id || res.data.insertId;
        } else {
            await axios.put(`${BASE_URL}/appointments/${selectedId}`, appointmentData);
        }

        messageDOM.innerHTML = `<div class="success-box">✨ ${successText}</div>`;
        messageDOM.classList.add('show');

        setTimeout(() => {
            window.location.href = `card.html?id=${finalId}`;
        }, 1500);

    } catch (error) {
        console.error('❌ Error:', error);
        messageDOM.innerHTML = `<div class="error-box">บันทึกไม่สำเร็จ เช็กเซิร์ฟเวอร์ด่วน</div>`;
        messageDOM.classList.add('show');
    }
};

const loadPatients = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        const userSelect = document.getElementById('userSelect');
        response.data.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = `${p.firstname} ${p.lastname}`;
            userSelect.appendChild(opt);
        });
    } catch (error) {
        console.error('โหลดผู้ป่วยพลาด:', error);
    }
};