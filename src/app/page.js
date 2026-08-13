import Link from 'next/link'
import ThemeButton from '@/components/ThemeButton'
import MobileRedirect from '@/components/MobileRedirect'
import { getSportEmoji } from '@/lib/sportEmoji'
import { getSupabaseServer } from '@/lib/supabase'

export const revalidate = 3600

export const metadata = {
  title: {
    absolute: 'TeamUp — App para organizar eventos deportivos, unirse a partidos y deporte social en España',
  },
  description: 'TeamUp es la app gratuita para organizar y unirse a eventos deportivos, partidos de pádel, fútbol 7, grupos de running, senderismo y quedadas deportivas cerca de ti en España. Haz deporte y conoce gente.',
  alternates: {
    canonical: 'https://teamupapp.es/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://teamupapp.es',
    siteName: 'TeamUp',
    title: 'TeamUp — Haz deporte, conoce gente en tu zona',
    description: 'Organiza y únete a eventos deportivos, partidos de pádel, fútbol 7, grupos de running y eventos deportivos cerca de ti en España. Gratis.',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'TeamUp — App de eventos deportivos y deporte social en España',
      },
    ],
  },
}

// Logo SVG inline — usa currentColor para cambiar con el tema
function LogoTeamUp({ height = 36 }) {
  const w = Math.round(height * (800 / 320))
  return (
    <svg width={w} height={height} viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" aria-label="TeamUp" style={{ display: 'block' }}>
      <g fill="currentColor">
        <path d="M149.49,25.61v37.21c0,6.22-5.04,11.26-11.26,11.26h-29.11c-.78,0-1.41.63-1.41,1.41v170.35c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V75.49c0-.78-.63-1.41-1.41-1.41h-29.11c-6.22,0-11.26-5.04-11.26-11.26V25.61c0-6.22,5.04-11.26,11.26-11.26h112.92c6.22,0,11.26,5.04,11.26,11.26Z"/>
        <path d="M204.2,75.49v35.48h5.17c6.22,0,11.26,5.04,11.26,11.26v29.37c0,6.22-5.04,11.26-11.26,11.26h-5.17v33.09c0,.78.63,1.41,1.41,1.41h15.14c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-57.19c-6.22,0-11.26-5.04-11.26-11.26V25.48c0-6.22,5.04-11.26,11.26-11.26h40.63v.13h16.55c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-15.14c-.78,0-1.41.63-1.41,1.41Z"/>
        <path d="M234.83,25.22v220.23c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26v-79.73c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v79.73c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26V25.22c0-6.22-5.04-11.26-11.26-11.26h-87.76c-6.22,0-11.26,5.04-11.26,11.26ZM286.72,107.34v-30.4c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v30.4c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24Z"/>
        <path d="M518.32,25.48v220.36c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.2c0-1.79-1.45-3.24-3.24-3.24h0c-1.79,0-3.24,1.45-3.24,3.24v168.64c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.37c0-1.89-1.53-3.41-3.41-3.41h0c-1.89,0-3.41,1.53-3.41,3.41v168.47c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V56.45c0-23.32,18.9-42.22,42.22-42.22h115.51c6.22,0,11.26,5.04,11.26,11.26Z"/>
        <path d="M617.53,25.17v168.64c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24V25.17c0-6.22-5.04-11.26-11.26-11.26h-29.43c-6.22,0-11.26,5.04-11.26,11.26v220.35c0,6.22,5.04,11.26,11.26,11.26h81.27c6.22,0,11.26-5.04,11.26-11.26V25.17c0-6.22-5.04-11.26-11.26-11.26h-22.83c-6.22,0-11.26,5.04-11.26-11.26Z"/>
        <path d="M730.13,13.79v.11h-50.26c-6.22,0-11.26,5.04-11.26,11.26v220.46c0,6.22,5.04,11.26,11.26,11.26h32.46c6.22,0,11.26-5.04,11.26-11.26v-97.34c0-.78.63-1.41,1.41-1.41h5.14c30.83,0,55.82-24.99,55.82-55.82v-21.44c0-30.83-24.99-55.82-55.82-55.82h0ZM723.59,90.35v-26.11c0-1.81,1.47-3.27,3.27-3.27h0c1.81,0,3.27,1.47,3.27,3.27v26.11c0,1.81-1.47,3.27-3.27,3.27h0c-1.81,0-3.27-1.47-3.27-3.27Z"/>
      </g>
    </svg>
  )
}

