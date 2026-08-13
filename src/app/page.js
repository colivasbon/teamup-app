import Link from 'next/link'
import ThemeButton from '@/components/ThemeButton'
import MobileRedirect from '@/components/MobileRedirect'
import { getSportEmoji } from '@/lib/sportConfig'
import { getSupabaseServer } from '@/lib/supabase'

export const revalidate = 3600

export const metadata = {
  title: {
    absolute: 'TeamUp — App para organizar eventos deportivos, unirse a partidos y deporte social en España',
  },
  description: 'TeamUp es la app gratuita para organizar y unirse a eventos deportivos, partidos de pádel, fútbol 7, grupos de running, senderismo y quedadas deportivas cerca de ti en España. Haz deporte y conoce gente.',
  alternates: { canonical: 'https://teamupapp.es/' },
  openGraph: {
    type: 'website', locale: 'es_ES', url: 'https://teamupapp.es', siteName: 'TeamUp',
    title: 'TeamUp — Haz deporte, conoce gente en tu zona',
    description: 'Organiza y únete a eventos deportivos, partidos de pádel, fútbol 7, grupos de running y eventos deportivos cerca de ti en España. Gratis.',
    images: [{ url: '/favicon.png', width: 512, height: 512, alt: 'TeamUp — App de eventos deportivos y deporte social en España' }],
  },
}

