-- Apply once to enable category thumbnail URLs and descriptions.
ALTER TABLE categories
    ADD COLUMN hinh_anh TEXT NULL,
    ADD COLUMN mo_ta TEXT NULL;
