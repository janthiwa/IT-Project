const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE';
let selectedId = '';

window.onload = async () => {
    await loadPatients();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')?.split(':')[0]; 

    if (id) {
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
            const options = Array.from(locSelect.options).map(opt => opt.value);
            
            if (options.includes(app.location)) {
                locSelect.value = app.location;
                otherInp.style.display = 'none';
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
        const userIdFromUrl = new URLSearchParams(window.location.search).get('userId');
        if (userIdFromUrl) userSelect.value = userIdFromUrl;
    } catch (error) {
        console.error('โหลดผู้ป่วยพลาด:', error);
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

const errors = validateAppointment(appointmentData); 

    if (errors.length > 0) {
        showErrors(errors, messageDOM, appointmentData);
        return;
    }

    try {
        let finalId = selectedId;
        let successText = mode === 'CREATE' ? 'บันทึกนัดหมายสำเร็จแล้ว' : 'อัปเดตนัดหมายเรียบร้อยแล้ว';

        if (mode === 'CREATE') {
            const res = await axios.post(`${BASE_URL}/appointments`, appointmentData);
            finalId = res.data.insertId;
        } else {
            await axios.put(`${BASE_URL}/appointments/${selectedId}`, appointmentData);
        }

        messageDOM.innerHTML = `<div class="success-box">✨ ${successText} กำลังพาไปหน้าใบนัด...</div>`;
        messageDOM.classList.add('show');

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            window.location.href = `card.html?id=${finalId}`;
        }, 1500);

    } catch (error) {
        console.error('Error:', error);
        messageDOM.innerHTML = `<div class="error-box">บันทึกไม่สำเร็จ เช็กเซิร์ฟเวอร์ด่วน!</div>`;
        messageDOM.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const showErrors = (errors, dom, data) => {
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(el => el.classList.remove('input-error'));

    let htmlList = errors.map(err => `<li>${err}</li>`).join('');
    dom.innerHTML = `
        <div class="error-box">
            <strong>กรุณากรอกข้อมูลนัดหมายให้ครบถ้วน:</strong>
            <ul>${htmlList}</ul>
        </div>`;
    dom.classList.add('show');

    const addError = (selector) => {
        const el = document.querySelector(selector) || document.getElementById(selector);
        if (el) el.classList.add('input-error');
    };

    if (!data.user_id) addError('#userSelect');
    if (!data.doctor_name) addError('input[name="doctor_name"]');
    if (!data.app_date) addError('input[name="app_date"]');
    if (!data.app_time) addError('input[name="app_time"]');
    if (!data.location) {
        addError('#locationSelect');
        if (document.getElementById('locationSelect').value === 'อื่นๆ') addError('#otherLocationInput');
    }
    if (!data.note) addError('textarea[name="note"]');

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function toggleOtherLocation() {
    const select = document.getElementById('locationSelect');
    const otherInput = document.getElementById('otherLocationInput');
    otherInput.style.display = select.value === 'อื่นๆ' ? 'block' : 'none';
}