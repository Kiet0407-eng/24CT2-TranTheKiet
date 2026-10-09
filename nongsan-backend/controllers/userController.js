const bcrypt = require('bcryptjs');

// Hàm lấy danh sách sản phẩm
const getProducts = (req, res) => {
    const query = "SELECT * FROM products";
    req.db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
        res.status(200).json(results);
    });
};

const getCategories = (req, res) => {
    req.db.query("SELECT * FROM categories", (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi Server", error: err });
        res.status(200).json(results);
    });
};

// Hàm Đăng Ký Tài Khoản
const register = (req, res) => {
    const { name, email, password } = req.body;
    
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    req.db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi DB" });
        if (results.length > 0) return res.status(400).json({ message: "Email này đã được sử dụng!" });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const insertQuery = "INSERT INTO users (ho_ten, email, mat_khau, vai_tro) VALUES (?, ?, ?, 'Khách hàng')";
        req.db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: "Lỗi thêm người dùng" });
            res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
        });
    });
};

// Hàm Đăng Nhập
const login = (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    req.db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi DB" });
        if (results.length === 0) return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });

        const user = results[0]; 
        
        const isMatch = bcrypt.compareSync(password, user.mat_khau);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu không chính xác!" });

        res.status(200).json({
            message: "Đăng nhập thành công!",
            user: {
                id: user.id,
                name: user.ho_ten,
                email: user.email,
                role: user.vai_tro
            }
        });
    });
};

// Hàm Tạo Đơn Hàng Mới
const createOrder = (req, res) => {
    const { customer, items, total, method, userId } = req.body;

    // 1. Lưu thông tin chung vào bảng orders
    const orderQuery = `
        INSERT INTO orders (user_id, ho_ten, so_dien_thoai, dia_chi, ghi_chu, tong_tien, phuong_thuc_tt, trang_thai) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận')
    `;
    
    const orderValues = [userId || null, customer.fullName, customer.phone, customer.address, customer.note, total, method];

    req.db.query(orderQuery, orderValues, (err, result) => {
        if (err) {
            console.error("Lỗi lưu đơn hàng:", err);
            return res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn hàng" });
        }

        const newOrderId = result.insertId; // Lấy ID của đơn hàng vừa tạo

        // 2. Lưu chi tiết từng sản phẩm vào bảng order_details
        const detailQuery = "INSERT INTO order_details (order_id, product_id, so_luong, don_gia) VALUES ?";
        const detailValues = items.map(item => [
            newOrderId, 
            item.id, 
            item.amount || item.quantity || 1, 
            item.price
        ]);

        req.db.query(detailQuery, [detailValues], (err2) => {
            if (err2) {
                console.error("Lỗi lưu chi tiết đơn hàng:", err2);
                return res.status(500).json({ message: "Lỗi hệ thống khi lưu chi tiết đơn" });
            }
            
            res.status(201).json({ 
                message: "Đặt hàng thành công!", 
                orderId: newOrderId 
            });
        });
    });
};

module.exports = {
    getProducts,
    getCategories,
    register,
    login,
    createOrder
};
