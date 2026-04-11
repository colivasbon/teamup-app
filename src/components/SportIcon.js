'use client'

// ─────────────────────────────────────────────────────────
// TeamUp — Iconos SVG propios para cada deporte
// Uso: <SportIcon sport="running" size={24} color="#586875" />
// ─────────────────────────────────────────────────────────

const PATHS = {
  running: ({ c }) => (
    // Figura corriendo — cuerpo inclinado hacia adelante
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="15" cy="4.5" r="2" fill={c} stroke="none"/>
      <path d="M12 7.5 L9.5 12 L6 13.5" />
      <path d="M12 7.5 L14 12 L17.5 10.5" />
      <path d="M9.5 12 L7.5 17.5 L10.5 20" />
      <path d="M14 12 L15.5 17.5 L13 20.5" />
    </g>
  ),

  padel: ({ c }) => (
    // Pala de pádel con pelota
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="9" height="12" rx="4.5" fill={c} fillOpacity="0.15"/>
      <rect x="6" y="3" width="9" height="12" rx="4.5"/>
      <line x1="10.5" y1="15" x2="8" y2="21"/>
      <circle cx="17" cy="19" r="2.2" fill={c} fillOpacity="0.3"/>
      <circle cx="17" cy="19" r="2.2"/>
    </g>
  ),

  senderismo: ({ c }) => (
    // Bota de montaña con perfil de montaña
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,18 8,8 12,13 16,5 21,18"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </g>
  ),

  futbol: ({ c }) => (
    // Balón de fútbol geométrico
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polygon points="12,5 14.5,8.5 12,12 9.5,8.5" fill={c} fillOpacity="0.25"/>
      <line x1="12" y1="5" x2="12" y2="3"/>
      <line x1="14.5" y1="8.5" x2="18" y2="7"/>
      <line x1="14.5" y1="8.5" x2="16.5" y2="12"/>
      <line x1="9.5" y1="8.5" x2="6" y2="7"/>
      <line x1="9.5" y1="8.5" x2="7.5" y2="12"/>
      <line x1="12" y1="12" x2="12" y2="15.5"/>
    </g>
  ),

  gimnasio: ({ c }) => (
    // Mancuerna / dumbbell
    <g fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="10" width="3" height="4" rx="1" fill={c} fillOpacity="0.3"/>
      <rect x="2" y="8.5" width="3" height="7" rx="1"/>
      <rect x="19" y="10" width="3" height="4" rx="1" fill={c} fillOpacity="0.3"/>
      <rect x="19" y="8.5" width="3" height="7" rx="1"/>
      <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2.5"/>
      <rect x="7" y="9" width="3" height="6" rx="1" fill={c} fillOpacity="0.2"/>
      <rect x="7" y="9" width="3" height="6" rx="1"/>
      <rect x="14" y="9" width="3" height="6" rx="1" fill={c} fillOpacity="0.2"/>
      <rect x="14" y="9" width="3" height="6" rx="1"/>
    </g>
  ),

  tenis: ({ c }) => (
    // Raqueta de tenis con pelota
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="11" cy="9" rx="6.5" ry="7.5" fill={c} fillOpacity="0.12"/>
      <ellipse cx="11" cy="9" rx="6.5" ry="7.5"/>
      <line x1="11" y1="2" x2="11" y2="16.5"/>
      <line x1="4.5" y1="9" x2="17.5" y2="9"/>
      <line x1="6" y1="4.5" x2="16" y2="13.5"/>
      <line x1="16" y1="4.5" x2="6" y2="13.5"/>
      <line x1="11" y1="16.5" x2="9.5" y2="22"/>
      <circle cx="20" cy="20" r="2" fill={c} fillOpacity="0.3"/>
      <circle cx="20" cy="20" r="2"/>
    </g>
  ),

  natacion: ({ c }) => (
    // Olas + figura nadando
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="5" r="2" fill={c} stroke="none"/>
      <path d="M2 11 Q5 9 8 11 Q11 13 14 11 Q17 9 20 11 Q22 12 22 12"/>
      <path d="M2 15 Q5 13 8 15 Q11 17 14 15 Q17 13 20 15 Q22 16 22 16"/>
      <path d="M8 11 L12 7 L17 7"/>
    </g>
  ),

  ciclismo: ({ c }) => (
    // Bicicleta minimalista
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="16" r="4.5"/>
      <circle cx="18" cy="16" r="4.5"/>
      <polyline points="6,16 9,9 13,9 18,16"/>
      <line x1="13" y1="9" x2="12" y2="16"/>
      <circle cx="13" cy="9" r="1.5" fill={c} stroke="none"/>
      <polyline points="9,9 11,5 14,5"/>
    </g>
  ),

  yoga: ({ c }) => (
    // Figura en postura de loto / meditación
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4.5" r="2" fill={c} fillOpacity="0.3"/>
      <circle cx="12" cy="4.5" r="2"/>
      <path d="M12 7 L12 13"/>
      <path d="M4 11 Q8 9 12 13 Q16 9 20 11"/>
      <path d="M7 18 Q9.5 14 12 13 Q14.5 14 17 18"/>
      <line x1="7" y1="18" x2="4" y2="20"/>
      <line x1="17" y1="18" x2="20" y2="20"/>
    </g>
  ),

  baloncesto: ({ c }) => (
    // Balón de baloncesto
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12 Q8 8 12 12 Q16 16 21 12"/>
      <path d="M12 3 Q8 8 12 12 Q16 16 12 21"/>
    </g>
  ),

  voleibol: ({ c }) => (
    // Balón de voleibol con líneas curvas
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M5 7 Q12 12 19 7"/>
      <path d="M3 14 Q9 10 12 21"/>
      <path d="M21 14 Q15 10 12 21"/>
    </g>
  ),

  badminton: ({ c }) => (
    // Raqueta de bádminton con volante
    <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="10" cy="8.5" rx="5.5" ry="6.5" fill={c} fillOpacity="0.12"/>
      <ellipse cx="10" cy="8.5" rx="5.5" ry="6.5"/>
      <line x1="10" y1="2.5" x2="10" y2="15"/>
      <line x1="4.5" y1="8.5" x2="15.5" y2="8.5"/>
      <line x1="10" y1="15" x2="14" y2="22"/>
      {/* Volante */}
      <circle cx="19" cy="18" r="1.5" fill={c} stroke="none"/>
      <path d="M17 15 L19 16.5"/>
      <path d="M19 15 L19 16.5"/>
      <path d="M21 15 L19 16.5"/>
    </g>
  ),
}

