const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadAppointments();
};

const loadAppointments = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/appointments`);
        const container = document.getElementById('appointment-container');

        // 1. ล้างหน้าจอก่อนเริ่มโหลด
        container.innerHTML = '';

        if (response.data.length === 0) {
            container.innerHTML = '<p>ยังไม่มีข้อมูลนัดหมายในขณะนี้</p>';
            return;
        }

        // 2. เริ่มวนลูปสร้างการ์ดคนไข้
        response.data.forEach(app => {
            // แปลงวันที่เป็นแบบไทย
            const thaiDate = new Date(app.app_date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const div = document.createElement('div');
            div.className = 'appointment-item';

            // ใส่ข้อมูลและปุ่ม

        const formattedHN = `HN-${String(app.user_id).padStart(4, '0')}`;

        div.innerHTML = `
        <div class="app-info">
        <strong>ใบสั่งนัดเลขที่:</strong> ${app.id} <br> 
        <strong>รหัสคนไข้:</strong> ${formattedHN} <br> 
        <strong>คนไข้:</strong> ${app.firstname} ${app.lastname} <br>
        <strong>หมอ:</strong> ${app.doctor_name} <br>
        <strong>วันที่:</strong> ${thaiDate} | <strong>เวลา:</strong> ${app.app_time} น. <br>
        <strong>สถานที่:</strong> ${app.location}</div> <div class="button-group">
        <button class="delete-btn" onclick="deleteAppointment(${app.id})">ยกเลิกนัด</button>
        <button class="print-btn-small" onclick="goToPrintCard(${app.id})">พิมพ์ใบนัด</button>
        <button class="edit-btn" onclick="location.href='appointment.html?id=${app.id}'">แก้ไขนัด</button> </div>
`;

            // 3. แปะการ์ดลงใน Container
            container.appendChild(div);
        });

    } catch (error) {
        console.error('โหลดนัดหมายไม่สำเร็จ:', error);
        document.getElementById('appointment-container').innerHTML = '<p style="color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
};

// ฟังก์ชันลบนัดหมาย
const deleteAppointment = async (id) => {
    if (confirm('ต้องการจะยกเลิกนัดหมายนี้จริงๆ ใช่ไหม?')) {
        try {
            await axios.delete(`${BASE_URL}/appointments/${id}`);
            alert('ยกเลิกนัดหมายเรียบร้อยแล้ว');
            await loadAppointments(); // โหลดข้อมูลใหม่ทันที
        } catch (error) {
            console.error('ยกเลิกไม่สำเร็จ:', error);
            alert('ยกเลิกไม่สำเร็จ');
        }
    }
};

// ฟังก์ชันวาร์ปไปหน้าพิมพ์การ์ด
function goToPrintCard(id) {
    window.location.href = `card.html?id=${id}`;
}