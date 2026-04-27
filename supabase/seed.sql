-- ============================================================
-- DEFSUNETCG — Datos de ejemplo
-- Pega esto en Supabase Dashboard → SQL Editor → New query → Run
-- Puedes borrar estos datos después desde el panel /admin
-- ============================================================

-- Singles
INSERT INTO public.products (name, price, category, image_url) VALUES
  ('Charizard Holo Base Set 1ª Edición',   850.00, 'singles', 'https://images.pokemontcg.io/base1/4_hires.png'),
  ('Blastoise Holo Base Set',              195.00, 'singles', 'https://images.pokemontcg.io/base1/2_hires.png'),
  ('Venusaur Holo Base Set',               165.00, 'singles', 'https://images.pokemontcg.io/base1/15_hires.png'),
  ('Mewtwo Holo Base Set',                  85.00, 'singles', 'https://images.pokemontcg.io/base1/10_hires.png'),
  ('Pikachu Base Set Shadowless',           95.00, 'singles', 'https://images.pokemontcg.io/base1/58_hires.png'),
  ('Gengar Holo Fossil',                   110.00, 'singles', 'https://images.pokemontcg.io/fossil/5_hires.png'),
  ('Umbreon Gold Star EX Unseen Forces',   420.00, 'singles', NULL),
  ('Rayquaza EX Delta Species',            260.00, 'singles', NULL);

-- Gradeadas PCG
INSERT INTO public.products (name, price, category, image_url) VALUES
  ('Charizard XY Evolutions Holo — PCG 10', 430.00, 'gradeadas_pcg', 'https://images.pokemontcg.io/xy12/11_hires.png'),
  ('Lugia Neo Genesis Holo — PCG 9',         540.00, 'gradeadas_pcg', 'https://images.pokemontcg.io/neo1/9_hires.png'),
  ('Mewtwo Base Set Holo — PCG 8.5',         290.00, 'gradeadas_pcg', 'https://images.pokemontcg.io/base1/10_hires.png'),
  ('Pikachu VMAX Rainbow — PCG 9.5',          78.00, 'gradeadas_pcg', 'https://images.pokemontcg.io/swsh45/188_hires.png');

-- Gradeadas PSA / Beckett / CGC
INSERT INTO public.products (name, price, category, image_url, certification) VALUES
  ('Charizard Holo Base Set — PSA 8',       1350.00, 'gradeadas_psa', 'https://images.pokemontcg.io/base1/4_hires.png',  'PSA'),
  ('Lugia Neo Genesis Holo — PSA 9',        2950.00, 'gradeadas_psa', 'https://images.pokemontcg.io/neo1/9_hires.png',   'PSA'),
  ('Pikachu Illustrator — PSA 7',           4500.00, 'gradeadas_psa', NULL,                                               'PSA'),
  ('Blastoise Base Set — Beckett 9',         975.00, 'gradeadas_psa', 'https://images.pokemontcg.io/base1/2_hires.png',  'Beckett'),
  ('Gengar 1ª Ed. Fossil — CGC 8.5',         860.00, 'gradeadas_psa', 'https://images.pokemontcg.io/fossil/5_hires.png', 'CGC');

-- Packs / Lotes
INSERT INTO public.products (name, price, category, image_url, description) VALUES
  ('Lote Vintage — Base Set · Jungle · Fossil',
   49.99, 'packs', NULL,
   '100 cartas vintage de las tres primeras expansiones. Mínimo 5 raras, algunas en primera edición. Estado LP-MP.'),
  ('Pack Premium Legendarios',
   89.99, 'packs', NULL,
   '30 cartas seleccionadas a mano: Pokémon legendarios y semelegendarios. Incluye holográficas y EX. Estado Near Mint.'),
  ('Lote Sun & Moon Completo',
   34.99, 'packs', NULL,
   '60 cartas de la era Sun & Moon de varios sets. Ideal para completar colecciones o jugar.'),
  ('Mega Lote 200 Cartas Mixtas',
   74.99, 'packs', NULL,
   '200 cartas de diferentes eras: Vintage, EX, Diamond & Pearl, BW, XY y Sun & Moon. El pack perfecto para empezar.');

-- Eventos
INSERT INTO public.events (name, date, location) VALUES
  ('Card Show Madrid — Spring Edition', '2026-05-17', 'Palacio de los Deportes, Madrid'),
  ('TCG Open Barcelona',                '2026-06-14', 'Fira Barcelona, Montjuïc'),
  ('Feria del Coleccionismo Valencia',  '2026-07-05', 'Ciudad de las Artes y las Ciencias, Valencia');
