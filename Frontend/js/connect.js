const BASE_URL = 'http://localhost:8000';

window.onload = checkConnection;

const statusTitle = document.getElementById('status-title');
const resultBox = document.getElementById('result-box');
const checkConnection = () => {
    fetch(`${BASE_URL}/users`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then((responseData) => {
            console.log('Connection Success:', responseData);
            statusTitle.innerText = "เชื่อมต่อ Database สำเร็จ!";
            statusTitle.className = "status-success"; 
            resultBox.innerHTML = `พบข้อมูลผู้ป่วยทั้งหมด <strong>${responseData.length}</strong> รายการในระบบ!`;
        })
        .catch((error) => {
            console.error('Connection Error:', error);
            statusTitle.innerText = "เชื่อมต่อล้มเหลว!";
            statusTitle.className = "status-error";           
            resultBox.innerText = "กรุณาเช็คว่ารัน Backend และ Database หรือยัง";
        });
};