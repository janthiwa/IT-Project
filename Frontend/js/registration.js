const BASE_URL = 'http://localhost:8000/api';
let mode = 'CREATE';
let selectedId = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        mode = 'EDIT';
        selectedId = id;
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

const fillFormData = (user) => {
    document.querySelector('input[name="firstname"]').value = user.firstname || '';
    document.querySelector('input[name="lastname"]').value = user.lastname || '';
    document.querySelector('input[name="id_card"]').value = user.id_card || '';
    document.querySelector('input[name="age"]').value = user.age || '';


    if (user.birthday) {
        document.getElementById('birthday').value = user.birthday.split('T')[0];
    }

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
                        const otherInp = document.getElementById('otherDiseaseDetail');
                        otherInp.value = match[1];
                        otherInp.style.display = 'inline-block';
                    }
                }
            }
        });
    }
};

window.submitData = async () => {
    let messageDOM = document.getElementById('message');
    let userData = collectFormData();

    const errors = validateRegistration(userData); 
    
    if (errors.length > 0) {
        showErrors(errors, messageDOM);
        return;
    }

    try {
        let successMessage = mode === 'CREATE' ? 'บันทึกข้อมูลสำเร็จแล้ว' : 'แก้ไขข้อมูลเรียบร้อย';
        
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/users`, userData);
        } else {
            await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
        }

        messageDOM.innerHTML = `
            <div class="success-box">
                <span style="font-size: 20px;">✨</span> ${successMessage}
                <p style="font-size: 14px; margin-top: 5px; font-weight: 400;">ระบบกำลังพากลับหน้ารายชื่อ...</p>
            </div>`;
        messageDOM.classList.add('show');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => { 
            window.location.href = 'user.html'; 
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        messageDOM.innerHTML = `
            <div class="error-box">
                <strong>เกิดข้อผิดพลาด</strong>ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ โปรดเช็ก Backend ด่วน!</div>`;
        messageDOM.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

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
        birthday: document.getElementById('birthday').value,
        age: document.querySelector('input[name="age"]').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        congenital_disease: congenital_disease,
        diagnosis: document.querySelector('textarea[name="diagnosis"]').value,
        checkup_date: document.querySelector('input[name="checkup_date"]').value
    };
};

const showErrors = (errors, dom) => {
    const allInputs = document.querySelectorAll('input, textarea, select, .option-group, .disease-grid');
    allInputs.forEach(el => el.classList.remove('input-error'));

    let htmlList = errors.map(err => `<li>${err}</li>`).join('');
    dom.innerHTML = `
        <div class="error-box">
            <strong>กรุณากรอกข้อมูลให้ครบถ้วน:</strong>
            <ul>${htmlList}</ul>
        </div>`;
    dom.classList.add('show');

    const userData = collectFormData();

    const addErrorClass = (selector) => {
        const el = document.querySelector(selector) || document.getElementById(selector);
        if (el) el.classList.add('input-error');
    };

    if (!userData.firstname) addErrorClass('input[name="firstname"]');
    if (!userData.lastname) addErrorClass('input[name="lastname"]');
    if (!userData.id_card || userData.id_card.length !== 13) addErrorClass('input[name="id_card"]');
    if (!userData.birthday) addErrorClass('#birthday');
    if (!userData.age || userData.age <= 0) addErrorClass('input[name="age"]');
    if (!userData.checkup_date) addErrorClass('input[name="checkup_date"]');
    if (!userData.diagnosis) addErrorClass('textarea[name="diagnosis"]');
    
    if (!userData.gender) addErrorClass('.option-group');
    if (!userData.congenital_disease) addErrorClass('.disease-grid');

    window.scrollTo({ top: 0, behavior: 'smooth' });
};