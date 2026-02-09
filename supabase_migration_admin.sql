-- KiplyStart Enhanced Admin Portal Migration
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. Update products table with new fields
-- =====================================================

-- Add new columns to existing products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS bundle_2_discount INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS bundle_3_discount INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS additional_images TEXT[],
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS allow_backorders BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. Create orders table (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Cliente
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_ci TEXT,
  
  -- Producto
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  quantity INTEGER,
  bundle_type INTEGER, -- 1, 2, o 3
  
  -- Precio
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  
  -- Envío
  delivery_address TEXT,
  city TEXT,
  state TEXT,
  
  -- Estado
  status TEXT DEFAULT 'pending_whatsapp', 
  -- Valores: pending_whatsapp | confirmed | shipped | delivered | cancelled
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Create trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. Add indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- =====================================================
-- 4. Update RLS Policies (still public read for now)
-- =====================================================

-- Products: Public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON products;
CREATE POLICY "Public read access" ON products
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public insert access" ON products;
CREATE POLICY "Public insert access" ON products
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON products;
CREATE POLICY "Public update access" ON products
  FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public delete access" ON products;
CREATE POLICY "Public delete access" ON products
  FOR DELETE
  USING (true);

-- Orders: Public insert (from COD form), read for admin
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read orders" ON orders;
CREATE POLICY "Public read orders" ON orders
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update orders" ON orders;
CREATE POLICY "Public update orders" ON orders
  FOR UPDATE
  USING (true);

-- =====================================================
-- 5. Helper function: Auto-generate SKU
-- =====================================================

CREATE OR REPLACE FUNCTION generate_sku()
RETURNS TEXT AS $$
DECLARE
  new_sku TEXT;
BEGIN
  -- Generate SKU: KP-XXXXXX (KiplyStart + 6 random chars)
  new_sku := 'KP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  RETURN new_sku;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Success Message
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! ✅';
  RAISE NOTICE 'Products table updated with advanced fields.';
  RAISE NOTICE 'Orders table created for COD tracking.';
END $$;
