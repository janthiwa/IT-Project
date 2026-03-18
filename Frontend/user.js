const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();

    // ตั้งค่าระบบค้นหา
const searchInput = document.getElementById('searchInput');
const noDataMsg = document.getElementById('noDataMessage');

if (searchInput) {
    searchInput.addEventListener('keyup', function() {

        const keywords = this.value.toLowerCase().trim().split(/\s+/);
        

        const items = document.querySelectorAll('.user-item, .appointment-item');
        let hasVisibleItem = false;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            
            const isMatch = keywords.every(kw => text.includes(kw));

            if (isMatch) {
                item.style.display = "";
                hasVisibleItem = true;
            } else {
                item.style.display = "none";
            }
        });


        if (noDataMsg) {

            if (!hasVisibleItem && this.value.trim() !== "") {
                noDataMsg.style.display = "block";
            } else {
                noDataMsg.style.display = "none";
            }
        }
    });
}
}

// ฟังก์ชันโหลดข้อมูลผู้ป่วย
const loadData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        const userDOM = document.getElementById('user');

        userDOM.innerHTML = '';

        response.data.forEach((user, index) => {
            const div = document.createElement('div');
            div.className = 'user-item';
            div.innerHTML = `
                <span><strong>รหัสผู้ป่วย:</strong> HN-${user.id.toString().padStart(4, '0')} | <strong>ชื่อ:</strong> ${user.firstname} ${user.lastname}</span>
                <div class="button-group">
                    <button class="edit-btn" onclick="location.href='index.html?id=${user.id}'">Edit</button>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            `;
            userDOM.appendChild(div);
        });
    } catch (error) {
        console.error('โหลดข้อมูลไม่สำเร็จ:', error);
    }
};

// ลบเสร็จโหลดใหม่ทันที
const deleteUser = async (id) => {
    if (confirm('แน่ใจนะว่าจะลบคนนี้')) {
        try {
            await axios.delete(`${BASE_URL}/users/${id}`);
            alert('ลบข้อมูลเรียบร้อยแล้ว');
            await loadData();
        } catch (error) {
            console.error('ลบไม่สำเร็จ:', error);
        }
    }
};