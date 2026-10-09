import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Chatbox from './components/UI/Chatbox';
import ScrollToTop from './components/UI/ScrollToTop';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Contact from './pages/Contact/Contact';
import Support from './pages/Support/Support';
import Voucher from './pages/Voucher/Voucher';
import NotificationPage from './pages/Notification/NotificationPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/User/Profile';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifyOtp from './pages/Auth/VerifyOtp';
import ResetPassword from './pages/Auth/ResetPassword';
import Shop from './pages/Shop/Shop';
import OrderHistory from './pages/Orders/OrderHistory';
import Messages from './pages/Messages/Messages';

import AdminLayout from './pages/Admin/components/AdminLayout';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import AdminProducts from './pages/Admin/Products/AdminProducts';
import AdminOrders from './pages/Admin/Orders/AdminOrders';
import AdminLogin from './pages/Admin/Auth/AdminLogin';
import AdminCategories from './pages/Admin/Categories/AdminCategories';

function UserLayout() {
  return (
    <div className="App">
      <Header />
      <main style={{ minHeight: '80vh', backgroundColor: '#f5f5f5', paddingBottom: '20px' }}>
        <Outlet />
      </main>
      <Footer />
      <Chatbox />
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/voucher" element={<Voucher />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
