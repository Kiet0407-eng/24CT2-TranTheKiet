import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && (data.user.role === 'Admin' || data.user.role === 'Nhân viên')) {
        localStorage.setItem('adminToken', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        alert("Tài khoản không có quyền truy cập khu vực Quản trị!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form onSubmit={handleLogin} className="admin-login-form">
        <div className="login-header">
          <h2>Agri<span>Admin</span></h2>
          <p>Hệ thống Quản trị Nội bộ</p>
        </div>
        <div className="form-group">
          <label>Email quản trị</label>
          <input type="email" placeholder="admin@agrimarket.com" onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" placeholder="••••••••" onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-login">Đăng nhập hệ thống</button>
      </form>
    </div>
  );
};

export default AdminLogin;