export function SportIcon({ sport, size = 24, color, className = '', style = {} }) {
  const c = color || 'currentColor'
  const S = PATHS[sport]
  if (!S) {
    // Fallback genérico: estrella / destello
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.12"/>
        <path d="M12 7l1.5 3.5 3.5 0.5-2.5 2.5 0.5 3.5L12 15.5l-3 1.5 0.5-3.5L7 11l3.5-0.5z" fill={c} stroke="none"/>
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
      <S c={c} />
    </svg>
  )
}

// Mapa de colores por deporte (exportado para usar en toda la app)
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

// Para usar en marcadores del mapa (SVG como string, sin JSX)
export function sportIconSVGString(sport, color = '#586875') {
  const svgs = {
    running:    `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="4.5" r="2" fill="${color}" stroke="none"/><path d="M12 7.5 L9.5 12 L6 13.5"/><path d="M12 7.5 L14 12 L17.5 10.5"/><path d="M9.5 12 L7.5 17.5 L10.5 20"/><path d="M14 12 L15.5 17.5 L13 20.5"/></g>`,
    padel:      `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="9" height="12" rx="4.5" fill="${color}" fill-opacity="0.25"/><rect x="6" y="3" width="9" height="12" rx="4.5"/><line x1="10.5" y1="15" x2="8" y2="21"/></g>`,
    senderismo: `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,18 8,8 12,13 16,5 21,18"/><line x1="3" y1="18" x2="21" y2="18"/></g>`,
    futbol:     `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="12,5 14.5,8.5 12,12 9.5,8.5" fill="${color}" fill-opacity="0.3"/></g>`,
    gimnasio:   `<g fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8.5" width="3" height="7" rx="1"/><rect x="19" y="8.5" width="3" height="7" rx="1"/><line x1="5" y1="12" x2="19" y2="12" stroke-width="2.5"/><rect x="7" y="9" width="3" height="6" rx="1"/><rect x="14" y="9" width="3" height="6" rx="1"/></g>`,
    tenis:      `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="11" cy="9" rx="6.5" ry="7.5" fill="${color}" fill-opacity="0.15"/><ellipse cx="11" cy="9" rx="6.5" ry="7.5"/><line x1="11" y1="2" x2="11" y2="16.5"/><line x1="4.5" y1="9" x2="17.5" y2="9"/><line x1="11" y1="16.5" x2="9.5" y2="22"/></g>`,
    natacion:   `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11 Q5 9 8 11 Q11 13 14 11 Q17 9 20 11 Q22 12 22 12"/><path d="M2 15 Q5 13 8 15 Q11 17 14 15 Q17 13 20 15 Q22 16 22 16"/><path d="M8 11 L12 7 L17 7"/><circle cx="17" cy="5" r="2" fill="${color}" stroke="none"/></g>`,
    ciclismo:   `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="16" r="4.5"/><circle cx="18" cy="16" r="4.5"/><polyline points="6,16 9,9 13,9 18,16"/><line x1="13" y1="9" x2="12" y2="16"/></g>`,
    yoga:       `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="2" fill="${color}" fill-opacity="0.3"/><circle cx="12" cy="4.5" r="2"/><path d="M12 7 L12 13"/><path d="M4 11 Q8 9 12 13 Q16 9 20 11"/><path d="M7 18 Q9.5 14 12 13 Q14.5 14 17 18"/></g>`,
    baloncesto: `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12 Q8 8 12 12 Q16 16 21 12"/><path d="M12 3 Q8 8 12 12 Q16 16 12 21"/></g>`,
    voleibol:   `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M5 7 Q12 12 19 7"/><path d="M3 14 Q9 10 12 21"/><path d="M21 14 Q15 10 12 21"/></g>`,
    badminton:  `<g fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="10" cy="8.5" rx="5.5" ry="6.5" fill="${color}" fill-opacity="0.15"/><ellipse cx="10" cy="8.5" rx="5.5" ry="6.5"/><line x1="10" y1="2.5" x2="10" y2="15"/><line x1="4.5" y1="8.5" x2="15.5" y2="8.5"/><line x1="10" y1="15" x2="14" y2="22"/></g>`,
  }
  return svgs[sport] || `<circle cx="12" cy="12" r="8" fill="${color}" fill-opacity="0.3"/><circle cx="12" cy="12" r="8" stroke="${color}" stroke-width="1.8" fill="none"/>`
}