const SPORTS = [
  { id: 'running',    name: 'Running',    emoji: 'running',    color: '#5b6ef5' },
  { id: 'padel',      name: 'Pádel',      emoji: 'padel',      color: '#2d9e7a' },
  { id: 'futbol',     name: 'Fútbol',     emoji: 'futbol',     color: '#ef4444' },
  { id: 'tenis',      name: 'Tenis',      emoji: 'tenis',      color: '#fbbf24' },
  { id: 'senderismo', name: 'Senderismo', emoji: 'senderismo', color: '#f59e0b' },
  { id: 'gimnasio',   name: 'Gimnasio',   emoji: 'gimnasio',   color: '#8b5cf6' },
  { id: 'natacion',   name: 'Natación',   emoji: 'natacion',   color: '#0ea5e9' },
  { id: 'ciclismo',   name: 'Ciclismo',   emoji: 'ciclismo',   color: '#f97316' },
  { id: 'yoga',       name: 'Yoga',       emoji: 'yoga',       color: '#ec4899' },
  { id: 'baloncesto', name: 'Baloncesto', emoji: 'baloncesto', color: '#f59e0b' },
  { id: 'voleibol',   name: 'Voleibol',   emoji: 'voleibol',   color: '#1a8c6e' },
  { id: 'badminton',  name: 'Bádminton',  emoji: 'badminton',  color: '#8b5cf6' },
]

const CITIES = [
  ['madrid', 'Madrid'], ['barcelona', 'Barcelona'], ['valencia', 'Valencia'],
  ['sevilla', 'Sevilla'], ['malaga', 'Málaga'], ['cordoba', 'Córdoba'],
  ['granada', 'Granada'], ['alicante', 'Alicante'], ['murcia', 'Murcia'],
  ['zaragoza', 'Zaragoza'], ['bilbao', 'Bilbao'], ['cadiz', 'Cádiz'],
  ['huelva', 'Huelva'], ['jaen', 'Jaén'], ['almeria', 'Almería'],
]

const FEATURES = [
  { icon: '🗓', title: 'Crea un evento en 1 minuto', text: 'Elige deporte, fecha, hora y lugar. Publica tu evento deportivo y deja que la gente de tu zona se apunte.' },
  { icon: '📍', title: 'Eventos deportivos cerca de ti', text: 'Filtra por deporte y provincia o activa tu ubicación para encontrar partidos de pádel, fútbol 7, running…' },
  { icon: '💬', title: 'Chat por evento', text: 'Habla con los participantes antes de quedar: confirma plazas, cambiad la hora o queda para llegar juntos.' },
  { icon: '📸', title: 'Momentos y fotos', text: 'Comparte fotos y la resaca de partido con la gente con la que jugaste. El buen rollo continúa en la app.' },
  { icon: '🏆', title: 'Torneos para clubs y empresas', text: 'Crea torneos y ligas para tu club, centro deportivo o empresa, con marcadores y seguimiento de participantes.' },
  { icon: '⭐', title: 'Karma y buen ambiente', text: 'Un sistema de valoraciones para que quedar a jugar siempre sea con respeto, puntualidad y buen rollo.' },
  { icon: '🔔', title: 'Notificaciones al momento', text: 'Entérate cuando alguien se apunta a tu evento, cuando responde al chat o cuando queda la última plaza.' },
  { icon: '📱', title: 'Instálala como app nativa', text: 'TeamUp es una PWA: añádela a la pantalla de inicio de tu móvil y úsala como una app más, incluso sin conexión.' },
]

