const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'nongsan_db' 
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối CSDL:', err);
        return;
    }
    console.log('Đã kết nối thành công tới database nongsan_db!');
});

// Truyền biến db vào mọi request để controller có thể dùng được
app.use((req, res, next) => {
    req.db = db;
    next();
});

// KHAI BÁO CÁC ĐƯỜNG DẪN API
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes); // Phân biệt tiền tố user

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server đang chạy tại http://localhost:${PORT}`);
});