function LogoTeamUp({ height = 36 }) {
  const w = Math.round(height * (800 / 320))
  return (
    <svg width={w} height={height} viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" aria-label="TeamUp" style={{ display: 'block' }}>
      <g fill="currentColor">
        <path d="M149.49,25.61v37.21c0,6.22-5.04,11.26-11.26,11.26h-29.11c-.78,0-1.41.63-1.41,1.41v170.35c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V75.49c0-.78-.63-1.41-1.41-1.41h-29.11c-6.22,0-11.26-5.04-11.26-11.26V25.61c0-6.22,5.04-11.26,11.26-11.26h112.92c6.22,0,11.26,5.04,11.26,11.26Z"/>
        <path d="M204.2,75.49v35.48h5.17c6.22,0,11.26,5.04,11.26,11.26v29.37c0,6.22-5.04,11.26-11.26,11.26h-5.17v33.09c0,.78.63,1.41,1.41,1.41h15.14c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-57.19c-6.22,0-11.26-5.04-11.26-11.26V25.48c0-6.22,5.04-11.26,11.26-11.26h40.63v.13h16.55c6.22,0,11.26,5.04,11.26,11.26v37.21c0,6.22-5.04,11.26-11.26,11.26h-15.14c-.78,0-1.41.63-1.41,1.41Z"/>
        <path d="M234.83,25.22v220.23c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26v-79.73c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v79.73c0,6.22,5.04,11.26,11.26,11.26h29.37c6.22,0,11.26-5.04,11.26-11.26V25.22c0-6.22-5.04-11.26-11.26-11.26h-87.76c-6.22,0-11.26,5.04-11.26,11.26ZM286.72,107.34v-30.4c0-1.79,1.45-3.24,3.24-3.24h0c1.79,0,3.24,1.45,3.24,3.24v30.4c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24Z"/>
        <path d="M518.32,25.48v220.36c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.2c0-1.79-1.45-3.24-3.24-3.24h0c-1.79,0-3.24,1.45-3.24,3.24v168.64c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V77.37c0-1.89-1.53-3.41-3.41-3.41h0c-1.89,0-3.41,1.53-3.41,3.41v168.47c0,6.22-5.04,11.26-11.26,11.26h-29.37c-6.22,0-11.26-5.04-11.26-11.26V56.45c0-23.32,18.9-42.22,42.22-42.22h115.51c6.22,0,11.26,5.04,11.26,11.26Z"/>
        <path d="M617.53,25.17v168.64c0,1.79-1.45,3.24-3.24,3.24h0c-1.79,0-3.24-1.45-3.24-3.24V25.17c0-6.22-5.04-11.26-11.26-11.26h-29.43c-6.22,0-11.26,5.04-11.26,11.26v220.35c0,6.22,5.04,11.26,11.26,11.26h81.27c6.22,0,11.26-5.04,11.26-11.26V25.17c0-6.22-5.04-11.26-11.26-11.26h-22.83c-6.22,0-11.26,5.04-11.26,11.26Z"/>
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
  { icon: '🗓', title: 'Un minuto', subtitle: 'Crea tu evento', text: 'Deporte, fecha, hora y lugar. Publica y deja que tu zona se apunte.' },
  { icon: '📍', subtitle: 'Encuentra', title: 'Cerca de ti', text: 'Filtra por deporte y provincia. Partidos de pádel, fútbol, running a minutos de casa.' },
  { icon: '💬', subtitle: 'Habla', title: 'Chat por evento', text: 'Confirma plazas, cambiad la hora, queda para llegar juntos.' },
  { icon: '📸', subtitle: 'Comparte', title: 'Momentos', text: 'Fotos y la resaca de partido con la gente con la que jugaste.' },
  { icon: '🏆', subtitle: 'Compite', title: 'Torneos', text: 'Ligas para clubs, centros deportivos y empresas con marcadores.' },
  { icon: '⭐', subtitle: 'Confía', title: 'Karma', text: 'Puntualidad, fair play y buen ambiente. Juega con gente que aparece.' },
  { icon: '🔔', subtitle: 'Entérate', title: 'Alertas', text: 'Última plaza, cancelaciones, recordatorios antes del partido.' },
  { icon: '📱', subtitle: 'Instala', title: 'PWA', text: 'Añádela a tu pantalla. Funciona como app nativa, incluso sin conexión.' },
]

const FAQ = [
  ['¿Cómo me apunto a un partido?', 'Entra en Explorar, filtra por deporte y provincia, y pulsa "Unirse". Si no hay ninguno, crea el tuyo en un minuto.'],
  ['¿Es gratis?', 'Sí. Crear cuenta, unirse a eventos y organizar eventos es totalmente gratuito.'],
  ['¿Qué deportes hay?', 'Running, pádel, fútbol 7, tenis, senderismo, natación, ciclismo, gimnasio, yoga, baloncesto, voleibol y bádminton.'],
  ['¿Necesito ser experto?', 'No. Hay eventos para todos los niveles: principiante, intermedio y avanzado.'],
  ['¿Puedo crear mi evento?', 'Sí. Deporte, fecha, hora, ubicación y plazas. Tu evento aparece en el listado.'],
  ['¿En qué ciudades?', 'Las 50 provincias españolas: Madrid, Barcelona, Valencia, Sevilla, Málaga, Bilbao y muchas más.'],
  ['¿Es app de móvil?', 'Es una PWA: instálala en tu pantalla de inicio y úsala como app nativa.'],
  ['¿Cómo funciona el karma?', 'Tras cada evento, los jugadores se valoran entre sí. Puntualidad, respeto y ganas de jugar.'],
]

async function getStats() {
  try {
    const sb = getSupabaseServer()
    if (!sb) return null
    const today = new Date().toISOString().split('T')[0]
    const since = new Date(); since.setDate(since.getDate() - 7)
    const [activeRes, usersRes, recentRes] = await Promise.all([
      sb.from('events').select('id', { count: 'exact', head: true }).neq('status', 'cancelled').gte('date', today),
      sb.from('profiles').select('id', { count: 'exact', head: true }),
      sb.from('events').select('id', { count: 'exact', head: true }).neq('status', 'cancelled').gte('created_at', since.toISOString()),
    ])
    if (activeRes.count == null || usersRes.count == null || recentRes.count == null) return null
    return { active: activeRes.count, users: usersRes.count, recent: recentRes.count }
  } catch (_) { return null }
}

async function getSponsors() {
  try {
    const sb = getSupabaseServer()
    if (!sb) return []
    const { data } = await sb.from('sponsors').select('id, name, logo_url, website_url').eq('active', true).order('sort_order', { ascending: true })
    return data || []
  } catch (_) { return [] }
}

export default async function Landing() {
  const [stats, sponsors] = await Promise.all([getStats(), getSponsors()])

  const faqJsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    'mainEntity': FAQ.map(([q, a]) => ({ '@type': 'Question', 'name': q, 'acceptedAnswer': { '@type': 'Answer', 'text': a } })),
  }
  const howToJsonLd = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    'name': 'Cómo unirse a una evento deportivo con TeamUp',
    'description': 'Crea tu cuenta, elige deporte y ciudad, y apúntate a eventos deportivos cerca de ti en España.',
    'step': [
      { '@type': 'HowToStep', 'position': 1, 'name': 'Crea tu cuenta gratis', 'text': 'Regístrate con tu email o con Google en menos de un minuto.' },
      { '@type': 'HowToStep', 'position': 2, 'name': 'Elige deporte y ciudad', 'text': 'Busca eventos deportivos o crea el tuyo propio.' },
      { '@type': 'HowToStep', 'position': 3, 'name': 'Apúntate y conoce gente', 'text': 'Reserva tu plaza, chatea y comparte tus momentos.' },
    ],
    'totalTime': 'PT1M',
  }

  return (
    <div className="ln">
      <MobileRedirect />
      <a className="skip-link" href="#main">Saltar al contenido</a>

      {/* ═══ NAVBAR — Floating glass pill ═══ */}
      <header className="ln-nav-wrap">
        <nav className="ln-nav" aria-label="Navegación principal">
          <Link href="/" className="ln-logo" aria-label="TeamUp — Inicio">
            <LogoTeamUp height={28} />
          </Link>
          <div className="ln-nav-links">
            <a href="#como">Cómo funciona</a>
            <a href="#features">Features</a>
            <a href="#faq">Preguntas</a>
          </div>
          <div className="ln-nav-right">
            <ThemeButton />
            <Link href="/start" className="ln-btn ln-btn-primary">
              Entrar
              <span className="ln-btn-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg></span>
            </Link>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* ═══ HERO — Massive editorial typography ═══ */}
        <section className="ln-hero">
          <div className="ln-hero-inner">
            <span className="ln-eyebrow">Haz deporte · Conoce gente</span>
            <h1 className="ln-hero-h1">
              Haz deporte<br />
              <span className="ln-hero-accent">y conoce gente</span><br />
              en tu zona
            </h1>
            <p className="ln-hero-lead">
              Organiza eventos deportivos, partidos de pádel, fútbol 7, grupos de running
              y quedadas deportivas cerca de ti. En toda España. Gratis.
            </p>
            <div className="ln-hero-cta">
              <Link href="/start" className="ln-btn ln-btn-primary ln-btn-lg">
                Entrar a la app
                <span className="ln-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg></span>
              </Link>
              <Link href="/events" className="ln-btn ln-btn-ghost">Explorar eventos</Link>
            </div>
            <p className="ln-hero-note">Gratis · Sin cuotas · Para todos los niveles</p>
          </div>

          {stats && (
            <div className="ln-stats anim-1">
              {[[stats.active, 'Eventos activos'], [stats.users, 'Deportistas'], [stats.recent, 'Nuevos 7d']].map(([v, l]) => (
                <div key={l} className="ln-stat">
                  <div className="ln-stat-val">{v}</div>
                  <div className="ln-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ═══ SPORTS MARQUEE — Infinite horizontal scroll ═══ */}
        <section className="ln-marquee-section" aria-label="Deportes disponibles">
          <div className="ln-marquee">
            <div className="ln-marquee-track">
              {[...SPORTS, ...SPORTS, ...SPORTS].map((s, i) => (
                <Link key={`${s.id}-${i}`} href={`/events?sport=${s.id}`} className="ln-marquee-pill">
                  <span className="ln-marquee-emoji">{getSportEmoji(s.emoji)}</span>
                  <span>{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BENTO FEATURES — Asymmetric grid ═══ */}
        <section className="ln-section" id="features">
          <div className="ln-section-inner">
            <span className="ln-eyebrow">La app</span>
            <h2 className="ln-section-title">Todo lo que necesitas<br />para quedar a jugar</h2>
            <p className="ln-section-sub">Pensada para que organizar deporte sea fácil, y para que quedar siempre acabe en buen rollo.</p>

            <div className="ln-bento">
              {FEATURES.map((f, i) => (
                <div key={f.title} className={`ln-bento-card ln-bento-${i % 4 === 0 ? 'wide' : i % 4 === 1 ? 'tall' : i % 4 === 2 ? 'wide' : 'normal'}`}>
                  <div className="ln-bento-outer">
                    <div className="ln-bento-inner">
                      <span className="ln-bento-icon">{f.icon}</span>
                      <span className="ln-bento-subtitle">{f.subtitle}</span>
                      <h3 className="ln-bento-title">{f.title}</h3>
                      <p className="ln-bento-text">{f.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CÓMO FUNCIONA — Vertical timeline ═══ */}
        <section className="ln-section ln-section-alt" id="como">
          <div className="ln-section-inner">
            <span className="ln-eyebrow">Cómo funciona</span>
            <h2 className="ln-section-title">Empieza a jugar<br />en tres pasos</h2>
            <p className="ln-section-sub">Nada de papeleo ni compromisos. Entras, eliges y quedas para hacer deporte.</p>

            <div className="ln-timeline">
              <div className="ln-timeline-line" />
              {[
                { num: '01', title: 'Crea tu cuenta', text: 'Regístrate con email o Google en menos de un minuto. Sin tarjeta, sin cuotas.' },
                { num: '02', title: 'Elige deporte y ciudad', text: 'Busca eventos en tu provincia o crea el tuyo con deporte, fecha, hora y lugar.' },
                { num: '03', title: 'Apúntate y conoce gente', text: 'Reserva tu plaza, chatea con los participantes y comparte tus momentos.' },
              ].map((s) => (
                <div key={s.num} className="ln-timeline-step">
                  <div className="ln-timeline-dot">{s.num}</div>
                  <div className="ln-timeline-content">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CIUDADES — Chips ═══ */}
        <section className="ln-section" id="ciudades">
          <div className="ln-section-inner">
            <span className="ln-eyebrow">Ciudades</span>
            <h2 className="ln-section-title">Eventos deportivos<br />en tu ciudad</h2>
            <p className="ln-section-sub">Busca deporte social cerca de ti en las 50 provincias españolas.</p>
            <div className="ln-cities">
              {CITIES.map(([id, name]) => (
                <Link key={id} href={`/events?prov=${id}`} className="ln-chip">{name}</Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SEO/GEO ═══ */}
        <section className="ln-section ln-section-alt">
          <div className="ln-section-inner">
            <div className="ln-article">
              <h3>La app para organizar eventos deportivos y deporte social en España</h3>
              <p><strong>TeamUp</strong> (teamupapp.es) es la plataforma social deportiva gratuita en España para conectar deportistas cercanos: crea, busca y únete a eventos deportivos, partidos de pádel, fútbol 7, running, senderismo y entrenamientos en las 50 provincias españolas.</p>
              <p>¿Te falta pareja para el pádel? ¿Quieres un grupo de running por la mañana? ¿Buscas un once para el fútbol del finde? En TeamUp, cualquier persona puede publicar un evento con deporte, fecha, hora y lugar, y el resto de la comunidad se apunta con un toque. Es la forma más sencilla de <strong>hacer deporte y conocer gente nueva en tu zona</strong>.</p>
              <p>TeamUp funciona también para clubs, centros deportivos y empresas: crea torneos, ligas y quedadas recurrentes. Es una PWA: puedes instalarla en tu móvil y usarla como una app nativa.</p>
            </div>
          </div>
        </section>

        {/* ═══ FAQ — Clean list ═══ */}
        <section className="ln-section" id="faq">
          <div className="ln-section-inner">
            <span className="ln-eyebrow">FAQ</span>
            <h2 className="ln-section-title">Preguntas frecuentes</h2>
            <div className="ln-faq">
              {FAQ.map(([q, a]) => (
                <div key={q} className="ln-faq-item">
                  <p className="ln-faq-q">{q}</p>
                  <p className="ln-faq-a">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SPONSORS ═══ */}
        {sponsors.length > 0 && (
          <section className="ln-section ln-section-alt">
            <div className="ln-section-inner">
              <div className="ln-sponsor-label">Con la colaboración de</div>
              <div className="sponsors-ticker">
                <div className="sponsors-ticker__inner">
                  {Array.from({ length: 6 }).flatMap(() => sponsors).map((s, i) => (
                    s.website_url
                      ? <a key={i} href={s.website_url} target="_blank" rel="noopener noreferrer" className="sponsors-ticker__item" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                          {s.logo_url ? <img src={s.logo_url} alt={s.name} style={{ height: 36, maxWidth: 140, objectFit: 'contain', verticalAlign: 'middle', filter: 'var(--sponsor-filter)' }} /> : s.name}
                        </a>
                      : <span key={i} className="sponsors-ticker__item">
                          {s.logo_url ? <img src={s.logo_url} alt={s.name} style={{ height: 36, maxWidth: 140, objectFit: 'contain', verticalAlign: 'middle', filter: 'var(--sponsor-filter)' }} /> : s.name}
                        </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ CTA FINAL ═══ */}
        <section className="ln-section ln-cta-section">
          <div className="ln-section-inner ln-cta-inner">
            <span className="ln-eyebrow" style={{ color: 'var(--button-contrast)', opacity: 0.7 }}>Empieza hoy</span>
            <h2 className="ln-section-title" style={{ color: 'var(--button-contrast)' }}>¿Preparado para jugar?</h2>
            <p className="ln-section-sub" style={{ color: 'var(--button-contrast)', opacity: 0.8 }}>Crea tu cuenta gratis y encuentra tu primer evento en menos de un minuto.</p>
            <div className="ln-hero-cta" style={{ justifyContent: 'center' }}>
              <Link href="/start" className="ln-btn ln-btn-primary ln-btn-lg" style={{ background: 'var(--button-contrast)', color: 'var(--bg)' }}>
                Entrar a la app
                <span className="ln-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg></span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="ln-footer">
        <div className="ln-footer-inner">
          <div className="ln-logo" style={{ justifyContent: 'center', flex: 'none' }}>
            <LogoTeamUp height={24} />
          </div>
          <div className="ln-footer-links">
            <a href="#como">Cómo funciona</a>
            <a href="#features">Features</a>
            <a href="#ciudades">Ciudades</a>
            <a href="#faq">Preguntas</a>
            <Link href="/events">Explorar</Link>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
          <div className="ln-footer-copy">
            © 2026 TeamUp · <a href="mailto:colivasbon@gmail.com">colivasbon@gmail.com</a> · <Link href="/start">Entrar a la app</Link>
          </div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
    </div>
  )
}
