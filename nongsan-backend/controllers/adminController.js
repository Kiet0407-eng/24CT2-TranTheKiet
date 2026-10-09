const getCategories = (req, res) => {
    req.db.query('SELECT * FROM categories ORDER BY id', (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi Server' });
        res.status(200).json(results);
    });
};

const addCategory = (req, res) => {
    const categoryName = typeof req.body.ten_danh_muc === 'string' ? req.body.ten_danh_muc.trim() : '';
    const image = typeof req.body.hinh_anh === 'string' ? req.body.hinh_anh.trim() : '';
    const description = typeof req.body.mo_ta === 'string' ? req.body.mo_ta.trim() : '';
    if (!categoryName) return res.status(400).json({ message: 'Category name is required' });

    req.db.query('SHOW COLUMNS FROM categories', (columnsError, columns) => {
        if (columnsError) return res.status(500).json({ message: 'Could not read category table schema' });
        const available = new Set(columns.map((column) => column.Field));
        if (!available.has('hinh_anh') || !available.has('mo_ta')) {
            return res.status(409).json({ message: 'categories requires hinh_anh and mo_ta columns' });
        }
        req.db.query(
            'INSERT INTO categories (ten_danh_muc, hinh_anh, mo_ta) VALUES (?, ?, ?)',
            [categoryName, image || null, description || null],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Could not add category' });
                res.status(201).json({ message: 'Category added', id: result.insertId });
            }
        );
    });
};

const updateCategory = (req, res) => {
    const id = Number(req.params.id);
    const categoryName = typeof req.body.ten_danh_muc === 'string' ? req.body.ten_danh_muc.trim() : '';
    const image = typeof req.body.hinh_anh === 'string' ? req.body.hinh_anh.trim() : '';
    const description = typeof req.body.mo_ta === 'string' ? req.body.mo_ta.trim() : '';
    if (!Number.isInteger(id) || id < 1 || !categoryName) {
        return res.status(400).json({ message: 'Invalid category id or name' });
    }

    req.db.query('SHOW COLUMNS FROM categories', (columnsError, columns) => {
        if (columnsError) return res.status(500).json({ message: 'Could not read category table schema' });
        const available = new Set(columns.map((column) => column.Field));
        if (!available.has('hinh_anh') || !available.has('mo_ta')) {
            return res.status(409).json({ message: 'categories requires hinh_anh and mo_ta columns' });
        }
        req.db.query(
            'UPDATE categories SET ten_danh_muc = ?, hinh_anh = ?, mo_ta = ? WHERE id = ?',
            [categoryName, image || null, description || null, id],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Could not update category' });
                if (result.affectedRows === 0) {
                    return req.db.query('SELECT id FROM categories WHERE id = ?', [id], (lookupError, rows) => {
                        if (lookupError) return res.status(500).json({ message: 'Could not check category' });
                        if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
                        res.status(200).json({ message: 'Category unchanged' });
                    });
                }
                res.status(200).json({ message: 'Category updated' });
            }
        );
    });
};
const deleteCategory = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
    }

    req.db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
        if (err?.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'Danh mục đang được sản phẩm sử dụng' });
        }
        if (err) return res.status(500).json({ message: 'Lỗi xóa danh mục' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json({ message: 'Xóa thành công' });
    });
};

const getProducts = (req, res) => {
    req.db.query('SELECT * FROM products ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi Server' });
        res.status(200).json(results);
    });
};

const getProductInput = (body, uploadedImage = '') => {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const price = Number(body.price);
    const stock = Number(body.stock);
    const categoryId = body.category_id ?? body.danh_muc_id ?? null;
    const parsedCategoryId = categoryId === '' || categoryId === null ? null : Number(categoryId);
    const image = uploadedImage || (typeof body.hinh_anh === 'string' ? body.hinh_anh.trim() : '');
    const description = typeof body.mo_ta === 'string' ? body.mo_ta.trim() : '';

    if (
        !name || !Number.isFinite(price) || price <= 0 ||
        !Number.isInteger(stock) || stock < 0 ||
        (parsedCategoryId !== null && (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1))
    ) return null;

    return { name, price, stock, categoryId: parsedCategoryId, image, description };
};

const withProductColumns = (req, res, callback) => {
    req.db.query('SHOW COLUMNS FROM products', (err, columns) => {
        if (err) return res.status(500).json({ message: 'Không thể đọc cấu trúc bảng sản phẩm' });
        callback(new Set(columns.map((column) => column.Field)));
    });
};

