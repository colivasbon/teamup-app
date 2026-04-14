-- ============================================================
-- TeamUp — Fix RLS moment_comments
-- Los comentarios no se mostraban porque faltaba la policy
-- de lectura pública en la tabla moment_comments
-- ============================================================

-- Habilitar RLS si no está habilitado
ALTER TABLE moment_comments ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de comentarios (igual que moments y moment_likes)
DROP POLICY IF EXISTS "moment_comments_public_read" ON moment_comments;
CREATE POLICY "moment_comments_public_read" ON moment_comments
  FOR SELECT USING (true);

-- Permitir insertar comentarios a usuarios autenticados
DROP POLICY IF EXISTS "moment_comments_auth_insert" ON moment_comments;
CREATE POLICY "moment_comments_auth_insert" ON moment_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir borrar solo los comentarios propios
DROP POLICY IF EXISTS "moment_comments_own_delete" ON moment_comments;
CREATE POLICY "moment_comments_own_delete" ON moment_comments
  FOR DELETE USING (auth.uid() = user_id);
