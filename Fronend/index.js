const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // โหมดเริ่มต้นคือสร้างใหม่
let selectedId = ''; // เก็บ ID ของคนไข้ที่กำลังแก้ไข

// --- 1. ส่วนดึงข้อมูลเก่ามาโชว์ (สำหรับโหมด Edit) ---
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

        // หยอดข้อมูลลงฟอร์ม (เช็คชื่อ name ให้ตรงกับ HTML นะจ๊ะ)
        document.querySelector('input[name="firstname"]').value = user.firstname || '';
        document.querySelector('input[name="lastname"]').value = user.lastname || '';
        document.querySelector('input[name="id_card"]').value = user.id_card || '';
        document.querySelector('input[name="age"]').value = user.age || '';
        document.querySelector('input[name="checkup_date"]').value = user.checkup_date ? user.checkup_date.split('T')[0] : '';
            
        // เลือกเพศ
    const genderRadio = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
    if (genderRadio) genderRadio.checked = true;

        // หยอดผลวินิจฉัย
        document.querySelector('textarea[name="diagnosis"]').value = user.diagnosis || '';

        // จัดการ Checkbox โรคประจำตัว (แกะจาก String เป็นติ๊กถูก)
    if (user.congenital_disease) {
        const diseases = user.congenital_disease.split(', ');
        const checkboxes = document.querySelectorAll('input[name="congenital_disease"]');
        checkboxes.forEach(cb => {
        // ถ้าในข้อมูลมีชื่อโรคนี้ หรือมี "อื่นๆ"
    if (diseases.some(d => d.includes(cb.value))) {
        cb.checked = true;
        // ถ้าเป็น "อื่นๆ" ให้ดึงข้อความในวงเล็บมาใส่ในช่อง Text
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

        // เปลี่ยนข้อความบนหัวข้อและปุ่มจ๊ะ
        document.querySelector('.header').innerText = 'แก้ไขประวัติผู้ป่วย';
        document.querySelector('.submit-btn').innerText = 'ยืนยันการแก้ไขข้อมูล';
}

    catch (error) {
        console.error('ดึงข้อมูลคนไข้ล้มเหลว:', error);
        }
    }
};

// --- 2. ฟังก์ชัน Validation (ตรวจสอบความถูกต้อง) ---
const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname) errors.push('กรุณากรอกชื่อผู้ป่วย');
    if (!userData.lastname) errors.push('กรุณากรอกนามสกุลผู้ป่วย');
    
    if (!userData.id_card) {
        errors.push('กรุณากรอกเลขบัตรประชาชนผู้ป่วย');
    } else if (userData.id_card.length !== 13) {
        errors.push('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
    }

    if (!userData.age) {
        errors.push('กรุณากรอกอายุผู้ป่วย');
    } else if (userData.age > 120 || userData.age < 0) {
        errors.push('กรุณาระบุอายุให้ถูกต้อง (0-120 ปี)');
    }

    if (!userData.checkup_date) errors.push('กรุณาระบุวันที่เข้าตรวจ');
    if (!userData.gender) errors.push('กรุณาเลือกเพศผู้ป่วย');
    
    const otherCheckbox = document.getElementById('otherCheckbox'); // สมมติว่า ID คืออันนี้
    const otherInput = document.getElementById('otherDiseaseDetail');

    if (!userData.congenital_disease) {
    errors.push('กรุณาเลือกโรคประจำตัวอย่างน้อย 1 อย่าง หรือติ๊ก "ไม่มี"');
    } else if (otherCheckbox && otherCheckbox.checked && !otherInput.value.trim()) {
        errors.push('กรุณาระบุโรคประจำตัวในช่องอื่นๆ');
    }
    if (!userData.diagnosis) errors.push('กรุณากรอกผลการวินิจฉัย/ยาที่ได้รับ');

    return errors;
};

// --- 3. ฟังก์ชันส่งข้อมูล (Submit) ---
    const submitData = async () => {
    let messageDOM = document.getElementById('message');
    
    // ดึงข้อมูลจากฟอร์ม
    let firstName = document.querySelector('input[name="firstname"]').value;
    let lastName = document.querySelector('input[name="lastname"]').value;
    let idCard = document.querySelector('input[name="id_card"]').value;
    let age = document.querySelector('input[name="age"]').value;
    let genderDOM = document.querySelector('input[name="gender"]:checked');
    let checkupDate = document.querySelector('input[name="checkup_date"]').value;
    let diagnosis = document.querySelector('textarea[name="diagnosis"]').value;
    
    // รวมโรคประจำตัว (Checkbox)
    let diseaseDOMs = document.querySelectorAll('input[name="congenital_disease"]:checked');
    let congenital_disease = '';
    diseaseDOMs.forEach((cb, index) => {
        if (cb.value === 'อื่นๆ') {
            let otherDetail = document.getElementById('otherDiseaseDetail').value;
            congenital_disease += `อื่นๆ (${otherDetail})`;
        } else {
            congenital_disease += cb.value;
        }
        if (index < diseaseDOMs.length - 1) congenital_disease += ', ';
    });

    let userData = {
        firstname: firstName,
        lastname: lastName,
        id_card: idCard,
        age: age,
        gender: genderDOM ? genderDOM.value : '',
        congenital_disease: congenital_disease,
        diagnosis: diagnosis,
        checkup_date: checkupDate
    };

    const errors = validateData(userData);
    if (errors.length > 0) {
        let htmlData = `<div><strong>กรอกข้อมูลไม่ครบถ้วน</strong></div><ul>`;
        errors.forEach(err => htmlData += `<li>${err}</li>`);
        htmlData += `</ul>`;
        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'notification-inline error';
        messageDOM.style.display = 'block';
        return;
    }

    try {
        let successMessage = 'บันทึกข้อมูลแล้ว';
        
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/users`, userData);

        } else {
            await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
            successMessage = 'แก้ไขข้อมูลสำเร็จแล้ว';
        }

        messageDOM.innerText = successMessage;
        messageDOM.className = 'notification-inline success';
        messageDOM.style.display = 'block';
        
        // ถ้าบันทึกเสร็จ อาจจะวาร์ปไปหน้ารายชื่อหลังจาก 2 วินาที
        setTimeout(() => { window.location.href = 'user.html'; }, 2000);

    } catch (error) {
        console.error('Submit Error:', error);
        messageDOM.innerText = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
        messageDOM.className = 'notification-inline error';
        messageDOM.style.display = 'block';
    }
};

// ฟังก์ชันจัดการ Checkbox เหมือนที่คุณหนูมีอยู่แล้วจ๊ะ
function handleCheckboxChange(element) {
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