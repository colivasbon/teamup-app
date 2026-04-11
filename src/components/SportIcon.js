'use client'

// ─────────────────────────────────────────────────────────────────────────────
// TeamUp — Iconos SVG propios para cada deporte
// Diseñados a partir de referencias visuales de alta calidad
// Uso: <SportIcon sport="running" size={28} color="#586875" />
// ─────────────────────────────────────────────────────────────────────────────

const ICONS = {

  // Corredor en zancada — figura sólida con movimiento
  running: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Cabeza */}
      <circle cx="21" cy="5" r="3" fill={c}/>
      {/* Cuerpo inclinado hacia adelante */}
      <path d="M19 8 L14 15 L9 18" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Brazo adelante */}
      <path d="M17 10 L23 8" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Pierna delantera */}
      <path d="M14 15 L11 22 L15 27" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Pierna trasera */}
      <path d="M14 15 L18 20 L14 25" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Brazo atrás */}
      <path d="M14 12 L10 15" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),

  // Pala de pádel con bola — vista frontal con agujeros
  padel: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Cabeza de la pala — forma ovalada */}
      <ellipse cx="16" cy="12" rx="8" ry="9.5" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="2"/>
      {/* Agujeros de la pala */}
      <circle cx="13" cy="9" r="1.2" fill={c} opacity="0.5"/>
      <circle cx="19" cy="9" r="1.2" fill={c} opacity="0.5"/>
      <circle cx="13" cy="13" r="1.2" fill={c} opacity="0.5"/>
      <circle cx="19" cy="13" r="1.2" fill={c} opacity="0.5"/>
      <circle cx="16" cy="11" r="1.2" fill={c} opacity="0.5"/>
      {/* Mango */}
      <rect x="14" y="21" width="4" height="8" rx="2" fill={c}/>
      {/* Bola */}
      <circle cx="25" cy="8" r="3" fill={c} fillOpacity="0.25" stroke={c} strokeWidth="1.8"/>
      <path d="M23 7 Q25 6 27 8" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  ),

  // Senderismo — montaña con bota
  senderismo: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Montaña izquierda */}
      <path d="M2 26 L10 10 L15 18 L20 8 L30 26 Z" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      {/* Nieve en la cima */}
      <path d="M17.5 11 L20 8 L22.5 11 Z" fill={c} fillOpacity="0.5"/>
      {/* Línea del suelo */}
      <line x1="2" y1="26" x2="30" y2="26" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  // Balón de fútbol — hexágonos
  futbol: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke={c} strokeWidth="2" fill="none"/>
      {/* Pentágono central */}
      <polygon points="16,8 20.5,12 19,17.5 13,17.5 11.5,12" fill={c} fillOpacity="0.3" stroke={c} strokeWidth="1.5"/>
      {/* Líneas desde el pentágono hacia el borde */}
      <line x1="16" y1="8" x2="16" y2="3" stroke={c} strokeWidth="1.5"/>
      <line x1="20.5" y1="12" x2="27" y2="9" stroke={c} strokeWidth="1.5"/>
      <line x1="19" y1="17.5" x2="25" y2="22" stroke={c} strokeWidth="1.5"/>
      <line x1="13" y1="17.5" x2="7" y2="22" stroke={c} strokeWidth="1.5"/>
      <line x1="11.5" y1="12" x2="5" y2="9" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),

  // Mancuerna — pesos con barra
  gimnasio: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Barra central */}
      <rect x="10" y="14.5" width="12" height="3" rx="1.5" fill={c}/>
      {/* Peso izquierdo exterior */}
      <rect x="2" y="11" width="5" height="10" rx="2.5" fill={c}/>
      {/* Peso izquierdo interior */}
      <rect x="7" y="12.5" width="3" height="7" rx="1.5" fill={c} fillOpacity="0.7"/>
      {/* Peso derecho interior */}
      <rect x="22" y="12.5" width="3" height="7" rx="1.5" fill={c} fillOpacity="0.7"/>
      {/* Peso derecho exterior */}
      <rect x="25" y="11" width="5" height="10" rx="2.5" fill={c}/>
    </svg>
  ),

  // Raqueta de tenis con cuerdas
  tenis: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Cabeza de la raqueta */}
      <ellipse cx="17" cy="12" rx="9" ry="10" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="2"/>
      {/* Cuerdas verticales */}
      <line x1="14" y1="3" x2="14" y2="21" stroke={c} strokeWidth="1" opacity="0.6"/>
      <line x1="17" y1="2.5" x2="17" y2="21.5" stroke={c} strokeWidth="1" opacity="0.6"/>
      <line x1="20" y1="3" x2="20" y2="21" stroke={c} strokeWidth="1" opacity="0.6"/>
      {/* Cuerdas horizontales */}
      <line x1="9" y1="9" x2="25" y2="9" stroke={c} strokeWidth="1" opacity="0.6"/>
      <line x1="8" y1="13" x2="26" y2="13" stroke={c} strokeWidth="1" opacity="0.6"/>
      <line x1="9" y1="17" x2="25" y2="17" stroke={c} strokeWidth="1" opacity="0.6"/>
      {/* Mango */}
      <path d="M14 22 L10 30" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M9.5 29 L12 31" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  // Nadador con olas
  natacion: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Cabeza */}
      <circle cx="26" cy="8" r="3" fill={c}/>
      {/* Cuerpo nadando */}
      <path d="M24 11 L14 13 L6 11" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Brazo adelante */}
      <path d="M20 12 L28 15" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Piernas */}
      <path d="M6 11 L3 14 M6 11 L4 16" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Olas */}
      <path d="M2 21 Q6 18 10 21 Q14 24 18 21 Q22 18 26 21 Q28 22.5 30 21" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M2 26 Q6 23 10 26 Q14 29 18 26 Q22 23 26 26 Q28 27.5 30 26" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),

  // Bicicleta — vista lateral limpia
  ciclismo: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Rueda trasera */}
      <circle cx="8" cy="22" r="7" stroke={c} strokeWidth="2" fill="none"/>
      <circle cx="8" cy="22" r="2" fill={c}/>
      {/* Rueda delantera */}
      <circle cx="24" cy="22" r="7" stroke={c} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="22" r="2" fill={c}/>
      {/* Cuadro */}
      <path d="M8 22 L16 10 L24 22" stroke={c} strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
      <path d="M16 10 L16 22" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      {/* Manillar */}
      <path d="M19 10 L24 10 M22 8 L24 10 L22 12" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Sillín */}
      <path d="M13 10 L19 10" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      {/* Pedal */}
      <circle cx="16" cy="18" r="2.5" stroke={c} strokeWidth="1.8" fill="none"/>
    </svg>
  ),

  // Yoga — postura loto, figura serena
  yoga: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Cabeza */}
      <circle cx="16" cy="5" r="3.5" fill={c}/>
      {/* Torso */}
      <path d="M16 9 L16 18" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Brazos abiertos horizontal */}
      <path d="M6 14 L16 16 L26 14" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Manos en mudra */}
      <circle cx="6" cy="14" r="1.5" fill={c}/>
      <circle cx="26" cy="14" r="1.5" fill={c}/>
      {/* Piernas cruzadas */}
      <path d="M16 18 Q10 20 8 26" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M16 18 Q22 20 24 26" stroke={c} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Pies */}
      <ellipse cx="8" cy="27" rx="3" ry="2" fill={c} fillOpacity="0.4"/>
      <ellipse cx="24" cy="27" rx="3" ry="2" fill={c} fillOpacity="0.4"/>
    </svg>
  ),

  // Baloncesto — balón con líneas características
  baloncesto: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="2"/>
      {/* Línea vertical central */}
      <line x1="16" y1="3" x2="16" y2="29" stroke={c} strokeWidth="2"/>
      {/* Línea horizontal */}
      <line x1="3" y1="16" x2="29" y2="16" stroke={c} strokeWidth="2"/>
      {/* Curva superior izquierda */}
      <path d="M5 8 Q11 12 11 16" stroke={c} strokeWidth="2" fill="none"/>
      {/* Curva inferior izquierda */}
      <path d="M5 24 Q11 20 11 16" stroke={c} strokeWidth="2" fill="none"/>
      {/* Curva superior derecha */}
      <path d="M27 8 Q21 12 21 16" stroke={c} strokeWidth="2" fill="none"/>
      {/* Curva inferior derecha */}
      <path d="M27 24 Q21 20 21 16" stroke={c} strokeWidth="2" fill="none"/>
    </svg>
  ),

  // Voleibol — balón con costuras
  voleibol: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill={c} fillOpacity="0.12" stroke={c} strokeWidth="2"/>
      {/* Costura superior */}
      <path d="M4 10 Q10 14 16 10 Q22 6 28 10" stroke={c} strokeWidth="2" fill="none"/>
      {/* Costura izquierda */}
      <path d="M4 10 Q6 18 4 26" stroke={c} strokeWidth="2" fill="none"/>
      {/* Costura derecha */}
      <path d="M28 10 Q30 18 28 26" stroke={c} strokeWidth="2" fill="none"/>
      {/* Costura inferior */}
      <path d="M4 26 Q10 22 16 26 Q22 30 28 26" stroke={c} strokeWidth="2" fill="none"/>
    </svg>
  ),

  // Bádminton — volante icónico
  badminton: ({ c, s }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      {/* Base del volante */}
      <circle cx="16" cy="24" r="4.5" fill={c} fillOpacity="0.25" stroke={c} strokeWidth="2"/>
      {/* Plumas — 6 líneas que forman el cono */}
      <path d="M16 20 L10 5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 20 L13 4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 20 L16 3.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 20 L19 4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 20 L22 5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 20 L25 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Aro de las plumas */}
      <ellipse cx="16" cy="7" rx="7" ry="3" fill="none" stroke={c} strokeWidth="1.8"/>
    </svg>
  ),
}

