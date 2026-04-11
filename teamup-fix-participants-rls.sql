-- ============================================================
-- TeamUp — Fix definitivo: status + RLS + events + profiles
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Unificar status: 'confirmed' → 'joined' ──────────
-- Los registros históricos tienen 'confirmed' pero el código
-- espera 'joined'. Lo normalizamos todo.
UPDATE public.event_participants
  SET status = 'joined'
  WHERE status = 'confirmed' OR status IS NULL;

ALTER TABLE public.event_participants
  ALTER COLUMN status SET DEFAULT 'joined';

-- ─── 2. Events — policies limpias ────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_all"         ON public.events;
DROP POLICY IF EXISTS "events_insert_auth"        ON public.events;
DROP POLICY IF EXISTS "events_update_owner"       ON public.events;
DROP POLICY IF EXISTS "events_delete_owner"       ON public.events;
DROP POLICY IF EXISTS "Eventos públicos"          ON public.events;
DROP POLICY IF EXISTS "Usuarios crean eventos"    ON public.events;
DROP POLICY IF EXISTS "Creador edita evento"      ON public.events;
DROP POLICY IF EXISTS "Creador borra evento"      ON public.events;

CREATE POLICY "events_select_all"
  ON public.events FOR SELECT USING (true);

CREATE POLICY "events_insert_auth"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "events_update_owner"
  ON public.events FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "events_delete_owner"
  ON public.events FOR DELETE
  USING (auth.uid() = creator_id);

-- ─── 3. Event_participants — policies limpias ─────────────
ALTER TABLE public.event_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies
           WHERE schemaname='public' AND tablename='event_participants'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.event_participants';
  END LOOP;
END $$;

CREATE POLICY "ep_select_all"
  ON public.event_participants FOR SELECT USING (true);

CREATE POLICY "ep_insert_self"
  ON public.event_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ep_delete_self"
  ON public.event_participants FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 4. Profiles — lectura pública garantizada ───────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies
           WHERE schemaname='public' AND tablename='profiles'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
  END LOOP;
END $$;

CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── 5. Trigger para crear perfil al registrarse ─────────
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 6. Perfiles para usuarios existentes sin perfil ─────
INSERT INTO public.profiles (id, full_name, username, created_at)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  LOWER(REPLACE(COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)), ' ', '')),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- ─── 7. Apuntar creadores de eventos existentes ───────────
-- Para los eventos que ya existen y cuyo creador no está apuntado
INSERT INTO public.event_participants (event_id, user_id, status)
SELECT e.id, e.creator_id, 'joined'
FROM public.events e
LEFT JOIN public.event_participants ep
  ON ep.event_id = e.id AND ep.user_id = e.creator_id
WHERE ep.id IS NULL
  AND e.creator_id IS NOT NULL;

-- ─── FIN ─────────────────────────────────────────────────
-- El paso 7 apunta retroactivamente a todos los creadores
-- de eventos existentes que no estaban como participantes.
