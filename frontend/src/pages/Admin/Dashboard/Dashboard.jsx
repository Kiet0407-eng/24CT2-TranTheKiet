import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiShoppingBag, FiBox } from 'react-icons/fi';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api/admin';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/products`),
        ]);

        if (!ordersResponse.ok || !productsResponse.ok) {
          throw new Error('Không thể tải dữ liệu tổng quan');
        }

        const [ordersData, productsData] = await Promise.all([
          ordersResponse.json(),
          productsResponse.json(),
        ]);

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setError('');
      } catch (requestError) {
        setError(requestError.message || 'Không thể kết nối máy chủ');
      }
    };

    fetchDashboardData();
  }, []);

  const revenue = orders.reduce((total, order) => total + (Number(order.tong_tien) || 0), 0);
  const stats = [
    { title: 'Tổng đơn hàng', value: orders.length.toLocaleString(), icon: <FiShoppingBag />, color: '#3498db' },
    { title: 'Tổng sản phẩm', value: products.length.toLocaleString(), icon: <FiBox />, color: '#9b59b6' },
    { title: 'Tổng giá trị đơn hàng', value: `${revenue.toLocaleString()}₫`, icon: <FiTrendingUp />, color: '#2ecc71' },
  ];

  return (
    <div className="dashboard-container">
      <h1 style={{ marginBottom: '20px', color: '#2c3e50' }}>Tổng quan hệ thống</h1>
      {error && <p role="alert" style={{ color: '#c0392b' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {stats.map((stat) => (
          <div key={stat.title} style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            borderLeft: `5px solid ${stat.color}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>
                  {stat.title}
                </p>
                <h3 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>{stat.value}</h3>
              </div>
              <div style={{ fontSize: '30px', color: stat.color, opacity: 0.8 }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
