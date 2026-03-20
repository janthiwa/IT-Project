const BASE_URL = 'http://localhost:8000/api';
let mode = 'CREATE';
let selectedId = '';
window.onload = async () => {
    await loadPatients();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id && id !== 'undefined' && id !== 'null') {
        mode = 'EDIT';
        selectedId = id;
        await loadAppointmentData(id);
    }
};

//ดึงข้อมูลมาแสดงตอนแก้ไข
const loadAppointmentData = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/appointments/${id}`);
        const app = response.data;

        document.getElementById('userSelect').value = app.user_id;
        document.querySelector('input[name="doctor_name"]').value = app.doctor_name || '';
        
        if (app.app_date) {
            const date = new Date(app.app_date);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            document.querySelector('input[name="app_date"]').value = `${yyyy}-${mm}-${dd}`;
        }

        document.querySelector('input[name="app_time"]').value = app.app_time || '';
        document.querySelector('textarea[name="note"]').value = app.note || '';

        const locSelect = document.getElementById('locationSelect');
        const otherInp = document.getElementById('otherLocationInput');
        const hasOption = Array.from(locSelect.options).some(opt => opt.value === app.location);

        if (hasOption && app.location !== 'อื่นๆ') {
            locSelect.value = app.location;
            otherInp.classList.add('hidden');
        } else {
            locSelect.value = 'อื่นๆ';
            otherInp.value = app.location;
            otherInp.classList.remove('hidden');
            otherInp.style.display = 'block';
        }
        
        document.querySelector('.header').innerText = 'แก้ไขใบนัดหมาย';
        document.querySelector('.submit-btn').innerText = 'ยืนยันการแก้ไขนัดหมาย';

    } catch (error) {
        console.error('ดึงข้อมูลพลาด:', error);
    }
};

// เปิด-ปิดช่อง "อื่นๆ"
function toggleOtherLocation() {
    const locSelect = document.getElementById('locationSelect');
    const otherInp = document.getElementById('otherLocationInput');
    
    if (locSelect.value === 'อื่นๆ') {
        otherInp.classList.remove('hidden');
        otherInp.style.display = 'block';
        otherInp.focus();
    } else {
        otherInp.classList.add('hidden');
        otherInp.style.display = 'none';
        otherInp.value = '';
    }
}

//ส่งข้อมูล(เพิ่มไฮไลต์สีแดง)
const submitAppointment = async () => {
    const messageDOM = document.getElementById('message');
    
    const inputs = document.querySelectorAll('.form-control, input, select, textarea');
    inputs.forEach(el => el.classList.remove('input-error'));

    const locSelect = document.getElementById('locationSelect');
    const locVal = locSelect.value;
    const otherInp = document.getElementById('otherLocationInput');
    const otherLoc = otherInp.value;

    const appointmentData = {
        user_id: document.getElementById('userSelect').value,
        doctor_name: document.querySelector('input[name="doctor_name"]').value.trim(),
        app_date: document.querySelector('input[name="app_date"]').value,
        app_time: document.querySelector('input[name="app_time"]').value,
        location: locVal === 'อื่นๆ' ? otherLoc.trim() : locVal,
        note: document.querySelector('textarea[name="note"]').value.trim()
    };

    const errorList = validateAppointment(appointmentData);

    if (errorList.length > 0) {
        if (!appointmentData.user_id) document.getElementById('userSelect').classList.add('input-error');
        if (!appointmentData.doctor_name) document.querySelector('input[name="doctor_name"]').classList.add('input-error');
        if (!appointmentData.app_date) document.querySelector('input[name="app_date"]').classList.add('input-error');
        if (!appointmentData.app_time) document.querySelector('input[name="app_time"]').classList.add('input-error');
        
        if (!locVal) {
            locSelect.classList.add('input-error');
        } else if (locVal === 'อื่นๆ' && !otherLoc.trim()) {
            otherInp.classList.add('input-error');
        }

        if (!appointmentData.note) document.querySelector('textarea[name="note"]').classList.add('input-error');

        messageDOM.innerHTML = `
            <div class="error-box">
                <strong>กรุณากรอกข้อมูลให้ครบถ้วน:</strong>
                <ul style="margin-top: 10px; text-align: left;">
                    ${errorList.map(err => `<li>${err}</li>`).join('')}
                </ul>
            </div>`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    try {
        let finalId = selectedId;
        let successText = mode === 'CREATE' ? 'บันทึกนัดหมายสำเร็จแล้ว' : 'อัปเดตนัดหมายเรียบร้อยแล้ว';

        if (mode === 'CREATE') {
            const res = await axios.post(`${BASE_URL}/appointments`, appointmentData);
            finalId = res.data.appointmentId; 
        } else {
            await axios.put(`${BASE_URL}/appointments/${selectedId}`, appointmentData);
        }

        messageDOM.innerHTML = `<div class="success-box"> ${successText}</div>`;
        setTimeout(() => {
            window.location.href = mode === 'CREATE' ? `card.html?id=${finalId}` : 'appointment-list.html';
        }, 1500);

    } catch (error) {
        console.error('Error:', error);
        messageDOM.innerHTML = `<div class="error-box">บันทึกไม่สำเร็จ: ระบบขัดข้อง</div>`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

//โหลดรายชื่อคนไข้
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