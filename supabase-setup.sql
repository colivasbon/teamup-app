-- Tabla de usuarios
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  sports TEXT[], -- Array de deportes favoritos
  level TEXT, -- principiante, intermedio, avanzado
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de eventos
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id),
  sport TEXT NOT NULL,
  level TEXT DEFAULT 'any', -- any, beginner, intermediate, advanced
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  province TEXT NOT NULL, -- Provincia para evitar duplicados de ubicación
  third_place BOOLEAN DEFAULT FALSE,
  third_place_link TEXT,
  lat FLOAT,
  lng FLOAT,
  max_people INT DEFAULT 10,
  waiting_list INT DEFAULT 0, -- Plazas en lista de espera
  current_people INT DEFAULT 1,
  status TEXT DEFAULT 'open', -- open, full, cancelled, completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de participantes
CREATE TABLE event_participants (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Tabla de mensajes del chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (todo el mundo puede leer, solo usuarios autenticados pueden escribir)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Creator can update own events" ON events FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Participants are viewable by everyone" ON event_participants FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join events" ON event_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Messages are viewable by everyone" ON messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');