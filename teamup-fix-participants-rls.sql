-- ============================================================
-- TeamUp — Fix RLS event_participants + profiles trigger
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Reconstruir RLS de event_participants ─────────────
-- El problema: la policy de INSERT requería estar ya apuntado
-- para poder apuntarse, lo que bloqueaba el primer insert del creador.

ALTER TABLE public.event_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Borrar todas las políticas existentes
DROP POLICY IF EXISTS "Participantes leen"              ON public.event_participants;
DROP POLICY IF EXISTS "Usuarios se apuntan"             ON public.event_participants;
DROP POLICY IF EXISTS "Usuarios se desapuntan"          ON public.event_participants;
DROP POLICY IF EXISTS "event_participants_select"       ON public.event_participants;
DROP POLICY IF EXISTS "event_participants_insert"       ON public.event_participants;
DROP POLICY IF EXISTS "event_participants_delete"       ON public.event_participants;

-- SELECT: cualquiera puede ver quién participa en un evento
CREATE POLICY "ep_select_all"
  ON public.event_participants FOR SELECT
  USING (true);

-- INSERT: cualquier usuario autenticado puede apuntarse a sí mismo
CREATE POLICY "ep_insert_self"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- DELETE: cada usuario puede desapuntarse a sí mismo
CREATE POLICY "ep_delete_self"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 2. Trigger para crear perfil automáticamente ─────────
-- Cuando un usuario se registra, Supabase crea el auth.user
-- pero NO crea el perfil en public.profiles salvo que haya un trigger.
-- Esto causa que los joins devuelvan vacío.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ', '')),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 3. Crear perfiles para usuarios existentes que no lo tienen ──
-- Ejecuta esto para reparar usuarios ya registrados sin perfil
INSERT INTO public.profiles (id, full_name, username, created_at)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  LOWER(REPLACE(COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)), ' ', '')),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- ─── FIN ─────────────────────────────────────────────────
-- Cambios:
-- · event_participants: INSERT libre para usuarios autenticados
-- · profiles: trigger automático al registrarse
-- · profiles: rellenados para usuarios sin perfil existentes
