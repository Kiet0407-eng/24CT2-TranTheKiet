import React, { useEffect, useState } from 'react';
import './AdminCategories.css';

const categoriesUrl = 'http://localhost:5000/api/admin/categories';
const emptyForm = { ten_danh_muc: '', hinh_anh: '', mo_ta: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch(categoriesUrl);
      if (!response.ok) throw new Error('Không thể tải danh sách danh mục');
      setCategories(await response.json());
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.ten_danh_muc.trim()) return;
    setSaving(true);
    try {
      const response = await fetch(editId !== null ? `http://localhost:5000/api/admin/categories/${editId}` : categoriesUrl, {
        method: editId !== null ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ten_danh_muc: form.ten_danh_muc.trim(),
          hinh_anh: form.hinh_anh.trim(),
          mo_ta: form.mo_ta.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Không thể lưu danh mục');
      setForm(emptyForm);
      setEditId(null);
      await fetchCategories();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (categoryId, category) => {
    setEditId(categoryId);
    setForm({
      ten_danh_muc: category.ten_danh_muc || '',
      hinh_anh: category.hinh_anh || '',
      mo_ta: category.mo_ta || '',
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditId(null); setForm(emptyForm); setError(''); };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      const response = await fetch(`${categoriesUrl}/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Không thể xóa danh mục');
      await fetchCategories();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="admin-page categories-page">
      <div className="categories-heading">
        <div><span className="categories-eyebrow">QUẢN TRỊ CỬA HÀNG</span><h1>Quản lý Danh mục</h1></div>
        <span className="categories-count">{categories.length} danh mục</span>
      </div>
      {error && <p role="alert" className="categories-error">{error}</p>}

      <section className="admin-card category-form-card">
        <div className="category-form-heading">
          <div><h2>{editId !== null ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2><p>Điền thông tin để giúp khách hàng tìm sản phẩm dễ dàng hơn.</p></div>
        </div>
        <form onSubmit={handleSubmit} className="category-form">
          <label className="category-field">
            <span>Tên danh mục <b>*</b></span>
            <input type="text" placeholder="Ví dụ: Rau ăn lá" value={form.ten_danh_muc} onChange={(event) => setForm({ ...form, ten_danh_muc: event.target.value })} required />
          </label>
          <label className="category-field">
            <span>URL Hình ảnh đại diện</span>
            <input type="url" placeholder="https://example.com/category.jpg" value={form.hinh_anh} onChange={(event) => setForm({ ...form, hinh_anh: event.target.value })} />
          </label>
          <label className="category-field category-description-field">
            <span>Mô tả danh mục</span>
            <textarea rows="3" placeholder="Mô tả ngắn về danh mục này..." value={form.mo_ta} onChange={(event) => setForm({ ...form, mo_ta: event.target.value })} />
          </label>
          <div className="category-form-actions">
            {editId !== null && <button type="button" className="category-button secondary" onClick={cancelEdit}>Hủy sửa</button>}
            <button type="submit" className="category-button primary" disabled={saving}>{saving ? 'Đang lưu…' : editId !== null ? 'Lưu thay đổi' : 'Thêm danh mục'}</button>
          </div>
        </form>
      </section>

      <section className="admin-card category-list-card">
        <div className="category-list-heading"><h2>Danh sách danh mục</h2><span>{categories.length} mục</span></div>
        <div className="category-table-wrap">
          <table className="category-table">
            <thead><tr><th>ID</th><th>Ảnh</th><th>Tên danh mục</th><th>Mô tả</th><th>Hành động</th></tr></thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="category-id">#{category.id}</td>
                  <td><div className="category-thumbnail">{category.hinh_anh ? <img src={category.hinh_anh} alt={category.ten_danh_muc} /> : <span>Ảnh</span>}</div></td>
                  <td><strong>{category.ten_danh_muc}</strong></td>
                  <td className="category-description">{category.mo_ta || '—'}</td>
                  <td><div className="category-row-actions"><button className="category-button edit" onClick={() => startEdit(category.id, category)}>Sửa</button><button className="category-button delete" onClick={() => handleDelete(category.id)}>Xóa</button></div></td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td className="category-empty" colSpan="5">Chưa có danh mục nào.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminCategories;
