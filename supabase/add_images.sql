-- Añade array de imágenes adicionales por producto
-- Ejecuta en Supabase Dashboard → SQL Editor → New query → Run

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
