import React, { useState, useEffect } from 'react'; // Thêm useEffect
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FiChevronDown, FiChevronUp, FiStar, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../store/CartContext';
import './Shop.css';

// XÓA dòng import { products } từ '../../data' đi vì ta sẽ dùng data từ MySQL

const Shop = () => {
  const { addToCart } = useCart();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('search')?.trim().toLocaleLowerCase() || '';
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  // 1. TẠO STATE ĐỂ LƯU SẢN PHẨM TỪ CƠ SỞ DỮ LIỆU MYSQL
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  // 2. GỌI API BẰNG USEEFFECT NGAY KHI TRANG VỪA LOAD
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/products');
        const data = await response.json();
        
        // Vì CSDL dùng tên cột tiếng Việt (ten_sp, gia_ban...) 
        // Nên ta cần map (ánh xạ) lại cho khớp với biến giao diện cũ của bạn (name, price...)
        const mappedProducts = data.map(item => ({
          id: item.id,
          categoryId: item.category_id ?? item.danh_muc_id ?? null,
          name: item.ten_sp,
          price: Number(item.gia_ban),
          image: item.hinh_anh || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80", // Ảnh mặc định nếu CSDL chưa có
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Lỗi khi kết nối API:", error);
      }
    };

    fetchProducts();
  }, []); // Mảng rỗng [] giúp API chỉ gọi đúng 1 lần khi mở trang

  // --- CẤU HÌNH DANH MỤC ---
  // Logic lọc sản phẩm (Vẫn giữ nguyên logic cũ của bạn)
  let filteredProducts = category === "All" 
    ? [...products] 
    : products.filter(product => Number(product.categoryId) === Number(category));

  if (searchKeyword) {
    filteredProducts = filteredProducts.filter((product) =>
      String(product.name || product.ten_sp || '').toLocaleLowerCase().includes(searchKeyword)
    );
  }

  // Logic sắp xếp sản phẩm (Vẫn giữ nguyên logic cũ của bạn)
  if (sortOrder === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const currentCategoryName = category === 'All'
    ? 'Tất cả'
    : categories.find(item => Number(item.id) === Number(category))?.ten_danh_muc;

  return (
    <div className="shop-container">
      {/* Banner phụ */}
      <div className="shop-banner">
        <h1>Cửa Hàng Nông Sản</h1>
        <p>Trang chủ / Cửa hàng</p>
      </div>

      <div className="shop-content">
        {/* --- SIDEBAR (MENU TRÁI) --- */}
        <div className="sidebar">
          <h3 
            className="sidebar-title" 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            Danh mục
            <span className="toggle-icon">
              {isCategoryOpen ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          </h3>
          
          <div className={`category-list-wrapper ${isCategoryOpen ? 'open' : ''}`}>
            <ul className="category-list">
              <li
                className={category === 'All' ? "active" : ""}
                onClick={() => setCategory('All')}
              >
                Tất cả
              </li>
              {categories.map((categoryItem) => (
                <li 
                  key={categoryItem.id}
                  className={Number(category) === Number(categoryItem.id) ? "active" : ""} 
                  onClick={() => setCategory(categoryItem.id)}
                >
                  {categoryItem.ten_danh_muc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- DANH SÁCH SẢN PHẨM --- */}
        <div className="product-list-container">
            <div className="list-header">
              <h2 className="cat-title">{currentCategoryName}</h2>
              <div className="sort-container">
                <label htmlFor="sort">Sắp xếp theo: </label>
                <select 
                  id="sort" 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="modern-product-card">
                      <div className="card-badges">
                        <span className="badge-discount">-15%</span>
                      </div>
                      
                      <Link to={`/product/${product.id}`} className="card-img-link">
                        <img src={product.image} alt={product.name} />
                        <div className="qr-badge">
                          <QRCodeSVG value={`${window.location.origin}/product/${product.id}`} size={42} title={`Mã QR truy xuất ${product.name}`} />
                        </div>
                      </Link>
                      
                      <div className="card-body">
                        <div className="card-category">{categories.find(item => Number(item.id) === Number(product.categoryId))?.ten_danh_muc || 'Chưa phân loại'}</div>
                        <div className="card-rating">
                          <FiStar className="star-icon filled" />
                          <FiStar className="star-icon filled" />
                          <FiStar className="star-icon filled" />
                          <FiStar className="star-icon filled" />
                          <FiStar className="star-icon filled" />
                          <span>(4.5)</span>
                        </div>
                        
                        <Link to={`/product/${product.id}`} className="card-title">
                          {product.name}
                        </Link>
                        
                        <div className="card-price-row">
                          <div className="price-info">
                            <span className="current-price">{product.price.toLocaleString()}đ</span>
                            <span className="old-price">{(product.price * 1.15).toLocaleString()}đ</span>
                          </div>
                          <button 
                            className="btn-add-cart-icon"
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            title="Thêm vào giỏ"
                          >
                            <FiShoppingBag />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: '40px', color: '#666', background: '#f9f9f9', borderRadius: '12px'}}>
                <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty" style={{width: '100px', opacity: 0.5, marginBottom: '20px'}} />
                <p style={{fontSize: '18px', marginBottom: '15px'}}>Không tìm thấy sản phẩm nào trong CSDL.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
