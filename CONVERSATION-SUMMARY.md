# TeamUp — Resumen de conversación de desarrollo

## Contexto inicial

Carlos Olivas (Córdoba, España) quería construir una app social deportiva desde cero, sin conocimientos de programación. El objetivo: que los usuarios pudieran crear y unirse a eventos deportivos locales en España.

---

## Sprint v2–v8: Construcción inicial

- **Arquitectura base**: Next.js App Router, CSS puro, Supabase
- **Sistema de autenticación**: email/contraseña
- **Páginas**: Home, Explorar, Crear evento, Perfil básico
- **Integración con Supabase**: tablas `profiles`, `events`, `event_participants`
- **Problemas resueltos**:
  - RLS bloqueando INSERTs
  - Vista `events_with_counts` recreada sin filtros
  - Credenciales Supabase hardcodeadas en `supabase.js` para evitar el error `"supabaseUrl is required"` en build de Vercel

---

## Sprint v9: Funcionalidades sociales

- Chat en tiempo real dentro de eventos (polling con `setInterval`)
- Momentos: feed con fotos y likes
- Edición completa del perfil: avatar, bio, deportes favoritos
- OAuth: Google + Apple
- Fix: mensajes duplicados en chat

---

## Sprint v9.1–v10.5: Pulido y correcciones

- Tono de piel en emojis de deportes (`SportIcon` con `skin_tone` del perfil)
- Banners orgánicos en perfil con SVG
- Mapa OpenStreetMap con Leaflet en ficha de evento
- Sistema de karma: votación entre participantes, puntuación visible en perfil
- Compresión de imágenes antes de subir (resize + quality 80% en navegador)
- Editar y cancelar evento
- Búsqueda por texto en Explorar
- Notificaciones in-app con polling
- Modal de onboarding: ciudad + deportes favoritos al registrarse
- Fix: modal de onboarding no aparecía siempre correctamente (corregido esperando a que `profile !== undefined`)
- Botón "Unirse" funcional desde la lista de eventos
- Notificaciones para participantes (no solo para el creador)
- Duración estimada del evento

---

## Sprint v11: Sprint grande

### Funcionalidades añadidas

- **Cinta del eslogan**: "HAZ DEPORTE · CONOCE GENTE" en la parte superior de la página, como elemento de flujo (no `fixed`), desaparece al hacer scroll
- **Carrusel de patrocinadores**: debajo del botón "Crear evento" en Home, elemento de página normal
- **Campos específicos por deporte en crear evento**: Playtomic score, ritmo, distancia, formato fútbol, etc.
- **Comentarios en Momentos**: tabla `moment_comments`, UI con hilo de comentarios, notificaciones
- **Modal "Quién dio like"**: lista de usuarios que han dado like a un momento
- **Notificaciones separadas en dos secciones**: toggle Eventos / Social en la página de notificaciones y en la pestaña del perfil
- **Click en notificación de chat**: redirige directamente a `/events/[id]?tab=Chat`
- **Evento detalle**: lee el parámetro `?tab=` al cargar y activa la pestaña correspondiente

### Problemas resueltos en v11

- **Eslogan**: varias iteraciones hasta conseguir que fuera elemento de flujo de página (no posicionado como `fixed`)
- **Carrusel de patrocinadores**: múltiples intentos de posicionamiento. Decisión final: elemento normal dentro de `page.js`, fuera del `page-wrap`, con márgenes negativos para ocupar el 100% del ancho
- **Iconos navbar en dark mode**: detalles en blanco en el icono de la casita, corregido cambiando a `fill="var(--bg)"`
- **"Partido de ciclismo" como placeholder**: corregido con placeholders específicos por deporte

---

## Sprint v12: Nuevas funcionalidades

