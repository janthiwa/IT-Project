const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();

    // --- ระบบค้นหา (Search System) ---
    const searchInput = document.getElementById('searchInput');
    const noDataMsg = document.getElementById('noDataMessage');

    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const val = this.value.trim().toLowerCase();
            

            const items = document.querySelectorAll('.user-item');
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
                } else {
                    noDataMsg.classList.add('hidden');
                }
            }
        });
    }
}

// --- ฟังก์ชันโหลดรายชื่อผู้ป่วย ---
const loadData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        const userDOM = document.getElementById('user');
        userDOM.innerHTML = '';

        if (response.data.length === 0) {
            userDOM.innerHTML = '<p class="text-center">ยังไม่มีข้อมูลผู้ป่วยในระบบ</p>';
            return;
        }

        response.data.forEach((user) => {
            const div = document.createElement('div');
            div.className = 'user-item';
            const formattedHN = `HN-${user.id.toString().padStart(4, '0')}`;
            
            div.innerHTML = `
                <span><strong>รหัสผู้ป่วย:</strong> ${formattedHN} | <strong>ชื่อ:</strong> ${user.firstname} ${user.lastname}</span>
                <div class="button-group">
                    <button class="edit-btn" onclick="location.href='registration.html?id=${user.id}'">แก้ไข</button>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">ลบ</button>
                </div>
            `;
            userDOM.appendChild(div);
        });
    } catch (error) {
        console.error('โหลดข้อมูลไม่สำเร็จ:', error);
        document.getElementById('user').innerHTML = '<div class="error-box">เกิดข้อผิดพลาดในการดึงข้อมูล เช็ก Server</div>';
    }
};

// --- ฟังก์ชันลบผู้ป่วย ---
const deleteUser = async (id) => {
    const result = await Swal.fire({
        title: 'คุณแน่ใจนะว่าจะลบ?',
        text: "ข้อมูลจะหายวับไป กู้คืนไม่ได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่ ลบเลย!',
        cancelButtonText: 'ไม่ อย่าลบ!',
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`${BASE_URL}/users/${id}`);
            
            await Swal.fire({
                title: 'ลบเรียบร้อย!',
                icon: 'success'
            });

            await loadData(); 
        } catch (error) {
            Swal.fire({
                title: 'ลบไม่สำเร็จ',
                icon: 'error'
            });
        }
    }
};