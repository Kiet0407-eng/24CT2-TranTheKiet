# Dự án Quản lý Cửa hàng Nông sản (AgriMarket)

## Sơ đồ Cơ sở dữ liệu (Database ERD)
Dưới đây là sơ đồ thực thể liên kết (ERD) của cơ sở dữ liệu `nongsan_db` thể hiện cấu trúc các bảng:

```mermaid
erDiagram
    USERS {
        int id PK
        string ho_ten
        string email
        string mat_khau
        string vai_tro
    }
    CATEGORIES {
        int id PK
        string ten_danh_muc
        string hinh_anh
    }
    PRODUCTS {
        int id PK
        string ten_san_pham
        int category_id FK
        float gia_ban
    }
    ORDERS {
        int id PK
        int user_id FK
        string ho_ten
        string so_dien_thoai
        string trang_thai
    }
    ORDER_DETAILS {
        int order_id FK
        int product_id FK
        int so_luong
        float don_gia
    }

    USERS ||--o{ ORDERS : "đặt hàng"
    CATEGORIES ||--|{ PRODUCTS : "phân loại"
    ORDERS ||--|{ ORDER_DETAILS : "bao gồm chi tiết"
    PRODUCTS ||--o{ ORDER_DETAILS : "nằm trong"
```

## Sơ đồ Kiến trúc Hệ thống (System Architecture)
Sơ đồ dưới đây thể hiện luồng giao tiếp từ Giao diện người dùng (Frontend) kết nối qua API (Backend) để tương tác trực tiếp xuống Cơ sở dữ liệu `nongsan_db`:

```mermaid
graph TD
    User((Người dùng)) -- Tương tác --> FE
    
    subgraph Tầng Giao diện (Frontend)
        FE[ReactJS App\n(Giao diện Web: Đăng nhập, Đặt hàng...)]
    end
    
    subgraph Tầng Xử lý (Backend)
        BE[Node.js & Express\n(Xử lý Logic, Authentication & Routing)]
    end
    
    subgraph Tầng Dữ liệu (Database)
        DB[(MySQL Database\n'nongsan_db')]
    end

    FE -- "Gửi HTTP/API Request\n(fetch dữ liệu từ localhost:5000)" --> BE
    BE -- "Thực thi truy vấn SQL\n(SELECT, INSERT, UPDATE, DELETE)" --> DB
    DB -. "Trả kết quả truy vấn" .-> BE
    BE -. "Trả dữ liệu JSON" .-> FE
```