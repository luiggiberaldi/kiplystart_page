-- Rename tiktok_url column to video_url in products table
ALTER TABLE products RENAME COLUMN tiktok_url TO video_url;

COMMENT ON COLUMN products.video_url IS 'URL of the product video (WebM/MP4) to embed on the product page';
