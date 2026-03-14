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
    
    return errors;
    }
}

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        try {
            // ดึงข้อมูลเก่า (อย่าลืมเช็ค Port Backend ของคุณหนูนะจ๊ะ)
            const response = await axios.get(`http://localhost:8000/users/${editId}`);
            const user = response.data;

            // เอาข้อมูลมาหยอดใส่ช่องตาม name ใน HTML จ๊ะ
            document.querySelector('input[name="firstName"]').value = user.firstname || '';
            document.querySelector('input[name="lastName"]').value = user.lastname || '';
            document.querySelector('input[name="age"]').value = user.age || '';
            document.querySelector('input[name="checkup_date"]').value = user.checkup_date || '';
            
            // เลือกเพศให้ตรง
            const genderRadio = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
            if (genderRadio) genderRadio.checked = true;

            // หยอดประวัติโรค (Textarea)
            document.querySelector('textarea[name="diagnosis"]').value = user.diagnosis || '';

            // เปลี่ยนชื่อปุ่ม "ส่งข้อมูล" ให้เป็นโหมดแก้ไข
            const submitBtn = document.querySelector('button[onclick="submitData()"]');
            if (submitBtn) submitBtn.innerText = 'ยืนยันการแก้ไขข้อมูล';

        } catch (error) {
            console.error('ดึงข้อมูลเก่ามาโชว์ไม่ได้:', error);
        }
    }
};

const submitData = async () => {
let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked');
    let checkupDateDOM = document.querySelector('input[name=checkup_date]');
    let diseaseDOMs = document.querySelectorAll('input[name=congenital_disease]:checked');
    let diagnosisDOM = document.querySelector('textarea[name=diagnosis]');
    let messageDOM = document.getElementById('message');

    try {
    let congenital_disease = '';
    for (let i = 0; i < diseaseDOMs.length; i++) {
        if (diseaseDOMs[i].value === 'อื่นๆ') {
        let otherDetail = document.getElementById('otherDiseaseDetail').value;
            congenital_disease += `อื่นๆ (${otherDetail})`;
        } else {
        congenital_disease += diseaseDOMs[i].value;
    if (i < diseaseDOMs.length - 1) {
            congenital_disease += ', ';
            }
        }
        }

    let userData = {
            firstname: firstNameDOM ? firstNameDOM.value : '',
            lastname: lastNameDOM ? lastNameDOM.value : '',
            age: ageDOM ? ageDOM.value : '',
            gender: genderDOM ? genderDOM.value : '', // เช็คถ้ามีค่าถึงเอา value
            congenital_disease: congenital_disease,
            diagnosis: diagnosisDOM ? diagnosisDOM.value : '',
            checkup_date: checkupDateDOM.value
        }

    const errors = validateData(userData) || [];
    if (errors && errors.length > 0) {
            //ถ้ามี error 
        throw {
            message: 'กรอกข้อมูลไม่ครบถ้วน',
            errors: errors
        }
        }

    const response = await axios.post('http://localhost:8000/users', userData)
        console.log('response', response.data);
        messageDOM.innerText = 'บันทึกข้อมูลสำเร็จ'
        messageDOM.className = 'message success'

    } catch (error) {
    console.log('Error object:', error); 
    let displayMessage = "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
    let displayErrors = [];
    if (error.response && error.response.data) {
        displayMessage = error.response.data.message || displayMessage;
        displayErrors = error.response.data.errors || [];
    } else if (error.errors) {
        displayMessage = error.message;
        displayErrors = error.errors;
    }
    // ส่วนแสดงผล (ถ้าไม่มี error list ก็จะไม่วนลูป ไม่บึ้มแน่นอน!)
    let htmlData = `<div>${displayMessage}</div>`;
    if (Array.isArray(displayErrors) && displayErrors.length > 0) {
        htmlData += '<ul>';
        for (let i = 0; i < displayErrors.length; i++) {
        htmlData += `<li>${displayErrors[i]}</li>`;
        }
        htmlData += '</ul>';
    }

    messageDOM.innerHTML = htmlData;
    messageDOM.className = 'notification-inline error';
    messageDOM.style.display = 'block';
    }
}

const submitAndGoToAppoint = async () => {
    // 1. ดึงข้อมูลจากฟอร์มมาใส่ใน Object (ให้เหมือนกับใน submitData ของคุณหนูนะจ๊ะ)
    const userData = {
        firstname: document.querySelector('input[name="firstname"]').value,
        lastname: document.querySelector('input[name="lastname"]').value,
        age: document.querySelector('input[name="age"]').value,
        checkup_date: document.querySelector('input[name="checkup_date"]').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        congenital_disease: Array.from(document.querySelectorAll('input[name="congenital_disease"]:checked')).map(el => el.value),
        diagnosis: document.querySelector('textarea[name="diagnosis"]').value
    };

    // 2. เช็คความถูกต้อง (ใช้ Array )
    const errors = validateData(userData);
    if (errors.length > 0) {
        const messageDOM = document.getElementById('message');
        messageDOM.innerText = errors[0];
        messageDOM.className = 'message error';
        messageDOM.style.display = 'block';
        return;
    }
    try {
        // 3. บันทึกลงฐานข้อมูลตาราง users
        const response = await axios.post(`${BASE_URL}/users`, userData);
        
        // 4. ดึง ID ที่เพิ่งได้ใหม่มา
        const newUserId = response.data.insertId;

        // 5. วาร์ปไปหน้าทำนัดหมาย พร้อมส่ง ID ไปด้วย
        window.location.href = `appointment.html?userId=${newUserId}`;

    } catch (error) {
        console.error(error);
        alert('บันทึกข้อมูลไม่สำเร็จ');
    }
};

function handleCheckboxChange(element) {
    const allCheckboxes = document.querySelectorAll('input[name="congenital_disease"]');
    const noneCheckbox = Array.from(allCheckboxes).find(cb => cb.value === 'ไม่มี');
    const otherCheckbox = Array.from(allCheckboxes).find(cb => cb.value === 'อื่นๆ');
    const otherInput = document.getElementById('otherDiseaseDetail');

    // --- ส่วนที่ 1: ถ้าติ๊ก "ไม่มี" ---
    if (element.value === 'ไม่มี' && element.checked) {
        allCheckboxes.forEach(cb => {
            if (cb !== noneCheckbox) cb.checked = false; // ปลดติ๊กอันอื่นให้หมด
        });
        otherInput.style.display = 'none'; // ซ่อนช่องกรอกอื่นๆ ด้วย
    } 
    // --- ส่วนที่ 2: ถ้าติ๊กโรคอื่น (ที่ไม่ใช่ "ไม่มี") ---
    else if (element.checked) {
        if (noneCheckbox) noneCheckbox.checked = false; // ปลดติ๊กช่อง "ไม่มี" ทันที
    }

    // --- ส่วนที่ 3: จัดการการโชว์ช่องกรอก "อื่นๆ" ---
    if (otherCheckbox) {
        otherInput.style.display = otherCheckbox.checked ? 'inline-block' : 'none';
        if (!otherCheckbox.checked) {
            otherInput.value = ''; // ล้างข้อความถ้าเลิกติ๊ก
        }
    }
}