export function SportIcon({ sport, size = 28, color }) {
  const c = color || 'currentColor'
  const Icon = ICONS[sport]
  if (!Icon) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.12"/>
      <path d="M16 10 L18.5 14.5 L23.5 15.5 L20 19 L20.5 24 L16 21.5 L11.5 24 L12 19 L8.5 15.5 L13.5 14.5 Z" fill={c} stroke="none"/>
    </svg>
  )
  return <Icon c={c} s={size} />
}

// Colores oficiales por deporte
export const SPORT_COLORS = {
  running:    '#5b6ef5',
  padel:      '#06d6a0',
  senderismo: '#f59e0b',
  futbol:     '#ef4444',
  gimnasio:   '#8b5cf6',
  tenis:      '#fbbf24',
  natacion:   '#0ea5e9',
  ciclismo:   '#f97316',
  yoga:       '#ec4899',
  baloncesto: '#f59e0b',
  voleibol:   '#06d6a0',
  badminton:  '#8b5cf6',
}

export const SPORT_LABELS = {
  running:    'Running',
  padel:      'Pádel',
  senderismo: 'Senderismo',
  futbol:     'Fútbol',
  gimnasio:   'Gimnasio',
  tenis:      'Tenis',
  natacion:   'Natación',
  ciclismo:   'Ciclismo',
  yoga:       'Yoga',
  baloncesto: 'Baloncesto',
  voleibol:   'Voleibol',
  badminton:  'Bádminton',
}

