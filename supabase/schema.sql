-- ============================================================
-- DEFSUNETCG — Supabase Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL,
  price         NUMERIC(10,2) NOT NULL,
  category      TEXT        NOT NULL CHECK (category IN ('singles', 'gradeadas_pcg', 'gradeadas_psa', 'packs')),
  image_url     TEXT,
  description   TEXT,
  certification TEXT        CHECK (certification IN ('PSA', 'Beckett', 'CGC') OR certification IS NULL),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  date       DATE        NOT NULL,
  location   TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events   ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "products_public_read"
  ON public.products FOR SELECT USING (true);

CREATE POLICY "events_public_read"
  ON public.events FOR SELECT USING (true);

-- Authenticated write (only logged-in admin)
CREATE POLICY "products_auth_insert"
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "products_auth_update"
  ON public.products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "products_auth_delete"
  ON public.products FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "events_auth_insert"
  ON public.events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "events_auth_update"
  ON public.events FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "events_auth_delete"
  ON public.events FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for product images
-- ============================================================
-- Run this separately in Supabase Dashboard > Storage > New bucket
-- Bucket name: product-images
-- Public bucket: YES
--
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT DO NOTHING;

CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "product_images_auth_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ============================================================
-- Sample data (optional — delete before production)
-- ============================================================
-- INSERT INTO public.products (name, price, category) VALUES
--   ('Charizard Base Set', 299.99, 'singles'),
--   ('Lugia Neo Genesis PCG Grade 9', 599.00, 'gradeadas_pcg'),
--   ('Pikachu Illustrator PSA 10', 4999.00, 'gradeadas_psa'),
--   ('Lote 50 cartas vintage', 49.99, 'packs');

-- INSERT INTO public.events (name, date, location) VALUES
--   ('Card Show Madrid', '2026-05-15', 'IFEMA, Madrid'),
--   ('TCG Open Barcelona', '2026-06-07', 'Fira Barcelona, Barcelona');
