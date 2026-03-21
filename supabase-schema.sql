-- ============================================
-- PTRCRM Supabase Schema
-- Paste this entire file into the Supabase SQL Editor and click "Run"
-- ============================================

-- 1. CUSTOMERS
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  channel TEXT DEFAULT 'Trade Show',
  joined DATE DEFAULT CURRENT_DATE,
  total_spent NUMERIC DEFAULT 0,
  orders INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  tank_size TEXT,
  notes TEXT,
  last_contact DATE DEFAULT CURRENT_DATE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVENTORY (products)
CREATE TABLE inventory (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  price NUMERIC DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  stock_qty INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SALES
CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT,
  product TEXT,
  product_id BIGINT REFERENCES inventory(id) ON DELETE SET NULL,
  amount NUMERIC DEFAULT 0,
  channel TEXT,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAMPAIGNS
CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Draft',
  segment TEXT,
  sent INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  clicked INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROMOTIONS
CREATE TABLE promotions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  end_date TEXT,
  code TEXT,
  channel TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEED DATA (your existing mock data)
-- ============================================

-- Seed customers
INSERT INTO customers (name, email, phone, channel, joined, total_spent, orders, tags, tank_size, notes, last_contact, location) VALUES
  ('Marcus Rivera', 'marcus@email.com', '555-0101', 'TikTok', '2025-01-15', 847, 4, '["SPS Coral", "LED Lights"]', '120gal', 'Loves acropora frags, watches every TikTok live', '2025-03-01', 'Austin, TX'),
  ('Priya Nair', 'priya@email.com', '555-0202', 'Trade Show', '2024-11-03', 1240, 7, '["LPS Coral", "Nano Tank"]', '30gal', 'Regular at Austin Reef Club shows. Interested in frag swaps.', '2025-02-20', 'Houston, TX'),
  ('Derek Hollis', 'derek@email.com', '555-0303', 'Shopify', '2025-02-01', 390, 2, '["LED Lights", "New Customer"]', '75gal', 'First purchase was Kessil A360. Follow up on upgrade path.', '2025-02-01', 'Dallas, TX'),
  ('Yuki Tanaka', 'yuki@email.com', '555-0404', 'Instagram', '2024-09-22', 2100, 11, '["SPS Coral", "High-End Lights", "VIP"]', '200gal', 'Top spender. Reef tank influencer with 12k followers. Send new arrivals first.', '2025-03-05', 'San Antonio, TX'),
  ('Carlos Mendez', 'carlos@email.com', '555-0505', 'Home Store', '2025-01-28', 560, 3, '["Soft Coral", "Beginner"]', '55gal', 'Local pickup customer. New to reefing, very curious — loves in-person advice.', '2025-01-30', 'Local');

-- Seed inventory
INSERT INTO inventory (name, sku, category, price, cost, stock_qty, description) VALUES
  ('SPS Pack 1 — Beginner', 'SPS-PK-001', 'SPS Coral', 299, 120, 8, 'Starter SPS pack with 5 hardy acropora frags'),
  ('SPS Pack 3 — Advanced', 'SPS-PK-003', 'SPS Coral', 520, 210, 4, 'Premium SPS pack with rare acropora colonies'),
  ('WYSIWYG Acropora Colony', 'WYSIWYG-AC-001', 'SPS Coral', 380, 150, 2, 'What you see is what you get — hand-selected acropora colony'),
  ('ReefBreeders Photon V2+', 'RB-PV2-001', 'LED Lights', 399, 280, 12, 'Full spectrum LED for reef tanks up to 48 inches'),
  ('Collector Pack — Beginner', 'COL-BEG-001', 'Soft Coral', 95, 40, 15, 'Mixed soft coral pack perfect for beginners'),
  ('Kessil A360X Tuna Blue', 'KES-A360-001', 'LED Lights', 449, 320, 6, 'Premium pendant LED with shimmer effect'),
  ('Zoanthid Garden Pack', 'ZOA-GP-001', 'Soft Coral', 149, 60, 10, '10-piece zoanthid frag garden pack'),
  ('ReefBreeders Meridian', 'RB-MER-001', 'LED Lights', 599, 420, 3, 'Top-tier full spectrum LED panel for SPS-dominant tanks');

-- Seed sales
INSERT INTO sales (customer_name, product, amount, channel, date, category) VALUES
  ('Yuki Tanaka', 'SPS Pack 1', 1200, 'Shopify', '2025-03-05', 'SPS Coral'),
  ('Marcus Rivera', 'WYSIWYG Acropora Colony', 380, 'TikTok', '2025-03-01', 'SPS Coral'),
  ('Priya Nair', 'SPS Pack 3', 520, 'Trade Show', '2025-02-20', 'SPS Coral'),
  ('Derek Hollis', 'ReefBreeders Photon V2+', 399, 'Shopify', '2025-02-01', 'LED Lights'),
  ('Carlos Mendez', 'Collector Pack — Beginner', 95, 'Home Store', '2025-01-30', 'Soft Coral');

-- Seed campaigns
INSERT INTO campaigns (name, status, segment, sent, opened, clicked, date) VALUES
  ('New WYSIWYG Drop', 'Active', 'SPS Coral buyers', 48, 31, 14, '2025-03-01'),
  ('TikTok Live — SPS Pack Flash Sale', 'Draft', 'TikTok customers', 0, 0, 0, '2025-03-10'),
  ('ReefBreeders Meridian In Stock', 'Sent', 'LED Light buyers', 72, 45, 22, '2025-02-15');

-- Seed promotions
INSERT INTO promotions (title, description, start_date, end_date, code, channel) VALUES
  ('Free Shipping — Orders $399+', 'Auto-applies at checkout on pootangreefs.com. Remind email list customers before Live Sales.', 'Ongoing', 'Ongoing', 'Auto', 'Shopify'),
  ('TikTok Live Flash Sale — SPS Packs', 'Exclusive pricing during live stream. DM to claim. First come first served — mention pack # in chat.', 'Mar 12', 'Mar 12', 'LIVE10', 'TikTok'),
  ('WYSIWYG Early Access for Email Subscribers', 'Email list gets 24hr early access before new WYSIWYG pieces go live on site.', 'Ongoing', 'Ongoing', 'Email Only', 'Email List'),
  ('Trade Show Loyalty — 5th Show Reward', 'Visit 5 shows, get a free frag. Track via customer notes field in CRM.', 'Ongoing', 'Ongoing', 'In-Person', 'Trade Show');

-- ============================================
-- DISABLE RLS for demo (allows anon key full access)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON promotions FOR ALL USING (true) WITH CHECK (true);