// SVG como string para marcadores de Leaflet (si se usan en el futuro)
export function sportIconSVGString(sport, color = '#586875') {
  const map = {
    running:    `<circle cx="21" cy="5" r="3" fill="${color}"/><path d="M19 8 L14 15 L9 18" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M17 10 L23 8" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/><path d="M14 15 L11 22 L15 27" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M14 15 L18 20 L14 25" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    padel:      `<ellipse cx="16" cy="12" rx="8" ry="9.5" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/><rect x="14" y="21" width="4" height="8" rx="2" fill="${color}"/><circle cx="25" cy="8" r="3" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.8"/>`,
    senderismo: `<path d="M2 26 L10 10 L15 18 L20 8 L30 26 Z" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`,
    futbol:     `<circle cx="16" cy="16" r="13" stroke="${color}" stroke-width="2" fill="none"/><polygon points="16,8 20.5,12 19,17.5 13,17.5 11.5,12" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.5"/>`,
    gimnasio:   `<rect x="2" y="11" width="5" height="10" rx="2.5" fill="${color}"/><rect x="25" y="11" width="5" height="10" rx="2.5" fill="${color}"/><rect x="10" y="14.5" width="12" height="3" rx="1.5" fill="${color}"/>`,
    tenis:      `<ellipse cx="17" cy="12" rx="9" ry="10" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-width="2"/><line x1="17" y1="2.5" x2="17" y2="21.5" stroke="${color}" stroke-width="1"/><line x1="8" y1="13" x2="26" y2="13" stroke="${color}" stroke-width="1"/><path d="M14 22 L10 30" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`,
    natacion:   `<circle cx="26" cy="8" r="3" fill="${color}"/><path d="M24 11 L14 13 L6 11" stroke="${color}" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M2 21 Q6 18 10 21 Q14 24 18 21 Q22 18 26 21" stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none"/>`,
    ciclismo:   `<circle cx="8" cy="22" r="7" stroke="${color}" stroke-width="2" fill="none"/><circle cx="24" cy="22" r="7" stroke="${color}" stroke-width="2" fill="none"/><path d="M8 22 L16 10 L24 22" stroke="${color}" stroke-width="2.2" fill="none"/><path d="M16 10 L16 22" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`,
    yoga:       `<circle cx="16" cy="5" r="3.5" fill="${color}"/><path d="M16 9 L16 18" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/><path d="M6 14 L16 16 L26 14" stroke="${color}" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M16 18 Q10 20 8 26" stroke="${color}" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M16 18 Q22 20 24 26" stroke="${color}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`,
    baloncesto: `<circle cx="16" cy="16" r="13" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="2"/><line x1="16" y1="3" x2="16" y2="29" stroke="${color}" stroke-width="2"/><line x1="3" y1="16" x2="29" y2="16" stroke="${color}" stroke-width="2"/><path d="M5 8 Q11 12 11 16" stroke="${color}" stroke-width="2" fill="none"/><path d="M27 8 Q21 12 21 16" stroke="${color}" stroke-width="2" fill="none"/>`,
    voleibol:   `<circle cx="16" cy="16" r="13" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="2"/><path d="M4 10 Q10 14 16 10 Q22 6 28 10" stroke="${color}" stroke-width="2" fill="none"/><path d="M4 26 Q10 22 16 26 Q22 30 28 26" stroke="${color}" stroke-width="2" fill="none"/>`,
    badminton:  `<circle cx="16" cy="24" r="4.5" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2"/><path d="M16 20 L10 5" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/><path d="M16 20 L16 3.5" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/><path d="M16 20 L22 5" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="16" cy="7" rx="7" ry="3" fill="none" stroke="${color}" stroke-width="1.8"/>`,
  }
  return map[sport] || `<circle cx="16" cy="16" r="12" stroke="${color}" stroke-width="2" fill="${color}" fill-opacity="0.12"/>`
}
