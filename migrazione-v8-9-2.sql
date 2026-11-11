-- JD Studio V8.9.2 — supporto editoriale italiano / inglese
-- Preserva tutti i testi, i capitoli, le immagini e i prodotti esistenti.
BEGIN;
ALTER TABLE public.jd_chapters ADD COLUMN IF NOT EXISTS title_en text;
ALTER TABLE public.jd_chapters ADD COLUMN IF NOT EXISTS subtitle_en text;
ALTER TABLE public.jd_categories ADD COLUMN IF NOT EXISTS name_en text;
ALTER TABLE public.jd_categories ADD COLUMN IF NOT EXISTS description_en text;
ALTER TABLE public.jd_products ADD COLUMN IF NOT EXISTS title_en text;
ALTER TABLE public.jd_products ADD COLUMN IF NOT EXISTS description_en text;
-- Per i blocchi pagina, text_en / caption_en sono salvati nel JSONB content esistente.
-- Non è necessario modificare la tabella jd_blocks.
COMMIT;
