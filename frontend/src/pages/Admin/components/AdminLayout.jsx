import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiList, FiShoppingCart, FiUsers, FiLogOut, FiMenu, FiChevronLeft } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { path: '/admin', name: 'Tổng quan', icon: <FiHome /> },
    { path: '/admin/products', name: 'Nông sản', icon: <FiBox /> },
    { path: '/admin/categories', name: 'Danh mục', icon: <FiList /> },
    { path: '/admin/orders', name: 'Đơn hàng', icon: <FiShoppingCart /> },
    { path: '/admin/users', name: 'Khách hàng', icon: <FiUsers /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar bên trái */}
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? <FiMenu /> : <FiChevronLeft />}
        </button>
        <div className="sidebar-header">
          <h2>Agri<span>Admin</span></h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="sidebar-label">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> <span className="sidebar-label">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Nội dung chính bên phải */}
      <main className="main-content">
        <header className="top-header">
          <div className="admin-profile">
            <img src="https://ui-avatars.com/api/?name=Admin&background=2e7d32&color=fff" alt="Admin" />
            <span>Quản trị viên</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
