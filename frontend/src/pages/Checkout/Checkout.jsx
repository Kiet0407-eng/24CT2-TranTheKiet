import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const cartData = useCart();
  
  const currentCart = cartData.cart || cartData.cartItems || cartData.items || [];
  const safeCart = Array.isArray(currentCart) ? currentCart : [];
  const clearCart = cartData.clearCart || cartData.emptyCart || (() => {});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const totalPrice = safeCart.reduce((total, item) => total + (item.price * (item.amount || item.quantity || 1)), 0);
  const shippingFee = (totalPrice > 300000 || totalPrice === 0) ? 0 : 30000; 
  const finalPrice = totalPrice + shippingFee;

  const bankInfo = {
    bankId: 'MB',                 
    accountNo: '0905559129',      
    accountName: 'TRAN THE KIET',  
  };

  const qrCodeUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.png?amount=${finalPrice}&addInfo=Thanh toan don hang AgriMarket&accountName=${bankInfo.accountName}`;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (safeCart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (*)");
      return;
    }

    // Lấy thông tin user đã đăng nhập (nếu có) từ localStorage
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

    // Gói dữ liệu để gửi xuống Backend
    const orderPayload = {
      customer: formData,
      items: safeCart,
      total: finalPrice,
      method: paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản QR',
      userId: loggedInUser ? loggedInUser.id : null
    };

    try {
      // GỌI API ĐẶT HÀNG
      const response = await fetch('http://localhost:5000/api/user/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`🎉 Đặt hàng thành công! Mã đơn hàng của bạn là #${data.orderId}`);
        clearCart(); 
        navigate('/'); // Chuyển về trang chủ
      } else {
        alert("Lỗi đặt hàng: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Thanh Toán Đơn Hàng</h1>
        <p>Vui lòng kiểm tra thông tin trước khi đặt hàng.</p>
      </div>

      <form className="checkout-content" onSubmit={handleSubmit}>
        
        {/* --- CỘT TRÁI: THÔNG TIN GIAO HÀNG --- */}
        <div className="checkout-form-section">
          <h3>Thông tin giao hàng</h3>
          <div className="form-group">
            <label>Họ và tên *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nhập họ tên của bạn" required />
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Nhập số điện thoại" required />
          </div>
          <div className="form-group">
            <label>Địa chỉ nhận hàng *</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã...)" required rows="3"></textarea>
          </div>
          <div className="form-group">
            <label>Ghi chú đơn hàng (Tùy chọn)</label>
            <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Ví dụ: Giao ngoài giờ hành chính..." rows="2"></textarea>
          </div>
        </div>

        {/* --- CỘT PHẢI: ĐƠN HÀNG & THANH TOÁN --- */}
        <div className="checkout-summary-section">
          <h3>Đơn hàng của bạn</h3>
          
          <div className="summary-items">
            {safeCart.map((item, index) => (
              <div key={index} className="summary-item">
                <span className="item-name">{item.name} <b>x{item.amount || item.quantity || 1}</b></span>
                <span className="item-price">{(item.price * (item.amount || item.quantity || 1)).toLocaleString()}đ</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-line">
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div className="total-line">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString()}đ`}</span>
            </div>
            <div className="total-line final">
              <span>Tổng cộng:</span>
              <span className="final-price">{finalPrice.toLocaleString()}đ</span>
            </div>
          </div>

          {/* --- CHỌN PHƯƠNG THỨC THANH TOÁN --- */}
          <h3 style={{ marginTop: '30px' }}>Phương thức thanh toán</h3>
          <div className="payment-methods">
            <label className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>💵 Thanh toán khi nhận hàng (COD)</span>
            </label>
            
            <label className={`payment-option ${paymentMethod === 'BANKING' ? 'active' : ''}`}>
              <input type="radio" name="payment" value="BANKING" checked={paymentMethod === 'BANKING'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>💳 Chuyển khoản ngân hàng (Quét mã QR)</span>
            </label>
          </div>

          {/* HIỂN THỊ MÃ QR NẾU CHỌN CHUYỂN KHOẢN */}
          {paymentMethod === 'BANKING' && (
            <div className="qr-code-box">
              <p className="qr-guide">Mở App Ngân hàng để quét mã</p>
              <img src={qrCodeUrl} alt="QR Code Thanh Toán" className="qr-image" />
              <p className="qr-note">Số tiền: <b>{finalPrice.toLocaleString()}đ</b></p>
              <p className="qr-note">Nội dung CK: <b>Thanh toan don hang AgriMarket</b></p>
            </div>
          )}

          <button type="submit" className="place-order-btn">
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
