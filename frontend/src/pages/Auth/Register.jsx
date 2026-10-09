import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // HÀM XỬ LÝ GỌI API ĐĂNG KÝ
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message); // Hiển thị: "Đăng ký tài khoản thành công!"
        navigate('/login');
      } else {
        alert(data.message); // Hiển thị lỗi từ backend (vd: Email đã tồn tại)
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  // ... (Phần return giao diện HTML giữ nguyên như cũ của bạn)
  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">Agri<span>Market</span></div>
          <h2 className="auth-title">Tạo tài khoản mới</h2>
          <p className="auth-subtitle">Tham gia cùng chúng tôi để mua sắm nông sản tươi sạch mỗi ngày</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-control">
            <label>Họ và tên</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input type="text" name="name" placeholder="Ví dụ: Nguyễn Văn A" onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-control">
            <label>Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input type="email" name="email" placeholder="Ví dụ: email@example.com" onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-control">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" onChange={handleChange} required />
              {showPassword ? (
                <FiEyeOff className="password-toggle" onClick={() => setShowPassword(false)} />
              ) : (
                <FiEye className="password-toggle" onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>
          
          <div className="form-control">
            <label>Nhập lại mật khẩu</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Nhập lại mật khẩu vừa tạo" onChange={handleChange} required />
              {showConfirmPassword ? (
                <FiEyeOff className="password-toggle" onClick={() => setShowConfirmPassword(false)} />
              ) : (
                <FiEye className="password-toggle" onClick={() => setShowConfirmPassword(true)} />
              )}
            </div>
          </div>

          <button type="submit" className="auth-btn">Đăng Ký <FiUserPlus /></button>
        </form>

        <div className="social-login">
          <div className="social-divider">Hoặc đăng ký bằng</div>
          <div className="social-btn-group">
            <button className="social-btn google"><FaGoogle /> Google</button>
            <button className="social-btn facebook"><FaFacebookF /> Facebook</button>
          </div>
        </div>

        <div className="auth-link">
          Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;