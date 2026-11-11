-- JD / EDITIONS V8.8. Eseguire UNA VOLTA nel SQL Editor di Supabase.
-- Non altera le tabelle già create per il libro.
BEGIN;
CREATE TABLE IF NOT EXISTS public.jd_categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 slug text NOT NULL UNIQUE,
 description text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
 position integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.jd_products (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 category_id uuid NOT NULL REFERENCES public.jd_categories(id) ON DELETE RESTRICT,
 title text NOT NULL,
 description text NOT NULL DEFAULT '',
 cover_image text,
 price_eur numeric(10,2) CHECK(price_eur IS NULL OR price_eur>=0),
 stock integer NOT NULL DEFAULT 0 CHECK(stock>=0),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
 position integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.jd_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jd_products ENABLE ROW LEVEL SECURITY;
-- Restrizione a un solo editor verificata dall'UID di Supabase Auth.
DROP POLICY IF EXISTS jd_categories_editor ON public.jd_categories;
CREATE POLICY jd_categories_editor ON public.jd_categories FOR ALL TO authenticated
 USING ((select auth.uid()) = 'feb9c40c-75ff-41fc-a92d-47f670d5d0ce'::uuid)
 WITH CHECK ((select auth.uid()) = 'feb9c40c-75ff-41fc-a92d-47f670d5d0ce'::uuid);
DROP POLICY IF EXISTS jd_categories_public ON public.jd_categories;
CREATE POLICY jd_categories_public ON public.jd_categories FOR SELECT TO anon,authenticated USING(status='published');
DROP POLICY IF EXISTS jd_products_editor ON public.jd_products;
CREATE POLICY jd_products_editor ON public.jd_products FOR ALL TO authenticated
 USING ((select auth.uid()) = 'feb9c40c-75ff-41fc-a92d-47f670d5d0ce'::uuid)
 WITH CHECK ((select auth.uid()) = 'feb9c40c-75ff-41fc-a92d-47f670d5d0ce'::uuid);
DROP POLICY IF EXISTS jd_products_public ON public.jd_products;
CREATE POLICY jd_products_public ON public.jd_products FOR SELECT TO anon,authenticated
 USING(status='published' AND stock>0 AND EXISTS (
 SELECT 1 FROM public.jd_categories c WHERE c.id=category_id AND c.status='published'));
COMMIT;
-- Nessun prodotto demo inserito: Editions resterà invisibile fino alla prima pubblicazione.

-- Consente solo a Jacopo di vedere l'elenco dei file nell'editor (Storage list).
DROP POLICY IF EXISTS jd_media_owner_select ON storage.objects;
CREATE POLICY jd_media_owner_select ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='jd-public-media' AND (select auth.uid())='feb9c40c-75ff-41fc-a92d-47f670d5d0ce'::uuid);
