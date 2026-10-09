-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 09, 2026 lúc 03:01 AM
-- Phiên bản máy phục vụ: 11.2.5-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nongsan_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `ten_danh_muc` varchar(100) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `ten_danh_muc`, `hinh_anh`, `mo_ta`) VALUES
(3, 'Rau củ', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300', NULL),
(4, 'Thịt tươi sống', NULL, NULL),
(5, 'Trái cây', NULL, NULL),
(6, 'Đồ uống', NULL, NULL),
(7, 'Thực phẩm khô', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `trang_thai` enum('Chưa xử lý','Đang xử lý','Đã đóng') DEFAULT 'Chưa xử lý',
  `ngay_gui` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `noi_dung` text NOT NULL,
  `thoi_gian_gui` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `da_doc` tinyint(1) DEFAULT 0,
  `ngay_gui` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `ngay_dat` timestamp NOT NULL DEFAULT current_timestamp(),
  `tong_tien` decimal(15,2) NOT NULL,
  `trang_thai` enum('Chờ duyệt','Đang giao','Đã giao','Đã hủy') DEFAULT 'Chờ duyệt'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_details`
--

CREATE TABLE `order_details` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `don_gia` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `ten_sp` varchar(255) NOT NULL,
  `gia_ban` decimal(15,2) NOT NULL,
  `so_luong_ton` int(11) DEFAULT 0,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` enum('Còn hàng','Hết hàng') DEFAULT 'Còn hàng',
  `hinh_anh` varchar(255) DEFAULT NULL,
  `danh_muc_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `category_id`, `ten_sp`, `gia_ban`, `so_luong_ton`, `mo_ta`, `trang_thai`, `hinh_anh`, `danh_muc_id`) VALUES
(1, 3, 'rau salad', 10000.00, 12, '', 'Còn hàng', 'https://cdn.yeutre.vn/medias/uploads/228/228861-rau-salad-xa-lach.jpg', NULL),
(2, 4, 'Đùi gà tỏi 3F', 65400.00, 5, 'Đặc Điểm:\n\nGồm 3-4 đùi gà tỏi chất lượng\nGiàu protein, ít mỡ\nChứa nhiều khoáng chất, tốt cho tim mạch và hệ miễn dịch\nThịt dai, mềm ngọt tự nhiên, dễ dàng chế biến thành nhiều món khác nhau.\nĐùi Gà Tỏi 3F (500g) lấy từ phần đùi tỏi của những con gà khỏe mạnh, truy suất nguồn gốc rõ ràng. Gà được nuôi dưỡng trong nông trại khép kín và sử dụng thức ăn chất lượng cao. Nhờ đó, thịt đùi có vị ngọt mềm tự nhiên, đảm bảo đem đến nguồn dinh dưỡng tốt nhất dành cho bạn. Sau khi trải qua quá trình chế biến trên dây chuyền công nghệ hiện đại, phần đùi tỏi sẽ được đóng gói trong bao bì cẩn thận, đẹp mắt để đến với tay người tiêu dùng. Sản phẩm gồm 3-4 đùi gà tỏi, đủ để phục vụ cho một bữa cơm gia đình trọn vẹn.\n\nThông tin dinh dưỡng:\n\nThịt gà là nguồn cung cấp protein dồi dào. Đặc biệt, phần đùi tỏi có chứa ít chất béo, là phần thịt săn chắc nhất của con gà.\nHàm lượng axit amin tryptophan có trong gà khá cao. Đây là chất có tác dụng làm tăng nồng độ serotonin trong não, giúp giảm stress, gạt bỏ căng thẳng.\nTrong thịt gà chứa nhiều canxi và vi chất, giúp cải thiện các bệnh về xương khớp, giảm thiểu nỗi lo tuổi già.\nĐùi gà tỏi là thực phẩm rất giàu photpho, có lợi cho răng miệng, thận, gan và hệ thần kinh.\nĂn thịt gà còn giúp ngăn ngừa hàm lượng chất homocysteine, đem đến cho bạn một trái tim khỏe mạnh.\nSelenium là một khoáng chất được tìm thấy nhiều trong thịt gà có tác dụng cải thiện quá trình trao đổi chất, cải thiện hệ miễn dịch.\nHướng dẫn sử dụng: Rã đông trước khi sử dụng, phù hợp cho các món chiên, nướng, xào, hấp,...\n\nHướng dẫn bảo quản: Bảo quản trong ngăn đá tủ lạnh, trước khi sử dụng bạn nên đặt xuống ngăn mát để rã đông từ từ, đảm bảo giữ dinh dưỡng và hương vị của thịt.', 'Còn hàng', 'https://cdn.tgdd.vn/Products/Images/8790/226876/bhx/dui-toi-ga-khay-500g-4-6-dui-202111261915313915.jpg', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `vai_tro` enum('Khách hàng','Admin','Nhân viên') NOT NULL DEFAULT 'Khách hàng',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `ho_ten`, `email`, `mat_khau`, `so_dien_thoai`, `vai_tro`, `ngay_tao`) VALUES
(6, 'Khách hàng', 'khach@gmail.com', '$2b$10$TfcVmRdvZ535dlqlO1CqtunvSrV.c4U0RyTh4JVPqySVDqmaEvqhq', NULL, 'Khách hàng', '2026-10-01 05:49:26'),
(7, 'Trần Thế Kiệt', 'kiet31544@gmail.com', '$2b$10$TfcVmRdvZ535dlqlO1CqtunvSrV.c4U0RyTh4JVPqySVDqmaEvqhq', NULL, 'Admin', '2026-10-01 06:18:39'),
(8, 'kiet2-10', 'thekiettran74@gmail.com', '$2b$10$frFlY/1bifGxrkh3lSyE.uYV4GFC6WJ3yYD7D/RR.rTpEKMan4Tc.', NULL, 'Khách hàng', '2026-10-02 03:46:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `ma_code` varchar(50) NOT NULL,
  `phan_tram_giam` int(11) NOT NULL,
  `so_luong_con` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_receiver` (`receiver_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_voucher_id` (`voucher_id`);

--
-- Chỉ mục cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category_id` (`category_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_code` (`ma_code`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
