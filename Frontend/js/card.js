const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');

    if (appId) {
        try {
            const response = await axios.get(`${BASE_URL}/appointment-card/${appId}`);
            const data = response.data;

            // จัดรูปแบบวันที่ไทย
            const thaiDate = new Date(data.app_date).toLocaleDateString('th-TH', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            document.getElementById('cardContent').innerHTML = `
                <div class="info-row"><span class="label">ชื่อ-นามสกุล:</span> <span class="value">${data.firstname} ${data.lastname}</span></div>
                <div class="info-row"><span class="label">อายุ:</span> <span class="value">${data.age} ปี</span></div>
                <div class="info-row"><span class="label">ผู้นัดพบ:</span> <span class="value">${data.doctor_name || 'ไม่ระบุ'}</span></div>
                <div class="info-row"><span class="label">วันที่นัดหมาย:</span> <span class="value">${thaiDate}</span></div>
                <div class="info-row"><span class="label">เวลานัดหมาย:</span> <span class="value">${data.app_time.substring(0, 5)} น.</span></div>
                <div class="info-row"><span class="label">สถานที่:</span> <span class="value">${data.location}</span></div>
                <div class="info-row"><span class="label">อาการ/โรคประจำตัว:</span> <span class="value">${data.congenital_disease || 'ไม่มี'}</span></div>
                <div class="info-row"><span class="label">หมายเหตุ:</span> <span class="value">${data.note || 'ไม่มี'}</span></div>
            `;
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            document.getElementById('cardContent').innerHTML = '<p class="error-text">ไม่พบข้อมูลใบนัดหมาย</p>';
        }
    }
};