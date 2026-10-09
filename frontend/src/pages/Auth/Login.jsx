import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // HÀM XỬ LÝ GỌI API ĐĂNG NHẬP
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log("Data từ backend:", data);
      
      if (response.ok) {
        alert(data.message); 
        // Lưu thông tin người dùng vào bộ nhớ trình duyệt (localStorage) để dùng cho Giỏ hàng sau này
        sessionStorage.setItem('user', JSON.stringify(data.user)); 
        window.dispatchEvent(new Event('login'));
        const role = data.user.role?.trim().toLowerCase();
        navigate(role === 'admin' ? '/admin' : '/');
      } else {
        alert(data.message); // Hiển thị lỗi (sai pass, không thấy email)
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">Agri<span>Market</span></div>
          <h2 className="auth-title">Chào mừng trở lại!</h2>
          <p className="auth-subtitle">Đăng nhập để tiếp tục mua sắm nông sản tươi sạch</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-control">
            <label>Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input type="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          
          <div className="form-control">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
              {showPassword ? (
                <FiEyeOff className="password-toggle" onClick={() => setShowPassword(false)} />
              ) : (
                <FiEye className="password-toggle" onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>

          <div className="auth-options">
            <label className="remember-me"><input type="checkbox" /><span>Ghi nhớ đăng nhập</span></label>
            <Link to="/forgot-password" className="forgot-link">Quên mật khẩu?</Link>
          </div>

          <button type="submit" className="auth-btn">Đăng Nhập <FiLogIn /></button>
        </form>

        <div className="social-login">
          <div className="social-divider">Hoặc đăng nhập bằng</div>
          <div className="social-btn-group">
            <button className="social-btn google"><FaGoogle /> Google</button>
            <button className="social-btn facebook"><FaFacebookF /> Facebook</button>
          </div>
        </div>

        <div className="auth-link">
          Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
