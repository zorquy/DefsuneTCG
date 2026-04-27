-- Añade campos de enlace externo a productos
-- Ejecuta en Supabase Dashboard → SQL Editor → New query → Run

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS wallapop_url TEXT,
  ADD COLUMN IF NOT EXISTS vinted_url   TEXT;
