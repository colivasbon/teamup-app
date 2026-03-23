# TeamUp - App de Deporte Social

## 📱 Descripción
Plataforma para encontrar y crear eventos deportivos con personas cercanas.

## 🔗 URLs
- **Producción:** https://teamup-app-alpha.vercel.app
- **GitHub:** https://github.com/colivasbon/teamup-app
- **Supabase:** https://kbhidlhdpjcpazkubcvq.supabase.co

## 🛠️ Stack
- Next.js 16.2.1 (App Router)
- TailwindCSS v4 (tema oscuro glassmorphism)
- Supabase (backend + DB)
- Vercel (hosting)

## 📁 Estructura
```
teamup-app/
├── src/
│   ├── app/
│   │   ├── auth/page.js         # Login + Registro (Google Auth)
│   │   ├── create/page.js       # Crear evento (3 pasos)
│   │   ├── events/page.js       # Lista eventos con filtros
│   │   ├── events/[id]/page.js  # Detalle evento + chat
│   │   ├── moments/page.js      # Feed de momentos (tipo IG)
│   │   ├── profile/page.js      # Perfil usuario + valoraciones
│   │   ├── page.js              # Homepage
│   │   ├── layout.js            # Layout principal + theme toggle
│   │   └── globals.css          # Glassmorphism + variables CSS
│   └── components/
│       └── Navbar.js            # Navbar con iconos SVG
├── supabase-setup.sql            # Esquema base de datos
└── .env.local                    # Variables de entorno
```

## 🎨 Diseño v2
- Glassmorphism: cards con backdrop-blur, borders translúcidos
- Paleta: índigo-violeta + teal accent, sobre fondo #07091a
- Mesh gradient background con orbs de color
- Tipografía Inter con jerarquía clara
- Iconos SVG propios en navbar (sin emojis)
- Animaciones fadeInUp con delays escalonados
- Logo SVG personalizado
- Mobile-first (iPhone 14: 390px)

## ✅ Funcionalidades Implementadas
1. ✅ Homepage con deportes + eventos preview
2. ✅ Lista de eventos con 3 filtros (provincia, deporte, nivel)
3. ✅ Detalle de evento con chat, participantes, 3er tiempo
4. ✅ Crear evento en 3 pasos (wizard)
5. ✅ Login/Registro (email + Google, listo para Supabase Auth)
6. ✅ Perfil de usuario con karma, stats, eventos, valoraciones
7. ✅ Feed de momentos tipo Instagram (likes, comentarios)
8. ✅ Toggle tema oscuro/claro/sistema
9. ✅ Navbar con iconos SVG propios
10. ✅ Filtro por provincia (50 provincias españolas)

## 🚧 Pendiente
1. Conectar Supabase Auth (reemplazar demo handlers)
2. CRUD completo de eventos en DB real
3. Sistema real de unirse a eventos
4. Chat en tiempo real (Supabase Realtime)
5. Upload de fotos en Momentos
6. Push notifications
7. Matchmaker de niveles

## 👤 Usuario
- Carlos (Telegram: 388310382)
- Exec sin aprobaciones (security: full)