- **Generador de pósters y QR**: `PosterModal.js` con Canvas API y librería `qrcode`. Modos disponibles: Solo QR (oscuro/claro) y Póster completo (oscuro/claro/color). Descarga en PNG. QR generado con `QRCode.toCanvas()` (sin `Image()` para evitar errores CORS en canvas)
- **Historial de eventos**: tercera opción en la pestaña Actividad del perfil, muestra eventos pasados del usuario
- **Insignias de participación**: 6 insignias calculadas en tiempo real en la pestaña Karma
- **Trigger notificación nuevo participante**: SQL con anti-duplicados (máximo 1 notificación por evento en 5 minutos)
- **Función de recordatorio 1h antes**: `create_event_reminders()` + `pg_cron` (configuración opcional)
- **Sistema de patrocinadores dinámico**:
  - Tabla `sponsors` en Supabase
  - Carrusel carga logos y nombres desde la base de datos
  - Logos PNG monocromo con filtro CSS adaptativo (tema oscuro/claro)
  - Click en logo abre la `website_url` del patrocinador
  - PDF de especificaciones técnicas para patrocinadores (generado con ReportLab)
- **Tema en perfiles públicos**: se aplica `data-theme` desde `localStorage` al cargar `/profile/[id]`
- **Fix RLS `moment_comments`**: se añadió policy `SELECT` pública para permitir lectura sin autenticación

### Problemas resueltos en v12

- **Notificaciones triplicadas al unirse a evento**: se eliminaron triggers duplicados creados en v10/v11/v12
- **Toggle Solo QR / Póster cortado**: corregido añadiendo margen superior
- **Modo Color en póster**: "TEAM UP" siempre en blanco cuando el fondo usa el color del deporte
- **Comentarios no persistían al volver a la página**: se cambió la query eliminando el join (se usa query separada a `profiles` por IDs para evitar conflictos con RLS)
- **Contador de comentarios no se mostraba**: `fetchMoments` actualizado para contar también `moment_comments`
- **Condición `!comments[m.id]` impedía recargar comentarios**: cambiada para verificar si hay comentarios con texto real

---

## Decisiones técnicas clave

| # | Decisión | Motivo |
|---|----------|--------|
| 1 | **Sin Tailwind** — CSS puro con variables CSS | Decisión de diseño desde el inicio del proyecto |
| 2 | **Credenciales hardcodeadas** en `supabase.js` | Evitar el error `"supabaseUrl is required"` durante el build en Vercel |
| 3 | **Sin variables de entorno** | Mismo motivo que el punto anterior |
| 4 | **Queries sin join en tablas con RLS** | Cuando PostgREST falla con joins por permisos, se hacen dos queries separadas (datos primero, luego perfiles por IDs) |
| 5 | **Polling en lugar de WebSockets** | Chat y Momentos usan `setInterval`. Sencillo y funcional para el volumen actual |
| 6 | **Canvas API para pósters** | Sin servidor, sin costes. Todo se genera en el navegador del usuario |
| 7 | **Supabase Storage para imágenes** | Avatares, banners, momentos y logos de patrocinadores |
| 8 | **Logos de patrocinadores monocromo** | PNG negro sobre fondo transparente. Filtro CSS adapta la apariencia al tema activo |

---

## Flujo de trabajo establecido

Carlos no usa terminal. El flujo completo de cada entrega es el siguiente:

1. El agente edita el código en el workspace
2. Se ejecuta `npm run build` para verificar que no hay errores de compilación
3. El agente empaqueta un ZIP del proyecto (sin `node_modules`, `.next` ni `.git`)
4. Carlos descarga el ZIP
5. Carlos copia los archivos al repositorio local
6. Commit en GitHub Desktop
7. Push a GitHub
8. Vercel detecta el push y despliega automáticamente

---

## Pendiente para v13

- Sistema de seguimiento (follow/unfollow) entre usuarios
- Eventos recurrentes
- Lista de espera para eventos con aforo completo
- Vídeos en Momentos (Cloudinary recomendado como solución de hosting)
- Chat mejorado: responder mensajes, reacciones con emojis
- Etiquetar usuarios en Momentos
- Panel de administración de patrocinadores dentro de la app
