const BASE_URL = 'http://localhost:8000';

window.onload = async () => {

    await loadAppointments();

    const searchInput = document.getElementById('searchInput');
    const noDataMsg = document.getElementById('noDataMessage');

    if (searchInput) {
        searchInput.addEventListener('keyup', function() {

            const val = this.value.trim().toLowerCase();
            
            const items = document.querySelectorAll('.appointment-item');
            let hasVisibleItem = false;


            if (val === "") {
                items.forEach(item => item.classList.remove('hidden'));
                if (noDataMsg) noDataMsg.classList.add('hidden');
                return;
            }

            const keywords = val.split(/\s+/);
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                const isMatch = keywords.every(kw => text.includes(kw));
                
                if (isMatch) {
                    item.classList.remove('hidden');
                    hasVisibleItem = true;
                } else {
                    item.classList.add('hidden');
                }
            });

            if (noDataMsg) {
                if (!hasVisibleItem) {
                    noDataMsg.classList.remove('hidden');
                    console.log("หาไม่เจอ!");
                } else {
                    noDataMsg.classList.add('hidden');
                }
            }
        });
    }
};

const loadAppointments = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/appointments`);
        const container = document.getElementById('appointment-container');
        container.innerHTML = '';

        if (response.data.length === 0) {
            container.innerHTML = '<p class="text-center">ยังไม่มีข้อมูลนัดหมายในขณะนี้</p>';
            return;
        }

        response.data.forEach(app => {
            const thaiDate = new Date(app.app_date).toLocaleDateString('th-TH', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            const formattedHN = `HN-${String(app.user_id).padStart(4, '0')}`;

            const div = document.createElement('div');
            div.className = 'appointment-item';
            div.innerHTML = `
                <div class="app-info">
                    <strong>ใบสั่งนัดเลขที่:</strong> ${app.id} <br> 
                    <strong>รหัสคนไข้:</strong> ${formattedHN} <br> 
                    <strong>คนไข้:</strong> ${app.firstname} ${app.lastname} <br>
                    <strong>หมอ:</strong> ${app.doctor_name} <br>
                    <strong>วันที่:</strong> ${thaiDate} | <strong>เวลา:</strong> ${app.app_time} น. <br>
                    <strong>สถานที่:</strong> ${app.location}
                </div> 
                <div class="button-group">
                    <button class="delete-btn" onclick="deleteAppointment(${app.id})">ยกเลิกนัด</button>
                    <button class="print-btn-small" onclick="goToPrintCard(${app.id})">พิมพ์ใบนัด</button>
                    <button class="edit-btn" onclick="location.href='appointment.html?id=${app.id}'">แก้ไขนัด</button> 
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('โหลดนัดหมายไม่สำเร็จ:', error);
    }
};

const deleteAppointment = async (id) => {
    const result = await Swal.fire({
        title: 'ยืนยันการยกเลิกนัด?',
        text: "คุณต้องการจะยกเลิกนัดหมายนี้จริงๆ ใช่ไหม?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่ ยกเลิกไปเลย!',
        cancelButtonText: 'ไม่ อย่ายกเลิกนะ!',
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`${BASE_URL}/appointments/${id}`);
            
            await Swal.fire({
                title: 'ยกเลิกเรียบร้อย!',
                text: 'รายการนัดหมายถูกลบออกจากระบบแล้ว',
                icon: 'success'
            });

            await location.reload();
            
        } catch (error) {
            console.error('ยกเลิกนัดไม่สำเร็จ:', error);
            
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถยกเลิกนัดได้ ลองเช็กเซิร์ฟเวอร์',
                icon: 'error'
            });
        }
    }
};

function goToPrintCard(id) {
    window.location.href = `card.html?id=${id}`;
}