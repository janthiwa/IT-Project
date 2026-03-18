// ฟังก์ชันตรวจสอบข้อมูล
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
    
    const otherCheckbox = document.getElementById('otherCheckbox');
    const otherInput = document.getElementById('otherDiseaseDetail');

    if (!userData.congenital_disease) {
        errors.push('กรุณาเลือกโรคประจำตัวอย่างน้อย 1 อย่าง หรือติ๊ก "ไม่มี"');
    } else if (otherCheckbox && otherCheckbox.checked && !otherInput.value.trim()) {
        errors.push('กรุณาระบุโรคประจำตัวในช่องอื่นๆ');
    }
    if (!userData.diagnosis) errors.push('กรุณากรอกผลการวินิจฉัย/ยาที่ได้รับ');

    return errors;
};