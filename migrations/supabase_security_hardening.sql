-- ====================================================================
-- KIPLYSTART SECURITY HARDENING & RLS POLICIES MIGRATION
-- ====================================================================
-- Description:
-- Secures database tables against unauthorized read/write access.
-- Prevents PII leakage of customer names, phones, CIs, and addresses.
-- Only allows public insertions for legitimate COD orders.
-- Admin portal operations require authentication.
-- ====================================================================

BEGIN;

-- 1. Enable RLS across all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cart_events ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 2. PRODUCTS POLICIES
-- ====================================================================
-- Anyone can view active products in catalog/store
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products" ON products
  FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Only authenticated users (Admin) can insert, update, delete products
DROP POLICY IF EXISTS "Public insert access" ON products;
DROP POLICY IF EXISTS "Admin insert products" ON products;
CREATE POLICY "Admin insert products" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access" ON products;
DROP POLICY IF EXISTS "Admin update products" ON products;
CREATE POLICY "Admin update products" ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete access" ON products;
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- ====================================================================
-- 3. ORDERS POLICIES (PROTECT CUSTOMER PII)
-- ====================================================================
-- Public can ONLY insert new orders from checkout (with valid data)
DROP POLICY IF EXISTS "Public read orders" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Public update orders" ON orders;
DROP POLICY IF EXISTS "Public delete orders" ON orders;

CREATE POLICY "Public insert orders with required fields" ON orders
  FOR INSERT
  TO public
  WITH CHECK (
    user_name IS NOT NULL AND 
    user_phone IS NOT NULL AND
    delivery_address IS NOT NULL
  );

-- Only authenticated users (Admin) can read orders (protecting customer PII)
DROP POLICY IF EXISTS "Admin read orders" ON orders;
CREATE POLICY "Admin read orders" ON orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users (Admin) can update or delete orders
DROP POLICY IF EXISTS "Admin update orders" ON orders;
CREATE POLICY "Admin update orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete orders" ON orders;
CREATE POLICY "Admin delete orders" ON orders
  FOR DELETE
  TO authenticated
  USING (true);

-- ====================================================================
-- 4. ACTIVITY LOG & SETTINGS POLICIES
-- ====================================================================
-- Settings: Public can read business settings (e.g. rate mode), admin can update
DROP POLICY IF EXISTS "Public read settings" ON settings;
CREATE POLICY "Public read settings" ON settings
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admin update settings" ON settings;
CREATE POLICY "Admin update settings" ON settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Activity Log: Restricted to authenticated admins
DROP POLICY IF EXISTS "Enable read access for all users" ON activity_log;
DROP POLICY IF EXISTS "Enable insert access for all users" ON activity_log;
DROP POLICY IF EXISTS "Admin activity log select" ON activity_log;
DROP POLICY IF EXISTS "Admin activity log insert" ON activity_log;

CREATE POLICY "Admin activity log select" ON activity_log
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin activity log insert" ON activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Analytics & Tracking: Public can insert page views and cart events
DROP POLICY IF EXISTS "Public insert page_views" ON page_views;
CREATE POLICY "Public insert page_views" ON page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read page_views" ON page_views;
CREATE POLICY "Admin read page_views" ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Public insert cart_events" ON cart_events;
CREATE POLICY "Public insert cart_events" ON cart_events
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read cart_events" ON cart_events;
CREATE POLICY "Admin read cart_events" ON cart_events
  FOR SELECT
  TO authenticated
  USING (true);

COMMIT;