const addProduct = (req, res) => {
    const uploadedImage = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
    const product = getProductInput(req.body, uploadedImage);
    if (!product) return res.status(400).json({ message: 'Thông tin sản phẩm không hợp lệ' });

    withProductColumns(req, res, (columns) => {
        if (product.image && !columns.has('hinh_anh')) {
            return res.status(409).json({ message: 'Cơ sở dữ liệu chưa có cột hinh_anh. Hãy chạy migration add-product-image.sql.' });
        }

        const fields = ['category_id', 'ten_sp', 'gia_ban', 'so_luong_ton'];
        const values = [product.categoryId, product.name, product.price, product.stock];
        if (columns.has('mo_ta')) {
            fields.push('mo_ta');
            values.push(product.description);
        }
        if (columns.has('hinh_anh')) {
            fields.push('hinh_anh');
            values.push(product.image || null);
        }

        const placeholders = fields.map(() => '?').join(', ');
        req.db.query(
            `INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`,
            values,
            (err, result) => {
                if (err?.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ message: 'Danh mục đã chọn không tồn tại' });
                }
                if (err) return res.status(500).json({ message: 'Lỗi thêm sản phẩm' });
                res.status(201).json({ message: 'Thêm sản phẩm thành công', id: result.insertId });
            }
        );
    });
};

const updateProduct = (req, res) => {
    const id = Number(req.params.id);
    const uploadedImage = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
    const product = getProductInput(req.body, uploadedImage);
    if (!Number.isInteger(id) || id < 1 || !product) {
        return res.status(400).json({ message: 'ID hoặc thông tin sản phẩm không hợp lệ' });
    }

    withProductColumns(req, res, (columns) => {
        if (product.image && !columns.has('hinh_anh')) {
            return res.status(409).json({ message: 'Cơ sở dữ liệu chưa có cột hinh_anh. Hãy chạy migration add-product-image.sql.' });
        }

        const fields = ['category_id = ?', 'ten_sp = ?', 'gia_ban = ?', 'so_luong_ton = ?'];
        const values = [product.categoryId, product.name, product.price, product.stock];
        if (columns.has('mo_ta')) {
            fields.push('mo_ta = ?');
            values.push(product.description);
        }
        if (columns.has('hinh_anh')) {
            fields.push('hinh_anh = ?');
            values.push(product.image || null);
        }
        values.push(id);

        req.db.query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
            values,
            (err, result) => {
                if (err?.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ message: 'Danh mục đã chọn không tồn tại' });
                }
                if (err) return res.status(500).json({ message: 'Lỗi cập nhật sản phẩm' });
                if (result.affectedRows === 0) {
                    return req.db.query('SELECT id FROM products WHERE id = ?', [id], (lookupError, rows) => {
                        if (lookupError) return res.status(500).json({ message: 'Lỗi kiểm tra sản phẩm' });
                        if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
                        res.status(200).json({ message: 'Sản phẩm không có thay đổi' });
                    });
                }
                res.status(200).json({ message: 'Cập nhật sản phẩm thành công' });
            }
        );
    });
};

const deleteProduct = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    req.db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Lỗi xóa sản phẩm' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.status(200).json({ message: 'Đã xóa sản phẩm' });
    });
};

const getOrders = (req, res) => {
    const query = `
        SELECT orders.*, users.ho_ten, users.so_dien_thoai,
               '' AS dia_chi, '' AS phuong_thuc_tt
        FROM orders
        LEFT JOIN users ON users.id = orders.user_id
        ORDER BY orders.ngay_dat DESC
    `;
    req.db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng' });
        res.status(200).json(results);
    });
};

const updateOrderStatus = (req, res) => {
    const id = Number(req.params.id);
    const allowedStatuses = ['Chờ duyệt', 'Đang giao', 'Đã giao', 'Đã hủy'];
    const { status } = req.body;

    if (!Number.isInteger(id) || id < 1 || !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'ID hoặc trạng thái đơn hàng không hợp lệ' });
    }

    req.db.query(
        'UPDATE orders SET trang_thai = ? WHERE id = ?',
        [status, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng' });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        }
    );
};

module.exports = {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getOrders,
    updateOrderStatus,
};
