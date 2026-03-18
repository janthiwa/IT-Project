const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // โหมดเริ่มต้นคือสร้างใหม่
let selectedId = ''; // เก็บ ID ของคนไข้ที่กำลังแก้ไข

// --- ส่วนดึงข้อมูลเก่ามาโชว์ (Edit) ---
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        mode = 'EDIT';
        selectedId = id;
        console.log('โหมดแก้ไขคนไข้ ID:', id);

        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            const user = response.data;
            fillFormData(user);
            document.querySelector('.header').innerText = 'แก้ไขประวัติผู้ป่วย';
            document.querySelector('.submit-btn').innerText = 'ยืนยันการแก้ไขข้อมูล';
        } catch (error) {
            console.error('ดึงข้อมูลคนไข้ล้มเหลว:', error);
        }
    }
};

// ฟังก์ชันเติมข้อมูลลง Form (ตอนแก้ไข)
const fillFormData = (user) => {
    document.querySelector('input[name="firstname"]').value = user.firstname || '';
    document.querySelector('input[name="lastname"]').value = user.lastname || '';
    document.querySelector('input[name="id_card"]').value = user.id_card || '';
    document.querySelector('input[name="age"]').value = user.age || '';
    document.querySelector('input[name="checkup_date"]').value = user.checkup_date ? user.checkup_date.split('T')[0] : '';
    
    const genderRadio = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
    if (genderRadio) genderRadio.checked = true;

    document.querySelector('textarea[name="diagnosis"]').value = user.diagnosis || '';

    if (user.congenital_disease) {
        const diseases = user.congenital_disease.split(', ');
        const checkboxes = document.querySelectorAll('input[name="congenital_disease"]');
        checkboxes.forEach(cb => {
            if (diseases.some(d => d.includes(cb.value))) {
                cb.checked = true;
                if (cb.value === 'อื่นๆ') {
                    const match = user.congenital_disease.match(/อื่นๆ \((.*)\)/);
                    if (match) {
                        document.getElementById('otherDiseaseDetail').value = match[1];
                        document.getElementById('otherDiseaseDetail').style.display = 'inline-block';
                    }
                }
            }
        });
    }
};

// --- ฟังก์ชันส่งข้อมูล ---

window.submitData = async () => {
    let messageDOM = document.getElementById('message');
    let userData = collectFormData();

    const errors = validateData(userData);
    if (errors.length > 0) {
        showErrors(errors, messageDOM);
        return;
    }

    try {
        let successMessage = mode === 'CREATE' ? 'บันทึกข้อมูลแล้ว' : 'แก้ไขข้อมูลสำเร็จแล้ว';
        
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/users`, userData);
        } else {
            await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
        }

        showMessage(successMessage, 'success', messageDOM);
        // วาร์ปไปหน้ารายชื่อหลังบันทึกสำเร็จ
        setTimeout(() => { window.location.href = 'user.html'; }, 2000);

    } catch (error) {
        console.error('Submit Error:', error);
        showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error', messageDOM);
    }
};

// --- ฟังก์ชันจัดการ Checkbox ---

window.handleCheckboxChange = function(element) {
    const allCheckboxes = document.querySelectorAll('input[name="congenital_disease"]');
    const noneCheckbox = Array.from(allCheckboxes).find(cb => cb.value === 'ไม่มี');
    const otherCheckbox = Array.from(allCheckboxes).find(cb => cb.value === 'อื่นๆ');
    const otherInput = document.getElementById('otherDiseaseDetail');

    if (element.value === 'ไม่มี' && element.checked) {
        allCheckboxes.forEach(cb => { if (cb !== noneCheckbox) cb.checked = false; });
        otherInput.style.display = 'none';
    } else if (element.checked) {
        if (noneCheckbox) noneCheckbox.checked = false;
    }

    if (otherCheckbox) {
        otherInput.style.display = otherCheckbox.checked ? 'inline-block' : 'none';
    }
}

// ฟังก์ชันเก็บข้อมูลจากหน้า Form
const collectFormData = () => {
    let diseaseDOMs = document.querySelectorAll('input[name="congenital_disease"]:checked');
    let congenital_disease = Array.from(diseaseDOMs).map(cb => {
        if (cb.value === 'อื่นๆ') return `อื่นๆ (${document.getElementById('otherDiseaseDetail').value})`;
        return cb.value;
    }).join(', ');

    return {
        firstname: document.querySelector('input[name="firstname"]').value,
        lastname: document.querySelector('input[name="lastname"]').value,
        id_card: document.querySelector('input[name="id_card"]').value,
        age: document.querySelector('input[name="age"]').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        congenital_disease: congenital_disease,
        diagnosis: document.querySelector('textarea[name="diagnosis"]').value,
        checkup_date: document.querySelector('input[name="checkup_date"]').value
    };
};

// ฟังก์ชันโชว์ Error แบบเป็นรายการ
const showErrors = (errors, dom) => {
    let htmlData = `<div><strong>กรอกข้อมูลไม่ครบถ้วน</strong></div><ul>`;
    errors.forEach(err => htmlData += `<li>${err}</li>`);
    htmlData += `</ul>`;
    dom.innerHTML = htmlData;
    dom.className = 'notification-inline error';
    dom.style.display = 'block';
};

// ฟังก์ชันโชว์ข้อความแจ้งเตือน
const showMessage = (text, type, dom) => {
    dom.innerText = text;
    dom.className = `notification-inline ${type}`;
    dom.style.display = 'block';
};