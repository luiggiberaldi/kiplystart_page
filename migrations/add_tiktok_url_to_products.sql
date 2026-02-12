-- Add tiktok_url column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS tiktok_url TEXT;

COMMENT ON COLUMN products.tiktok_url IS 'URL of the TikTok video to embed on the product page';
