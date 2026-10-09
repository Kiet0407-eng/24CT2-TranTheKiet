import React, { useState, useEffect } from 'react';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders');
      if (!response.ok) throw new Error('Không thể tải danh sách đơn hàng');
      const data = await response.json();
      setOrders(data);
      setError('');
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      setError(error.message || 'Không thể kết nối máy chủ');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Không thể cập nhật trạng thái');
      alert(result.message || `Đã cập nhật trạng thái đơn hàng #${orderId}`);
      await fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      setError(error.message || 'Không thể kết nối máy chủ');
    }
  };

  const getStatusBadge = (status) => {
    let bgColor = '#95a5a6';
    if (status === 'Chờ duyệt') bgColor = '#f39c12';
    if (status === 'Đang giao') bgColor = '#3498db';
    if (status === 'Đã giao') bgColor = '#2ecc71';
    if (status === 'Đã hủy') bgColor = '#e74c3c';
    
    return <span className="status-badge" style={{ backgroundColor: bgColor }}>{status}</span>;
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Quản lý Đơn hàng</h1>
      </div>
      {error && <p role="alert" style={{ color: '#c0392b' }}>{error}</p>}
      
      <div className="admin-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>{order.ho_ten}</td>
                <td>
                  <div>{order.so_dien_thoai}</div>
                  <small style={{ color: '#7f8c8d' }}>{order.dia_chi}</small>
                </td>
                <td className="text-danger font-bold">{Number(order.tong_tien).toLocaleString()}đ</td>
                <td>{order.phuong_thuc_tt}</td>
                <td>{getStatusBadge(order.trang_thai)}</td>
                <td>
                  <select 
                    className="status-select"
                    value={order.trang_thai} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
