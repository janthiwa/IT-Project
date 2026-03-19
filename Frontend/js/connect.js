const BASE_URL = 'http://localhost:8000';

window.onload = () => {
    checkConnection();
};

const statusTitle = document.getElementById('status-title');
const resultBox = document.getElementById('result-box');

const checkConnection = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const responseData = await response.json();
        
        statusTitle.innerText = "เย้! เชื่อมต่อ Database สำเร็จ!";
        statusTitle.className = "status-success"; 
        resultBox.innerHTML = `พบข้อมูลผู้ป่วยทั้งหมด <strong>${responseData.length}</strong> รายการในระบบ!`;

        Swal.fire({
            title: 'ยินดีด้วย!',
            text: `เชื่อมต่อระบบสำเร็จ พบข้อมูลคนไข้ ${responseData.length} รายการแล้ว`,
            icon: 'success'
        });

    } catch (error) {
        statusTitle.innerText = "แย่จัง! เชื่อมต่อล้มเหลว!";
        statusTitle.className = "status-error";           
        resultBox.innerText = "กรุณาเช็คว่ารัน Backend และ Database หรือยัง?";

        Swal.fire({
            title: 'อุ๊ย! เชื่อมต่อไม่สำเร็จ',
            text: 'อย่าลืมเปิด Server และ MySQL นะ',
            icon: 'error'
        });
    }
};