const FAQ = [
  ['¿Cómo puedo unirme a una evento deportivo o partido cerca de mí?', 'Entra en la app (botón "Entrar a la app"), pulsa en Explorar, filtra por deporte y provincia o activa tu ubicación, y pulsa el botón "Unirse" en el evento que prefieras. Si no hay ninguno, puedes crear el tuyo propio en un minuto.'],
  ['¿Es gratis usar TeamUp?', 'Sí. Crear tu cuenta, unirte a eventos y organizar eventos deportivos es totalmente gratuito. Solo algunos eventos pueden indicar un precio de pista o inscripción, que verás siempre antes de apuntarte.'],
  ['¿Qué deportes puedo encontrar en TeamUp?', 'Running, pádel, fútbol 7, tenis, senderismo, natación, ciclismo, gimnasio, yoga, baloncesto, voleibol y bádminton, entre otros. Cada evento indica el nivel necesario para participar.'],
  ['¿Necesito ser un deportista experimentado?', 'No. Hay eventos para todos los niveles: principiante, intermedio y avanzado. Cada partido indica el nivel mínimo, y muchos organizadores dan la bienvenida a quien empieza.'],
  ['¿Puedo crear mi propio evento deportivo?', 'Sí. Desde el botón "Crear evento" eliges deporte, fecha, hora, ubicación y número de plazas. Tu evento aparecerá en el listado para que otros deportistas de tu zona puedan unirse.'],
  ['¿En qué ciudades funciona TeamUp?', 'TeamUp está disponible en las 50 provincias españolas: Madrid, Barcelona, Valencia, Sevilla, Málaga, Bilbao, Zaragoza, Murcia y muchas más. Busca eventos deportivos en tu provincia desde la app.'],
  ['¿TeamUp es una app para el móvil?', 'TeamUp es una aplicación web progresiva (PWA): puedes instalarla en la pantalla de inicio de tu móvil Android o iOS y usarla como una app nativa, incluso con notificaciones.'],
  ['¿Cómo funciona el karma y las valoraciones?', 'Tras un evento, los participantes valoran la experiencia. Así, el karma refleja la fiabilidad y el buen ambiente de cada deportista: puntualidad, respeto y ganas de jugar.'],
]

async function getStats() {
  try {
    const sb = getSupabaseServer()
    if (!sb) return null
    const today = new Date().toISOString().split('T')[0]
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const sinceIso = since.toISOString()
    const [activeRes, usersRes, recentRes] = await Promise.all([
      sb.from('events').select('id', { count: 'exact', head: true }).neq('status', 'cancelled').gte('date', today),
      sb.from('profiles').select('id', { count: 'exact', head: true }),
      sb.from('events').select('id', { count: 'exact', head: true }).neq('status', 'cancelled').gte('created_at', sinceIso),
    ])
    if (activeRes.count == null || usersRes.count == null || recentRes.count == null) return null
    return { active: activeRes.count, users: usersRes.count, recent: recentRes.count }
  } catch (_) {
    return null
  }
}

async function getSponsors() {
  try {
    const sb = getSupabaseServer()
    if (!sb) return []
    const { data } = await sb.from('sponsors')
      .select('id, name, logo_url, website_url')
      .eq('active', true)
      .order('sort_order', { ascending: true })
    return data || []
  } catch (_) {
    return []
  }
}

