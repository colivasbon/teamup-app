# TeamUp — Documentación Técnica Completa

> **Versión:** v12 | **Última actualización:** 2025 | **Estado:** Producción

---

## Tabla de contenidos

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Servicios externos](#3-servicios-externos)
4. [Workflow de desarrollo](#4-workflow-de-desarrollo)
5. [Estructura de archivos](#5-estructura-de-archivos)
6. [Sistema de diseño (CSS)](#6-sistema-de-diseño-css)
7. [Base de datos — Tablas Supabase](#7-base-de-datos--tablas-supabase)
8. [RLS (Row Level Security)](#8-rls-row-level-security)
9. [Triggers en Supabase](#9-triggers-en-supabase)
10. [Archivos SQL del proyecto](#10-archivos-sql-del-proyecto)
11. [Deportes soportados](#11-deportes-soportados)
12. [Generador de pósters y QR](#12-generador-de-pósters-y-qr)
13. [Sistema de patrocinadores](#13-sistema-de-patrocinadores)
14. [Insignias de participación (perfil)](#14-insignias-de-participación-perfil)
15. [Variables de entorno](#15-variables-de-entorno)
16. [Comandos útiles](#16-comandos-útiles)
17. [Pendiente para v13](#17-pendiente-para-v13)

---

## 1. Descripción del proyecto

**TeamUp** es una aplicación social deportiva orientada al mercado español. Su propósito principal es facilitar la creación y la adhesión a eventos deportivos locales entre usuarios cercanos.

### Características principales

- Los usuarios pueden **crear** eventos deportivos locales con todos los detalles relevantes (deporte, nivel, ubicación, fecha, precio, aforo máximo, etc.).
- Otros usuarios pueden **unirse** a esos eventos, participar en el chat en tiempo real y compartir momentos fotográficos.
- La experiencia social incluye un **sistema de karma**, **insignias de participación** e interacciones tipo red social (likes, comentarios).
- Existe un **sistema de patrocinadores** con carrusel animado en la página principal.

### Plataformas

| Plataforma | Descripción |
|------------|-------------|
| Web | Next.js 14, desplegado en Vercel |
| Android | PWA (Progressive Web App) |
| iOS | PWA (Progressive Web App) |

### Principios de diseño

- **Mobile-first**: la interfaz está diseñada prioritariamente para dispositivos móviles.
- **Max-width 480px**: todo el contenido está centrado y limitado a 480 px de ancho para emular una app nativa.
- **Sin frameworks CSS**: CSS puro con variables personalizadas, sin Tailwind ni similares.

---

## 2. Stack tecnológico

### Frontend

| Tecnología | Versión / Detalle |
|------------|-------------------|
| **Next.js** | 14, App Router |
| **React** | Incluido con Next.js 14 |
| **CSS** | Puro (sin Tailwind ni CSS-in-JS) |
| **Canvas API** | Nativa del navegador (generación de pósters y QR) |

### Backend y base de datos

| Tecnología | Detalle |
|------------|---------|
| **Supabase** | PostgreSQL, Auth, Storage, Row Level Security (RLS) |

### Despliegue e infraestructura

| Servicio | Detalle |
|----------|---------|
| **Vercel** | Auto-deploy desde GitHub en cada push a `main` |
| **GitHub** | Control de versiones, repositorio en https://github.com/colivasbon/teamup-app |
| **GitHub Desktop** | Flujo del desarrollador (sin CLI) |

### Librerías y dependencias destacadas

| Librería | Propósito |
|----------|-----------|
| **qrcode** (npm) | Generación de códigos QR en el cliente |
| **Leaflet** | Mapas interactivos sobre OpenStreetMap |
| **ReportLab** (Python) | Generación de PDF para especificaciones de patrocinadores |

### URLs del proyecto

| Entorno | URL |
|---------|-----|
| Producción | https://teamup-app-alpha.vercel.app |
| Repositorio | https://github.com/colivasbon/teamup-app |

---

## 3. Servicios externos

### Supabase

- **URL del proyecto:** `https://kbhidlhdpjcpazkubcvq.supabase.co`

#### Autenticación

TeamUp utiliza Supabase Auth con los siguientes proveedores habilitados:

| Método | Descripción |
|--------|-------------|
| **Google OAuth** | Login con cuenta de Google |
| **Apple OAuth** | Login con cuenta de Apple ID |
| **Email/Contraseña** | Registro e inicio de sesión clásico |
| **Recuperar contraseña** | Flujo de reset via email |

#### Storage buckets

| Bucket | Contenido |
|--------|-----------|
| `sponsors/` | Logos PNG de patrocinadores (monocromo, fondo transparente) |
| `avatars/` | Fotos de perfil de usuarios |
| `banners/` | Imágenes de banner de perfil |
| `moments/` | Fotos adjuntas a momentos sociales |

#### Credenciales

```
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiaGlkbGhkcGpjcGF6a3ViY3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTc0NDEsImV4cCI6MjA4OTc3MzQ0MX0.GiYgTOHpc9gWUK7IG2G9piog_R9ONrfxR7dzjvD58vQ
```

> **Nota técnica:** las credenciales de Supabase (`supabaseUrl` y `anonKey`) están **hardcodeadas** en `src/lib/supabase.js`. Esta es una **decisión deliberada** para evitar el error `"supabaseUrl is required"` durante el build de Vercel, que en ciertas configuraciones no inyecta las variables de entorno antes de la compilación.

### Vercel

- Conectado al repositorio de GitHub mediante integración nativa.
- Cada push a la rama `main` desencadena un auto-deploy automático.
- No requiere configuración adicional de variables de entorno (ver [sección 15](#15-variables-de-entorno)).

### GitHub

- **Repositorio:** https://github.com/colivasbon/teamup-app
- Flujo de trabajo con **GitHub Desktop** (sin uso de CLI git).
- Rama principal: `main`.

---

## 4. Workflow de desarrollo

El flujo de trabajo está diseñado para un entorno donde el agente edita los archivos del proyecto y el desarrollador los integra en el repositorio.

```
┌─────────────────────────────────────────────────────┐
│  1. Agente edita archivos en                        │
│     /home/user/workspace/teamup-app/                │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  2. Verificación de build                           │
│     npm run build                                   │
│     (detecta errores de compilación antes de        │
│      subir al repositorio)                          │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  3. Empaquetado                                     │
│     ZIP del proyecto excluyendo:                    │
│     - .next/                                        │
│     - node_modules/                                 │
│     - .git/                                         │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  4. El usuario descarga el ZIP                      │
│     → Copia los archivos al repositorio local       │
│     → Commit en GitHub Desktop                      │
│     → Push a main                                   │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  5. Vercel detecta el push y auto-deploya           │
│     https://teamup-app-alpha.vercel.app             │
└─────────────────────────────────────────────────────┘
```

---

## 5. Estructura de archivos

```
teamup-app/
├── src/
│   ├── app/
│   │   ├── globals.css                 — CSS global, sistema de diseño, variables CSS,
│   │   │                                 animaciones, temas claro/oscuro
│   │   ├── layout.js                   — Shell principal: slogan bar, AuthProvider,
│   │   │                                 OnboardingModal
│   │   ├── page.js                     — Home: stats, deportes, eventos cercanos,
│   │   │                                 carrusel de patrocinadores
│   │   ├── auth/
│   │   │   └── page.js                 — Login: Google OAuth, Apple OAuth,
│   │   │                                 email/contraseña, recuperar contraseña
│   │   ├── create/
│   │   │   └── page.js                 — Crear evento: flujo en 3 pasos
│   │   │                                 (deporte → detalles → confirmar),
│   │   │                                 campos dinámicos por deporte
│   │   ├── events/
│   │   │   ├── page.js                 — Explorar eventos: filtros, búsqueda,
│   │   │   │                             lista de eventos, botón Unirse
│   │   │   └── [id]/
│   │   │       ├── page.js             — Ficha del evento: mapa OSM (Leaflet),
│   │   │       │                         chat en tiempo real, momentos,
│   │   │       │                         parámetro ?tab=, generador póster/QR
│   │   │       ├── edit/               — Editar y cancelar evento
│   │   │       └── karma/              — Sistema de karma: votar a participantes
│   │   ├── moments/
│   │   │   └── page.js                 — Feed social: fotos, likes, comentarios,
│   │   │                                 contador en tiempo real
│   │   ├── notifications/
│   │   │   └── page.js                 — Notificaciones: toggle Eventos / Social
│   │   └── profile/
│   │       ├── page.js                 — Perfil propio: banner, stats, pestañas,
│   │       │                             insignias, configuración de notificaciones
│   │       └── [id]/
│   │           └── page.js             — Perfil público de otro usuario
│   ├── components/
│   │   ├── Navbar.js                   — Navbar fijo en la parte inferior, 5 tabs,
│   │   │                                 badge de notificaciones no leídas
│   │   ├── NotifBadge.js               — Punto rojo sobre el icono de perfil
│   │   ├── ThemeButton.js              — Toggle modo oscuro / modo claro
│   │   ├── SportIcon.js                — Emojis de deporte con selector de tono de piel
│   │   ├── OnboardingModal.js          — Modal inicial: ciudad + deportes favoritos
│   │   └── PosterModal.js              — Generador de QR y póster con Canvas API
│   ├── lib/
│   │   └── supabase.js                 — Cliente Supabase con credenciales hardcodeadas
│   └── contexts/
│       └── AuthContext.js              — Context global: user, profile, signOut
├── public/                             — Assets estáticos
├── teamup-v10.2.sql
├── teamup-v10.3-triggers.sql
├── teamup-v10.4-notif-participants.sql
├── teamup-v10.5-skin-tone.sql
├── teamup-v11.sql
├── teamup-v12.sql
├── teamup-v12-sponsors.sql
├── teamup-v12-fix-notif-duplicates.sql
├── teamup-v12-fix-comments-rls.sql
├── package.json
└── next.config.js
```

---

## 6. Sistema de diseño (CSS)

### Paleta de colores

| Variable | Valor | Uso |
|----------|-------|-----|
| `--primary` | `#586875` | Azul principal, botones, acentos |
| `--bg` (light) | `#f6eddc` | Fondo modo claro (crema) |
| `--bg` (dark) | `#1a2028` | Fondo modo oscuro |

### Variables CSS globales

```css
:root {
  --bg:       /* fondo principal */
  --text:     /* texto principal */
  --muted:    /* texto secundario/atenuado */
  --border:   /* bordes y separadores */
  --surface:  /* superficies de tarjetas */
  --primary:  /* color de marca (#586875) */
  --grad:     /* gradiente de marca */
}
```

### Tipografía

- **Fuente principal:** `system-ui, -apple-system` (fuente del sistema operativo del dispositivo)
- Sin carga de fuentes externas, para máxima velocidad y coherencia con la plataforma

### Clases de layout principales

| Clase | Descripción |
|-------|-------------|
| `.page-wrap` | Contenedor principal: `max-width: 480px`, `padding: 0 18px`, `padding-bottom: 88px` |
| `.page-wrap-full` | Igual que `.page-wrap` pero sin padding lateral (para elementos que ocupan todo el ancho) |

### Navbar

```css
position: fixed;
bottom: 0;
z-index: 100;
height: ~72px;
```

- 5 tabs: Inicio, Explorar, Crear, Momentos, Perfil
- Badge de notificaciones no leídas sobre el icono correspondiente

### Slogan bar

- Elemento en el flujo normal del documento (no `fixed`)
- Aparece en la parte superior de la página
- Desaparece naturalmente al hacer scroll hacia abajo

### Carrusel de patrocinadores

- Ubicado en `page.js`, debajo del botón "Crear evento"
- Carga dinámica desde la tabla `sponsors` de Supabase
- Repite la secuencia completa 10 veces para simular loop infinito: `1, 2, 3, 1, 2, 3, …`
- Filtro CSS adaptable al tema:

| Tema | Filtro aplicado al logo |
|------|-------------------------|
| Oscuro | `brightness(10) opacity(0.35)` |
| Claro | `brightness(0) opacity(0.55)` |

---

## 7. Base de datos — Tablas Supabase

### `profiles`

Almacena la información pública y de configuración de cada usuario registrado.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK, FK → `auth.users` |
| `full_name` | `text` | Nombre completo |
| `username` | `text` | Nombre de usuario único |
| `bio` | `text` | Descripción personal |
| `avatar_url` | `text` | URL de la foto de perfil |
| `banner_color` | `text` | Color de fondo del banner (hex) |
| `banner_url` | `text` | URL de imagen del banner |
| `skin_tone` | `text` | Tono de piel para emojis: `'default'` \| `'light'` \| `'medium-light'` \| `'medium'` \| `'medium-dark'` \| `'dark'` |
| `location` | `text` | Ciudad del usuario |
| `sports` | `text[]` | Array de deportes favoritos |
| `karma` | `numeric` | Puntuación karma media del usuario |

---

### `events`

Almacena todos los eventos deportivos creados en la plataforma.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `title` | `text` | Título del evento |
| `description` | `text` | Descripción detallada |
| `sport` | `text` | Deporte (ver sección 11) |
| `location` | `text` | Ubicación/dirección |
| `date` | `date` | Fecha del evento |
| `time` | `time` | Hora de inicio |
| `max_players` | `int` | Número máximo de participantes |
| `price` | `text` | Precio o "Gratis" |
| `level` | `text` | Nivel requerido: `'any'` \| `'beginner'` \| `'intermediate'` \| `'advanced'` |
| `creator_id` | `uuid` | FK → `profiles.id` |
| `status` | `text` | `'active'` \| `'cancelled'` |
| `duration_minutes` | `int` | Duración estimada en minutos |
| `sport_details` | `jsonb` | Campos específicos por deporte (ver sección 11) |

---

### `event_participants`

Registra qué usuarios participan (o han participado) en qué eventos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `event_id` | `uuid` | FK → `events.id` |
| `user_id` | `uuid` | FK → `profiles.id` |
| `status` | `text` | `'joined'` \| `'left'` |
| `joined_at` | `timestamptz` | Timestamp de cuando se unió |

---

### `events_with_counts` (VIEW)

Vista materializada que une la tabla `events` con el conteo de participantes actuales (`status = 'joined'`). Usada en todas las listas de eventos para mostrar plazas disponibles sin consultas adicionales.

---

### `event_messages` (chat)

Mensajes del chat en tiempo real de cada evento.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `event_id` | `uuid` | FK → `events.id` |
| `user_id` | `uuid` | FK → `profiles.id` |
| `content` | `text` | Contenido del mensaje |
| `created_at` | `timestamptz` | Timestamp de creación |

---

### `moments`

Feed social de fotos y textos compartidos por los usuarios.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `profiles.id` |
| `event_id` | `uuid` | FK → `events.id` (opcional) |
| `text` | `text` | Texto del momento |
| `image_url` | `text` | URL de la foto (bucket `moments/`) |
| `sport` | `text` | Deporte relacionado |
| `province` | `text` | Provincia donde se publicó |
| `created_at` | `timestamptz` | Timestamp de creación |

---

### `moment_likes`

Registra los likes de los usuarios sobre los momentos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `moment_id` | `uuid` | FK → `moments.id` |
| `user_id` | `uuid` | FK → `profiles.id` |
| `created_at` | `timestamptz` | Timestamp del like |

---

### `moment_comments`

Comentarios de los usuarios sobre los momentos.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `moment_id` | `uuid` | FK → `moments.id` |
| `user_id` | `uuid` | FK → `profiles.id` |
| `text` | `text` | Contenido del comentario |
| `created_at` | `timestamptz` | Timestamp de creación |

---

### `notifications`

Centro de notificaciones de cada usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `profiles.id` |
| `type` | `text` | Tipo: `'joined'` \| `'left'` \| `'message'` \| `'event_new'` \| `'event_full'` \| `'karma'` \| `'like'` \| `'comment'` |
| `event_id` | `uuid` | FK → `events.id` (opcional) |
| `message` | `text` | Texto de la notificación |
| `priority` | `text` | `'high'` \| `'low'` |
| `read` | `boolean` | Si ha sido leída |
| `created_at` | `timestamptz` | Timestamp de creación |

---

### `karma_votes`

Votos de karma entre participantes de un mismo evento.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `voter_id` | `uuid` | FK → `profiles.id` (quien vota) |
| `voted_id` | `uuid` | FK → `profiles.id` (quien recibe el voto) |
| `event_id` | `uuid` | FK → `events.id` |
| `score` | `int` | Puntuación del 1 al 5 |
| `created_at` | `timestamptz` | Timestamp del voto |

---

### `sponsors`

Patrocinadores que aparecen en el carrusel de la página principal.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` | PK |
| `name` | `text` | Nombre del patrocinador |
| `logo_url` | `text` | URL pública del logo en bucket `sponsors/` |
| `website_url` | `text` | URL del sitio web del patrocinador |
| `active` | `boolean` | Si está activo y visible en el carrusel |
| `sort_order` | `int` | Orden de aparición en el carrusel |
| `created_at` | `timestamptz` | Timestamp de creación |

---

## 8. RLS (Row Level Security)

Todas las tablas tienen RLS habilitado en Supabase. A continuación se detallan las políticas por tabla:

| Tabla | Lectura | Escritura |
|-------|---------|-----------|
| `profiles` | Pública (cualquier usuario, incluso anónimo) | Solo el propio usuario (`auth.uid() = id`) |
| `events` | Pública | Solo el creador (`auth.uid() = creator_id`) |
| `event_participants` | Pública | INSERT y DELETE solo del propio usuario (`auth.uid() = user_id`) |
| `event_messages` | Pública | INSERT solo de usuarios autenticados |
| `moments` | Pública | INSERT y DELETE solo del propio usuario |
| `moment_likes` | Pública | INSERT y DELETE solo del propio usuario |
| `moment_comments` | Pública (SELECT sin restricción) | INSERT y DELETE solo del propio usuario |
| `notifications` | Solo del propio usuario | Solo del propio usuario |
| `sponsors` | Pública (solo donde `active = true`) | Solo vía `service_role` (no desde el cliente) |

> **Importante:** La corrección de las políticas RLS de `moment_comments` (SELECT público) fue introducida en `teamup-v12-fix-comments-rls.sql`.

---

## 9. Triggers en Supabase

### `notify_creator_on_join`

**Tipo:** Trigger en `event_participants` (INSERT / UPDATE)

**Comportamiento:**
- Se ejecuta cuando un registro tiene `status = 'joined'`
- Inserta una notificación de tipo `'joined'` en la tabla `notifications`, dirigida al creador del evento
- Incluye **cláusula anti-duplicados**: el mismo trigger no puede dispararse dos veces en menos de 5 minutos para el mismo evento y usuario

```sql
-- Pseudocódigo del trigger
IF NEW.status = 'joined' THEN
  -- Verificar que no existe una notificación similar en los últimos 5 minutos
  -- Insertar notificación al creator_id del evento
END IF;
```

---

### `create_event_reminders()` — Función programada

**Tipo:** Función SQL para uso con `pg_cron`

**Comportamiento:**
- Busca todos los eventos cuyo campo `date + time` esté entre **55 y 65 minutos** desde el momento de ejecución
- Inserta notificaciones de tipo `'event_new'` (recordatorio) a todos los participantes activos (`status = 'joined'`) de esos eventos

**Activación con pg_cron:**

```sql
SELECT cron.schedule(
  'teamup-recordatorios',
  '*/15 * * * *',
  $$SELECT create_event_reminders()$$
);
```

> **Requisito:** La extensión `pg_cron` debe estar habilitada en el proyecto de Supabase. Esta extensión requiere un plan de pago (Pro o superior).

---

### Triggers de likes y comentarios

Los triggers que generan notificaciones automáticas cuando un usuario recibe un like o un comentario en sus momentos se definen en **`teamup-v11.sql`**.

- **Like:** cuando se inserta en `moment_likes`, genera una notificación `type = 'like'` al autor del momento
- **Comentario:** cuando se inserta en `moment_comments`, genera una notificación `type = 'comment'` al autor del momento

---

## 10. Archivos SQL del proyecto

Todos los archivos SQL se encuentran en la **raíz del proyecto** (`teamup-app/`).

### Descripción de cada archivo

| Archivo | Contenido |
|---------|-----------|
| `teamup-v10.2.sql` | Tablas `karma_votes` y `event_messages`, mejoras en la tabla `profiles` |
| `teamup-v10.3-triggers.sql` | Triggers para notificaciones de participación |
| `teamup-v10.4-notif-participants.sql` | Notificaciones a participantes de eventos |
| `teamup-v10.5-skin-tone.sql` | Columna `skin_tone` en la tabla `profiles` |
| `teamup-v11.sql` | Tabla `moment_comments`, columna `priority` en `notifications`, columna `sport_details` en `events`, triggers de like y comentario |
| `teamup-v12.sql` | Tabla `sponsors`, función `create_event_reminders()`, trigger `on_participant_join` |
| `teamup-v12-sponsors.sql` | Tabla `sponsors` con RLS y datos de ejemplo |
| `teamup-v12-fix-notif-duplicates.sql` | Elimina triggers duplicados del evento "unirse a evento" |
| `teamup-v12-fix-comments-rls.sql` | Corrige la política RLS de `moment_comments` (SELECT público) |

### Orden de ejecución para instalación limpia

Para configurar la base de datos desde cero, ejecutar los archivos SQL en Supabase en el siguiente orden:

```
1. teamup-v10.2.sql
2. teamup-v10.3-triggers.sql
3. teamup-v10.4-notif-participants.sql
4. teamup-v10.5-skin-tone.sql
5. teamup-v11.sql
6. teamup-v12.sql
7. teamup-v12-sponsors.sql
8. teamup-v12-fix-notif-duplicates.sql
9. teamup-v12-fix-comments-rls.sql
```

> Ejecutar mediante el **SQL Editor** de Supabase Dashboard, en el orden indicado, para evitar dependencias rotas entre tablas y triggers.

---

## 11. Deportes soportados

TeamUp soporta los siguientes doce deportes, cada uno con su propia identidad visual y campos específicos en el formulario de creación de eventos.

| Deporte | Emoji | Campos específicos (`sport_details` jsonb) |
|---------|-------|---------------------------------------------|
| `running` | 🏃 | `pace` (ritmo por km, en min/km) |
| `padel` | 🎾 | `playtomic_score` (puntuación Playtomic), `has_spare_racket` (¿tienes pala de repuesto?) |
| `senderismo` | 🥾 | `difficulty` (dificultad), `distance_km` (distancia en km) |
| `futbol` | ⚽ | `format` (formato: 5, 7 u 11) |
| `gimnasio` | 🏋️ | `training_type` (tipo de entrenamiento) |
| `tenis` | 🎾 | — |
| `natacion` | 🏊 | `modality` (modalidad: piscina / aguas abiertas) |
| `ciclismo` | 🚴 | `distance_km` (distancia estimada en km), `elevation_m` (desnivel acumulado en metros) |
| `yoga` | 🧘 | `modality` (modalidad de yoga) |
| `baloncesto` | 🏀 | — |
| `voleibol` | 🏐 | — |
| `badminton` | 🏸 | — |

### Notas de implementación

- Cada deporte tiene un **color accent** propio utilizado en cabeceras, bordes de tarjetas y en el generador de pósters.
- El componente `SportIcon.js` renderiza el emoji del deporte con el **tono de piel** configurado por el usuario en su perfil (`skin_tone`).
- El formulario de creación de eventos (`create/page.js`) renderiza dinámicamente los campos de `sport_details` en función del deporte seleccionado en el paso 1 del flujo.

---

## 12. Generador de pósters y QR

Componente: **`src/components/PosterModal.js`**

Tecnologías utilizadas:
- **Canvas API** nativa del navegador
- Librería npm **`qrcode`** (`QRCode.toCanvas()`)

### URL del QR

El código QR apunta a la URL pública del evento:

```
https://teamup-app-alpha.vercel.app/events/{id}
```

### Modos de generación

#### Modo "Solo QR"

| Parámetro | Valor |
|-----------|-------|
| Dimensiones | 800 × 800 px (canvas cuadrado) |
| Estilos disponibles | Oscuro / Claro |
| Contenido | Borde con color accent del deporte, título del evento, URL |

#### Modo "Póster completo"

| Parámetro | Valor |
|-----------|-------|
| Dimensiones | 1080 × 1920 px (canvas vertical, formato story) |
| Estilos disponibles | Oscuro / Claro / Color |
| Contenido | Logo TEAM UP, icono del deporte, todos los datos del evento en tarjetas, QR incrustado |

### Notas técnicas

- El QR se genera con `QRCode.toCanvas()` **directamente sobre el canvas**, sin usar el objeto `Image()`. Esto evita restricciones CORS que impedirían la descarga del canvas como PNG.
- El poster se descarga como **archivo PNG** mediante un enlace `<a download>` generado programáticamente.
- El modal se abre desde la ficha del evento (`events/[id]/page.js`).

---

## 13. Sistema de patrocinadores

### Arquitectura

El sistema de patrocinadores está compuesto por:

1. **Tabla `sponsors`** en Supabase (ver [sección 7](#sponsors))
2. **Storage bucket `sponsors/`** para los logos
3. **Carrusel animado** en `page.js`

### Gestión de patrocinadores

Para añadir, editar o eliminar patrocinadores:

1. Acceder al **Supabase Dashboard** → **Table Editor** → tabla `sponsors`
2. Subir el logo PNG (monocromo, fondo transparente) al bucket `sponsors/` en **Storage**
3. Registrar la URL pública del logo en el campo `logo_url`
4. Ajustar `sort_order` para controlar el orden de aparición
5. Marcar `active = true` para que aparezca en el carrusel

### Especificaciones del logo

| Requisito | Detalle |
|-----------|---------|
| Formato | PNG |
| Fondo | Transparente |
| Estilo | Monocromo (el color lo aplica el filtro CSS) |

### Funcionamiento del carrusel

- Carga los patrocinadores activos (`active = true`) ordenados por `sort_order`
- Repite la secuencia completa **10 veces** para crear un bucle de scroll infinito
- Los logos con `website_url` definido son enlaces `<a target="_blank" rel="noopener">`
- El filtro CSS `--sponsor-filter` adapta el color del logo al tema activo:

```css
/* Modo oscuro */
--sponsor-filter: brightness(10) opacity(0.35);

/* Modo claro */
--sponsor-filter: brightness(0) opacity(0.55);
```

### Generación de PDF para patrocinadores

Para crear el dossier de especificaciones técnicas para patrocinadores (tamaños de logo, formatos, etc.) se usa **ReportLab** (Python). Este proceso es independiente de la aplicación web.

---

## 14. Insignias de participación (perfil)

Las insignias se calculan **en tiempo real** en la pestaña Karma del perfil propio (`profile/page.js`). No se almacenan en base de datos, sino que se derivan de las métricas del usuario.

| Insignia | Emoji | Condición |
|----------|-------|-----------|
| Primera vez | 🌟 | Haber participado en al menos 1 evento |
| Deportista | 🔥 | Haber participado en 5 o más eventos |
| Habitual | 📈 | Haber participado en 10 o más eventos |
| Organizador | 🏆 | Haber creado al menos 1 evento |
| Polideportivo | 🧘 | Haber practicado 3 o más deportes distintos |
| Buena reputación | ⭐ | Karma ≥ 4.5 |

### Lógica de cálculo

```
insignias = []

SI eventos_participados >= 1  → añadir "Primera vez"
SI eventos_participados >= 5  → añadir "Deportista"
SI eventos_participados >= 10 → añadir "Habitual"
SI eventos_creados >= 1       → añadir "Organizador"
SI deportes_distintos >= 3    → añadir "Polideportivo"
SI karma >= 4.5               → añadir "Buena reputación"
```

---

## 15. Variables de entorno

**TeamUp no utiliza variables de entorno (`.env`).**

Las credenciales de Supabase están hardcodeadas directamente en `src/lib/supabase.js`:

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kbhidlhdpjcpazkubcvq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Justificación técnica

Esta decisión es **deliberada** por las siguientes razones:

1. **Error de Vercel:** En determinadas configuraciones, Vercel no inyecta las variables de entorno definidas en `.env.local` durante la fase de compilación (`next build`), lo que genera el error `"supabaseUrl is required"` y falla el deploy.
2. **Clave anónima:** La `anonKey` de Supabase es una clave pública por diseño (es la que se usa en el cliente). No tiene permisos de administración; su exposición está protegida por las políticas RLS.
3. **Simplicidad:** Elimina una fuente recurrente de errores en el flujo de build/deploy sin comprometer la seguridad del sistema.

> **Nota de seguridad:** La `service_role` key de Supabase (con permisos de administración) **nunca** debe incluirse en el código cliente. Solo la `anonKey` está hardcodeada.

---

## 16. Comandos útiles

### Instalación de dependencias

```bash
npm install
```

### Servidor de desarrollo local

```bash
npm run dev
# Disponible en http://localhost:3000
```

### Build de producción (verificación antes de push)

```bash
npm run build
# Detecta errores de compilación, TypeScript y rutas
# Ejecutar siempre antes de empaquetar y subir al repositorio
```

### Empaquetar para entrega

Genera un ZIP del proyecto excluyendo las carpetas generadas y el historial de Git:

```bash
zip -r teamup-app.zip teamup-app \
  --exclude "teamup-app/.next/*" \
  --exclude "teamup-app/node_modules/*" \
  --exclude "teamup-app/.git/*"
```

El archivo resultante `teamup-app.zip` es el que el desarrollador descarga, copia al repositorio local y sube mediante GitHub Desktop.

---

## 17. Pendiente para v13

Las siguientes funcionalidades están planificadas para la próxima versión mayor de TeamUp:

### Funcionalidades sociales

| Feature | Descripción |
|---------|-------------|
| **Follow / Unfollow** | Sistema de seguimiento entre usuarios: feed personalizado, notificaciones de actividad de personas seguidas |
| **Etiquetar usuarios en Momentos** | Mencionar a otros usuarios (`@username`) en fotos y textos del feed social |

### Funcionalidades de eventos

| Feature | Descripción |
|---------|-------------|
| **Eventos recurrentes** | Crear eventos con recurrencia automática (p. ej.: "cada martes a las 19:00h") |
| **Lista de espera** | Cuando un evento alcanza `max_players`, los nuevos usuarios se añaden a una cola y son notificados si se libera una plaza |

### Mejoras de chat

| Feature | Descripción |
|---------|-------------|
| **Responder a mensajes** | Threading básico: citar y responder a un mensaje concreto del chat |
| **Reacciones con emoji** | Reaccionar a mensajes del chat con emojis (al estilo Slack/WhatsApp) |

### Multimedia

| Feature | Descripción |
|---------|-------------|
| **Vídeos cortos en Momentos** | Soporte para vídeos en el feed social. Plataforma recomendada: **Cloudinary** (transcoding automático, CDN, streaming adaptativo). Requiere decisión de arquitectura antes de implementar. |

### Administración

| Feature | Descripción |
|---------|-------------|
| **Panel de patrocinadores** | Interfaz dentro de la propia app para gestionar patrocinadores (añadir logos, activar/desactivar, reordenar) sin acceder al dashboard de Supabase |

---

*Documentación generada para TeamUp v12 — App social deportiva para España*
*Repositorio: https://github.com/colivasbon/teamup-app | Producción: https://teamup-app-alpha.vercel.app*
