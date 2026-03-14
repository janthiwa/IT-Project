const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
try {
        const response = await axios.get(`${BASE_URL}/users`);
        const userDOM = document.getElementById('user');

        userDOM.innerHTML = ''; 

        // 2. สร้างข้อมูลใหม่จาก Database
    response.data.forEach((user, index) => {
    const div = document.createElement('div');
    div.className = 'user-item'; // ใส่คลาสให้แถวรายชื่อด้วยนะจ๊ะ จะได้สวย
    div.innerHTML = `<span><strong>รหัสผู้ป่วย:</strong> HN-${user.id.toString().padStart(4, '0')} | <strong>ชื่อ:</strong> ${user.firstname} ${user.lastname}</span>
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

// 3. ฟังก์ชันลบที่ฉลาดขึ้น (ลบเสร็จโหลดใหม่ทันที)
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