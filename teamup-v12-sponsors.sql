-- ============================================================
-- TeamUp v12 — Tabla de patrocinadores
-- ============================================================

-- 1. Crear tabla sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  logo_url    text,          -- URL pública en Supabase Storage (sponsors/)
  website_url text,          -- Enlace destino al hacer click
  active      boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,  -- Orden en el carrusel
  created_at  timestamptz DEFAULT now()
);

-- 2. RLS: solo admins pueden escribir, cualquiera puede leer los activos
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sponsors_public_read" ON sponsors
  FOR SELECT USING (active = true);

-- Para insertar/editar desde el dashboard de Supabase usa el service_role key.
-- Si quieres gestión desde la app (solo tú), descomenta:
-- CREATE POLICY "sponsors_admin_write" ON sponsors
--   FOR ALL USING (auth.uid() = 'TU_USER_ID_AQUI');

-- 3. Insertar patrocinadores de ejemplo (sin logo, solo texto)
-- Puedes editarlos desde el dashboard de Supabase (Table Editor → sponsors)
INSERT INTO sponsors (name, logo_url, website_url, active, sort_order) VALUES
  ('PATROCINADOR 1', null, 'https://example.com', true, 1),
  ('PATROCINADOR 2', null, 'https://example.com', true, 2),
  ('PATROCINADOR 3', null, 'https://example.com', true, 3)
ON CONFLICT DO NOTHING;
