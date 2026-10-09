-- Apply once to enable product image URLs in the Admin product form.
ALTER TABLE products
  ADD COLUMN hinh_anh TEXT NULL;
