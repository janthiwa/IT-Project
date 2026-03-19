// ฟังก์ชันตรวจสอบข้อมูลหน้าใบนัดหมาย
const validateAppointment = (data) => {
    let errors = [];
    if (!data.user_id) errors.push('กรุณาเลือกคนไข้');
    if (!data.doctor_name) errors.push('กรุณากรอกชื่อคุณหมอ');
    if (!data.app_date) errors.push('กรุณาเลือกวันที่นัดหมาย');
    if (!data.app_time) errors.push('กรุณาเลือกเวลานัดหมาย');
    if (!data.location) errors.push('กรุณาระบุสถานที่ (ถ้าเลือกอื่นๆ อย่าลืมพิมพ์ระบุ)');
    if (!data.note) errors.push('กรุณากรอกหมายเหตุ');
    return errors;
};

// ฟังก์ชันตรวจสอบข้อมูลหน้าลงทะเบียน
const validateRegistration = (data) => {
    let errors = [];
    if (!data.firstname) errors.push('กรุณากรอกชื่อผู้ป่วย');
    if (!data.lastname) errors.push('กรุณากรอกนามสกุลผู้ป่วย');
    if (!data.id_card || data.id_card.length !== 13) errors.push('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');

    if (!data.birthday) {
        errors.push('กรุณาเลือกวันเดือนปีเกิดของผู้ป่วย');
    }

    if (!data.age || data.age <= 0) errors.push('กรุณากรอกอายุผู้ป่วยให้ถูกต้อง');
    if (!data.checkup_date) errors.push('กรุณาระบุวันที่เข้าตรวจ');
    if (!data.gender) errors.push('กรุณาเลือกเพศผู้ป่วย');
    if (!data.congenital_disease || data.congenital_disease.trim() === "") {
        errors.push('กรุณาเลือกโรคประจำตัวอย่างน้อย 1 รายการ');
    }

    if (!data.diagnosis) errors.push('กรุณากรอกผลการวินิจฉัย');

    return errors;
};