export default async function Landing() {
  const [stats, sponsors] = await Promise.all([getStats(), getSponsors()])

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQ.map(([q, a]) => ({
      '@type': 'Question',
      'name': q,
      'acceptedAnswer': { '@type': 'Answer', 'text': a },
    })),
  }

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': 'Cómo unirse a una evento deportivo con TeamUp',
    'description': 'Crea tu cuenta, elige deporte y ciudad, y apúntate a eventos deportivos cerca de ti en España.',
    'step': [
      { '@type': 'HowToStep', 'position': 1, 'name': 'Crea tu cuenta gratis', 'text': 'Regístrate con tu email o con Google en menos de un minuto.' },
      { '@type': 'HowToStep', 'position': 2, 'name': 'Elige deporte y ciudad', 'text': 'Busca eventos deportivos y partidos de pádel, fútbol 7, running, senderismo y más en tu provincia, o crea tu propio evento.' },
      { '@type': 'HowToStep', 'position': 3, 'name': 'Apúntate y conoce gente', 'text': 'Reserva tu plaza, chatea con los participantes y comparte tus momentos tras el evento.' },
    ],
    'totalTime': 'PT1M',
  }

  return (
    <div className="landing">

      <MobileRedirect />

      <a className="skip-link" href="#landing-main">Saltar al contenido</a>

      {/* ── Header ── */}
      <header className="landing-wrap landing-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
        <Link href="/" className="landing-logo" aria-label="TeamUp — Inicio">
          <LogoTeamUp height={34} />
        </Link>

        <nav className="landing-nav" aria-label="Navegación principal">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#deportes">Deportes</a>
          <a href="#ciudades">Ciudades</a>
          <a href="#faq">Preguntas</a>
        </nav>

        <div className="landing-nav-right">
          <ThemeButton />
          <Link href="/start" className="btn btn-primary landing-cta-small">Entrar a la app</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <main id="landing-main">
        <section className="landing-hero landing-wrap">
          <div className="landing-hero-grid">
            <div className="landing-hero-copy">
              <span className="landing-kicker">Haz deporte · Conoce gente</span>
              <h1>Haz deporte y conoce gente en tu zona</h1>
              <p className="lead">
                TeamUp es la app gratuita para organizar y unirse a eventos deportivos, partidos de pádel,
                fútbol 7, grupos de running y quedadas deportivas cerca de ti. En toda España.
              </p>
              <div className="landing-cta-row">
                <Link href="/start" className="btn btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Entrar a la app
                </Link>
                <Link href="/events" className="btn btn-outline">Explorar eventos</Link>
              </div>
              <p className="hero-note">Gratis · Sin cuotas · Para todos los niveles</p>

              {stats && (
                <div className="stats-strip landing-stats anim-1">
                  {[
                    [stats.active, 'Eventos activos'],
                    [stats.users, 'Deportistas'],
                    [stats.recent, 'Nuevos en 7 días'],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <div className="stat-value">{v}</div>
                      <div className="stat-label">{l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="landing-hero-visual" aria-hidden="true">
              <div className="landing-phone">
                <div className="phone-notch" />
                <div className="phone-row">
                  <span className="phone-appname">TeamUp</span>
                  <span className="phone-avatar">👤</span>
                </div>
                <div className="phone-stats">
                  <div className="phone-stat"><strong>124</strong><span>Eventos</span></div>
                  <div className="phone-stat"><strong>382</strong><span>Deportistas</span></div>
                  <div className="phone-stat"><strong>31</strong><span>Nuevos 7d</span></div>
                </div>
                <div className="phone-label">¿Qué hacemos hoy?</div>
                <div className="phone-sports">
                  <div className="phone-sport">
                    <span className="ps-emoji" style={{ background: 'linear-gradient(140deg,#5b6ef5,#3f4f5a)' }}>{getSportEmoji('running')}</span>
                    <span className="ps-name">Running</span>
                  </div>
                  <div className="phone-sport">
                    <span className="ps-emoji" style={{ background: 'linear-gradient(140deg,#2d9e7a,#1a6e56)' }}>{getSportEmoji('padel')}</span>
                    <span className="ps-name">Pádel</span>
                  </div>
                  <div className="phone-sport">
                    <span className="ps-emoji" style={{ background: 'linear-gradient(140deg,#ef4444,#b91c1c)' }}>{getSportEmoji('futbol')}</span>
                    <span className="ps-name">Fútbol</span>
                  </div>
                </div>
                <div className="phone-label" style={{ marginTop: 2 }}>Eventos cerca de ti</div>
                <div className="phone-event">
                  <div className="pe-icon">{getSportEmoji('running')}</div>
                  <div className="pe-body">
                    <div className="pe-title">Running Matutino</div>
                    <div className="pe-meta">Alameda de Córdoba · Hoy 07:30</div>
                    <div className="pbar"><div className="pbar-fill" style={{ width: '70%', background: '#5b6ef5' }} /></div>
                  </div>
                  <div className="pe-count">7/10</div>
                </div>
                <div className="phone-event">
                  <div className="pe-icon">{getSportEmoji('padel')}</div>
                  <div className="pe-body">
                    <div className="pe-title">Torneo Pádel Medio</div>
                    <div className="pe-meta">Club Pádel Centro · Mañana 18:00</div>
                    <div className="pbar"><div className="pbar-fill" style={{ width: '50%', background: '#2d9e7a' }} /></div>
                  </div>
                  <div className="pe-count">2/4</div>
                </div>
                <div className="phone-nav">
                  <span className="on"><i>🏠</i>Inicio</span>
                  <span><i>🔍</i>Explorar</span>
                  <span><i>＋</i>Crear</span>
                  <span><i>📸</i>Momentos</span>
                </div>
              </div>
              <div className="landing-float">
                <span className="pf-icon">🔔</span>
                <div>
                  <div className="pf-title">Queda 1 plaza</div>
                  <div className="pf-text">Pádel Medio · Mañana 18:00</div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* ── Cómo funciona ── */}
      <section className="landing-wrap landing-section" id="como-funciona">
        <span className="landing-section-kicker">Cómo funciona</span>
        <h2>Empieza a jugar en tres pasos</h2>
        <p className="landing-sub">Nada de papeleo ni compromisos. Entras, eliges y quedas para hacer deporte.</p>
        <div className="landing-steps">
          <div className="landing-step">
            <div className="step-num">1</div>
            <h3>Crea tu cuenta gratis</h3>
            <p>Regístrate con tu email o con Google en menos de un minuto. Sin tarjeta, sin cuotas.</p>
          </div>
          <div className="landing-step">
            <div className="step-num">2</div>
            <h3>Elige deporte y ciudad</h3>
            <p>Busca eventos deportivos en tu provincia o crea tu propio evento con deporte, fecha, hora y lugar.</p>
          </div>
          <div className="landing-step">
            <div className="step-num">3</div>
            <h3>Apúntate y conoce gente</h3>
            <p>Reserva tu plaza, chatea con los participantes y comparte tus momentos tras el evento.</p>
          </div>
        </div>
      </section>

      {/* ── Deportes ── */}
      <section className="landing-wrap landing-section" id="deportes">
        <span className="landing-section-kicker">Deportes</span>
        <h2>Todo tu deporte, en un solo sitio</h2>
        <p className="landing-sub">Eventos deportivos y quedadas de los deportes más practicados en España, con niveles para todos.</p>
        <div className="landing-sports">
          {SPORTS.map((s) => (
            <Link key={s.id} href={`/events?sport=${s.id}`} className="landing-sport">
              <span className="s-emoji" style={{
                background: `linear-gradient(140deg, ${s.color}, ${s.color}cc)`,
                color: '#fff',
              }}>
                {getSportEmoji(s.emoji)}
              </span>
              <span className="name">{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-wrap landing-section">
        <span className="landing-section-kicker">La app</span>
        <h2>Todo lo que necesitas para quedar a jugar</h2>
        <p className="landing-sub">Pensada para que organizar deporte sea fácil, y para que quedar siempre acabe en buen rollo.</p>
        <div className="landing-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-feature">
              <div className="f-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ciudades ── */}
      <section className="landing-wrap landing-section" id="ciudades">
        <span className="landing-section-kicker">Ciudades</span>
        <h2>Eventos deportivos en tu ciudad</h2>
        <p className="landing-sub">Busca deporte social cerca de ti. Estas son algunas de las ciudades donde ya hay eventos deportivos:</p>
        <div className="landing-cities">
          {CITIES.map(([id, name]) => (
            <Link key={id} href={`/events?prov=${id}`} className="chip">{name}</Link>
          ))}
        </div>
      </section>

      {/* ── Qué es TeamUp (SEO/GEO) ── */}
      <section className="landing-wrap landing-section">
        <span className="landing-section-kicker">Qué es TeamUp</span>
        <div className="landing-article">
          <h3>La app para organizar eventos deportivos y deporte social en España</h3>
          <p>
            <strong>TeamUp</strong> (teamupapp.es) es la plataforma social deportiva gratuita en España
            para conectar deportistas cercanos: crea, busca y únete a eventos deportivos, partidos de pádel,
            fútbol 7, running, senderismo y entrenamientos en las 50 provincias españolas.
          </p>
          <p>
            ¿Te falta pareja para el pádel? ¿Quieres un grupo de running por la mañana? ¿Buscas un
            once para el fútbol del finde? En TeamUp, cualquier persona puede publicar un evento con
            deporte, fecha, hora y lugar, y el resto de la comunidad se apunta con un toque. Es la
            forma más sencilla de <strong>hacer deporte y conocer gente nueva en tu zona</strong>,
            sin apps de mensajería infinitas ni grupos perdidos.
          </p>
          <p>
            TeamUp funciona también para clubs, centros deportivos y empresas: crea torneos, ligas y
            quedadas recurrentes, y da visibilidad a tus instalaciones con el perfil de patrocinador.
            Es una aplicación web progresiva (PWA): puedes instalarla en tu móvil y usarla como una
            app nativa.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="landing-wrap landing-section" id="faq">
        <span className="landing-section-kicker">FAQ</span>
        <h2>Preguntas frecuentes</h2>
        <p className="landing-sub">Todas las dudas sobre cómo funciona TeamUp, respondidas.</p>
        <div className="landing-faq">
          {FAQ.map(([q, a]) => (
            <div key={q} className="faq-item">
              <p className="faq-q">{q}</p>
              <p className="faq-a">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Patrocinadores (solo si hay datos reales) ── */}
      {sponsors.length > 0 && (
        <section className="landing-wrap landing-section landing-sponsors">
          <div className="landing-sponsor-label">Con la colaboración de</div>
          <div className="sponsors-ticker">
            <div className="sponsors-ticker__inner">
              {Array.from({ length: 6 }).flatMap(() => sponsors).map((s, i) => (
                s.website_url
                  ? <a key={i} href={s.website_url} target="_blank" rel="noopener noreferrer" className="sponsors-ticker__item" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      {s.logo_url
                        ? <img src={s.logo_url} alt={s.name} style={{ height: 36, maxWidth: 140, objectFit: 'contain', verticalAlign: 'middle', filter: 'var(--sponsor-filter)' }} />
                        : s.name
                      }
                    </a>
                  : <span key={i} className="sponsors-ticker__item">
                      {s.logo_url
                        ? <img src={s.logo_url} alt={s.name} style={{ height: 36, maxWidth: 140, objectFit: 'contain', verticalAlign: 'middle', filter: 'var(--sponsor-filter)' }} />
                        : s.name
                      }
                    </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      <section className="landing-final landing-wrap">
        <h2>¿Preparado para jugar?</h2>
        <p>Crea tu cuenta gratis y encuentra tu primera evento deportivo en menos de un minuto.</p>
        <div className="landing-cta-row">
          <Link href="/start" className="btn btn-primary">
            Entrar a la app
          </Link>
          <Link href="/auth" className="btn btn-outline">Crear cuenta</Link>
        </div>
      </section>

      </main>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-logo" style={{ justifyContent: 'center', flex: 'none' }}>
            <LogoTeamUp height={28} />
          </div>
          <div className="f-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#deportes">Deportes</a>
            <a href="#ciudades">Ciudades</a>
            <a href="#faq">Preguntas frecuentes</a>
            <Link href="/events">Explorar eventos</Link>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
          <div className="f-copy">
            © 2026 TeamUp · <a href="mailto:colivasbon@gmail.com">colivasbon@gmail.com</a> · <Link href="/start">Entrar a la app</Link>
          </div>
        </div>
      </footer>

      {/* JSON-LD — GEO para motores de respuesta e IA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
    </div>
  )
}
