# TeamUp - App de Deporte Social

## 📱 Descripción
Plataforma para encontrar y crear eventos deportivos con personas cercanas.

## 🔗 URLs
- **Producción:** https://teamup-app-alpha.vercel.app
- **GitHub:** https://github.com/colivasbon/teamup-app
- **Supabase:** https://kbhidlhdpjcpazkubcvq.supabase.co

## 🛠️ Stack
- Next.js 16.2.1 (App Router)
- TailwindCSS (tema oscuro)
- Supabase (backend + DB)
- Vercel (hosting)

## 📁 Estructura
```
teamup-app/
├── src/
│   ├── app/
│   │   ├── create/page.js    # Crear evento
│   │   ├── events/page.js    # Lista eventos
│   │   ├── page.js           # Homepage
│   │   ├── layout.js         # Layout principal + theme toggle
│   │   └── globals.css       # Estilos + variables CSS
│   └── components/
│       └── Navbar.js         # Navegación
├── supabase-setup.sql        # Esquema de base de datos
└── .env.local                # Variables de entorno
```

## 🗄️ Base de Datos (Supabase)

### Tablas
- **profiles** - Usuarios (username, full_name, avatar, sports, level)
- **events** - Eventos (sport, title, description, date, time, location, province, level, third_place, max_people, waiting_list, status)
- **event_participants** - Relación usuario-evento
- **messages** - Chat del evento

### Columnas de Events
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| creator_id | UUID | Creador del evento |
| sport | TEXT | Deporte (running, padel, etc.) |
| level | TEXT | Nivel (any, beginner, intermediate, advanced) |
| title | TEXT | Título del evento |
| description | TEXT | Descripción |
| date | DATE | Fecha |
| time | TIME | Hora |
| location | TEXT | Ubicación |
| province | TEXT | Provincia (para evitar duplicados) |
| third_place | BOOLEAN | Tiene tercer tiempo |
| third_place_link | TEXT | Link Google Maps |
| max_people | INT | Máximo participantes |
| waiting_list | INT | Plazas en lista de espera |
| current_people | INT | Participantes actuales |
| status | TEXT | Estado (open, full, cancelled, completed) |

## ✅ Funcionalidades Implementadas
1. ✅ Homepage con deportes
2. ✅ Lista de eventos con filtros
3. ✅ Crear evento (deporte, título, descripción, fecha, hora, ubicación)
4. ✅ Filtro por provincia (50 provincias españolas)
5. ✅ Filtro por nivel (principiante, intermedio, avanzado)
6. ✅ Lista de espera
7. ✅ Tercer tiempo (checkbox + link)
8. ✅ Toggle tema (oscuro/claro/sistema)
9. ✅ Tema oscuro por defecto
10. ✅ Navegación inferior

## 🚧 Pendiente
1. Autenticación usuarios (Supabase Auth)
2. CRUD completo de eventos en DB
3. Sistema de unirse a eventos
4. Chat por evento
5. Perfil de usuario
6. Matchmaker de niveles
7. Sistema de karma/resñas
8. Feed de momentos

## 🎨 Diseño
- Tema oscuro por defecto
- Gradientes en iconos de deportes
- Cards con sombras
- Navegación fija inferior
- Botón flotante para tema
- Responsive (mobile-first)

## 👤 Usuario
- Carlos (Telegram: 388310382)
- Exec sin aprobaciones (security: full)
