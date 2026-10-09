import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import './AdminProducts.css';

const API_URL = 'http://localhost:5000/api/admin';
const EMPTY_FORM = {
  name: '',
  price: '',
  stock: '',
  category_id: '',
  hinh_anh: '',
  mo_ta: '',
};

const readError = async (response, fallback) => {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || fallback);
  return result;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await readError(response, 'Không thể tải danh sách nông sản');
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'Không thể kết nối máy chủ');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await readError(response, 'Không thể tải danh mục');
      setCategories(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message || 'Không thể tải danh mục');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi');
    if (!keyword) return products;
    return products.filter((product) => (product.ten_sp || '').toLocaleLowerCase('vi').includes(keyword));
  }, [products, search]);

  const handleInputChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category_id: formData.category_id || null,
      hinh_anh: formData.hinh_anh.trim(),
      mo_ta: formData.mo_ta.trim(),
    };
    const body = imageFile
      ? (() => {
          const form = new FormData();
          Object.entries(payload).forEach(([key, value]) => form.append(key, value ?? ''));
          form.append('hinh_anh_file', imageFile);
          return form;
        })()
      : JSON.stringify(payload);

    try {
      const response = await fetch(
        editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`,
        {
          method: editingId ? 'PUT' : 'POST',
          ...(!imageFile && { headers: { 'Content-Type': 'application/json' } }),
          body,
        },
      );
      const result = await readError(response, editingId ? 'Không thể cập nhật sản phẩm' : 'Không thể thêm sản phẩm');
      setNotice(result.message || (editingId ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công'));
      resetForm();
      await fetchProducts();
    } catch (requestError) {
      setError(requestError.message || 'Không thể kết nối máy chủ');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.ten_sp || '',
      price: product.gia_ban ?? '',
      stock: product.so_luong_ton ?? '',
      category_id: product.category_id ?? product.danh_muc_id ?? '',
      hinh_anh: product.hinh_anh || '',
      mo_ta: product.mo_ta || '',
    });
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      const result = await readError(response, 'Không thể xóa sản phẩm');
      setNotice(result.message || 'Đã xóa sản phẩm');
      if (editingId === id) resetForm();
      await fetchProducts();
    } catch (requestError) {
      setError(requestError.message || 'Không thể kết nối máy chủ');
    }
  };

  const handleDownloadQr = (product) => {
    const canvas = document.getElementById(`product-qr-${product.id}`);
    if (!canvas) return;

    const link = document.createElement('a');
    const safeName = (product.ten_sp || `san-pham-${product.id}`)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-]+/g, '-')
      .replace(/^-|-$/g, '') || `san-pham-${product.id}`;
    link.download = `qr-${safeName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="admin-page products-page">
      <div className="page-header">
        <h1>Quản lý Nông sản</h1>
        <p>Thêm, cập nhật và theo dõi sản phẩm trong cửa hàng.</p>
      </div>

      {error && <p className="products-message error-message" role="alert">{error}</p>}
      {notice && <p className="products-message success-message" role="status">{notice}</p>}

      <section className="admin-card product-form-card">
        <div className="product-card-heading">
          <div>
            <h3>{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <p>Điền thông tin sản phẩm và chọn danh mục phù hợp.</p>
          </div>
          {editingId && <button type="button" className="btn-secondary" onClick={resetForm}>Hủy sửa</button>}
        </div>

        <form onSubmit={handleSubmit} className="product-form-grid">
          <label className="product-field">
            <span>Tên sản phẩm</span>
            <input type="text" name="name" placeholder="Ví dụ: Cà chua hữu cơ" value={formData.name} onChange={handleInputChange} required />
          </label>
          <label className="product-field">
            <span>Danh mục</span>
            <select name="category_id" value={formData.category_id} onChange={handleInputChange}>
              <option value="">Chưa phân loại</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.ten_danh_muc}</option>
              ))}
            </select>
          </label>
          <label className="product-field">
            <span>Giá bán (VND)</span>
            <input type="number" name="price" min="1" step="1" placeholder="Giá bán" value={formData.price} onChange={handleInputChange} required />
          </label>
          <label className="product-field">
            <span>Tồn kho (kg)</span>
            <input type="number" name="stock" min="0" step="1" placeholder="Số lượng tồn" value={formData.stock} onChange={handleInputChange} required />
          </label>
          <label className="product-field product-field-wide">
            <span>URL hình ảnh</span>
            <input
              type="url"
              name="hinh_anh"
              placeholder="https://example.com/product.jpg"
              value={formData.hinh_anh}
              onChange={(event) => {
                handleInputChange(event);
                setImageFile(null);
                if (imageInputRef.current) imageInputRef.current.value = '';
              }}
            />
          </label>
          <label className="product-field product-field-wide">
            <span>Hoặc tải ảnh từ máy tính</span>
            <input
              ref={imageInputRef}
              type="file"
              name="hinh_anh_file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            />
            {imageFile && <small>{imageFile.name}</small>}
          </label>
          <label className="product-field product-field-wide">
            <span>Mô tả sản phẩm</span>
            <textarea name="mo_ta" rows="4" placeholder="Mô tả nguồn gốc, đặc điểm và cách bảo quản..." value={formData.mo_ta} onChange={handleInputChange} />
          </label>
          <div className="product-form-actions product-field-wide">
            <button type="submit" className="btn-primary">{editingId ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
          </div>
        </form>
      </section>

      <section className="admin-card product-list-card">
        <div className="product-list-heading">
          <div>
            <h3>Danh sách sản phẩm <span>({filteredProducts.length})</span></h3>
            <p>Tìm kiếm sản phẩm theo tên để thao tác nhanh.</p>
          </div>
          <input
            className="product-search"
            type="search"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Tìm kiếm sản phẩm theo tên"
          />
        </div>

        <div className="product-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Mã QR</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const category = categories.find((item) => item.id === (product.category_id ?? product.danh_muc_id));
                return (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>
                      <img
                        src={product.hinh_anh || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                        alt={product.ten_sp}
                        className="table-img"
                      />
                    </td>
                    <td>
                      <strong>{product.ten_sp}</strong>
                      {product.mo_ta && <small className="product-description">{product.mo_ta}</small>}
                    </td>
                    <td>{category?.ten_danh_muc || 'Chưa phân loại'}</td>
                    <td className="text-danger">{Number(product.gia_ban).toLocaleString('vi-VN')}₫</td>
                    <td>{product.so_luong_ton} kg</td>
                    <td>
                      <div className="product-qr">
                        <QRCode
                          id={`product-qr-${product.id}`}
                          value={`${window.location.origin}/product/${encodeURIComponent(product.id)}`}
                          size={96}
                          level="H"
                          title={`Mã QR truy xuất ${product.ten_sp}`}
                        />
                        <button type="button" className="btn-qr-download" onClick={() => handleDownloadQr(product)}>
                          Tải QR
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="product-actions">
                        <button type="button" className="btn-edit" onClick={() => handleEdit(product)}>Sửa</button>
                        <button type="button" className="btn-danger" onClick={() => handleDelete(product.id)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr><td className="product-empty" colSpan="8">Không tìm thấy sản phẩm phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminProducts;
