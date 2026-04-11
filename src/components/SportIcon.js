'use client'

// ─────────────────────────────────────────────────────────────────────────────
// TeamUp — Iconos SVG propios para cada deporte
// Estilo: flat moderno con 2-3 colores, trazo limpio, sin gradientes complejos
// Uso: <SportIcon sport="running" size={48} />
// ─────────────────────────────────────────────────────────────────────────────

// Paleta por deporte — color primario y secundario
const PALETTES = {
  running:    { a:'#4f6ef7', b:'#c7d0ff', c:'#ff6b35' },
  padel:      { a:'#00b894', b:'#81ecec', c:'#fdcb6e' },
  senderismo: { a:'#e17055', b:'#fab1a0', c:'#55efc4' },
  futbol:     { a:'#2d3436', b:'#636e72', c:'#6c5ce7' },
  gimnasio:   { a:'#6c5ce7', b:'#a29bfe', c:'#fd79a8' },
  tenis:      { a:'#fdcb6e', b:'#ffeaa7', c:'#00b894' },
  natacion:   { a:'#0984e3', b:'#74b9ff', c:'#dfe6e9' },
  ciclismo:   { a:'#e17055', b:'#fab1a0', c:'#2d3436' },
  yoga:       { a:'#fd79a8', b:'#fdafd8', c:'#a29bfe' },
  baloncesto: { a:'#e17055', b:'#fab1a0', c:'#2d3436' },
  voleibol:   { a:'#0984e3', b:'#74b9ff', c:'#dfe6e9' },
  badminton:  { a:'#00b894', b:'#81ecec', c:'#fdcb6e' },
}

function Running({ s }) {
  const { a, b, c } = PALETTES.running
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Sombra/pista */}
      <ellipse cx="24" cy="44" rx="18" ry="3" fill={a} opacity="0.15"/>
      {/* Zapatilla */}
      <path d="M8 30 Q12 26 20 27 L32 25 Q38 24 40 27 L40 30 Q40 33 36 34 L12 34 Q8 33 8 30Z" fill={a}/>
      <path d="M8 30 L40 30" stroke={b} strokeWidth="1"/>
      {/* Suela */}
      <path d="M10 34 Q12 36 20 36 L36 36 Q40 36 40 33 L40 34 Q40 37 36 38 L12 38 Q8 37 10 34Z" fill={c}/>
      {/* Cordones */}
      <path d="M16 27 L14 30 M20 26 L19 30 M24 25.5 L24 30 M28 25.5 L29 30 M32 26 L33 29" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Lengüeta */}
      <path d="M18 26 Q20 22 22 27" fill={b} stroke={b} strokeWidth="0.5"/>
      {/* Figura corriendo */}
      <circle cx="30" cy="12" r="4" fill={a}/>
      <path d="M29 16 L25 22 M31 16 L34 21" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M25 22 L22 28 M25 22 L28 28" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M27 18 L22 16 M31 17 L36 16" stroke={a} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function Padel({ s }) {
  const { a, b, c } = PALETTES.padel
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Pala */}
      <ellipse cx="20" cy="18" rx="13" ry="15" fill={b} stroke={a} strokeWidth="2.5"/>
      {/* Banda de la pala */}
      <ellipse cx="20" cy="18" rx="10" ry="12" fill="white" opacity="0.6"/>
      {/* Agujeros */}
      {[
        [17,13],[21,13],[25,13],
        [15,17],[19,17],[23,17],[27,17],
        [17,21],[21,21],[25,21],
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={a}/>
      ))}
      {/* Mango */}
      <rect x="17" y="32" width="6" height="12" rx="3" fill={a}/>
      <rect x="18.5" y="33" width="3" height="10" rx="1.5" fill={b} opacity="0.5"/>
      {/* Bola */}
      <circle cx="38" cy="12" r="6" fill={c} stroke="#f1c40f" strokeWidth="1"/>
      <path d="M36 9 Q38 11 36 14" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M40 9 Q38 11 40 14" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function Senderismo({ s }) {
  const { a, b, c } = PALETTES.senderismo
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Montaña de fondo */}
      <path d="M4 40 L16 16 L24 28 L32 10 L44 40Z" fill={b} opacity="0.6"/>
      {/* Montaña delantera */}
      <path d="M4 40 L16 16 L28 40Z" fill={a}/>
      {/* Nieve */}
      <path d="M14 20 L16 16 L18 20Z" fill="white"/>
      {/* Segunda montaña */}
      <path d="M24 40 L32 10 L44 40Z" fill={a} opacity="0.75"/>
      <path d="M30 14 L32 10 L34 14Z" fill="white"/>
      {/* Sol */}
      <circle cx="40" cy="10" r="5" fill={c}/>
      {/* Línea suelo */}
      <line x1="4" y1="40" x2="44" y2="40" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function Futbol({ s }) {
  const { a, b, c } = PALETTES.futbol
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Sombra */}
      <ellipse cx="24" cy="45" rx="14" ry="2.5" fill={a} opacity="0.2"/>
      {/* Balón */}
      <circle cx="24" cy="24" r="19" fill="white" stroke={a} strokeWidth="1.5"/>
      {/* Parches negros */}
      <polygon points="24,8 29,14 24,20 19,14" fill={a}/>
      <polygon points="38,17 36,24 30,24 27,18 31,13" fill={a}/>
      <polygon points="36,32 30,36 26,31 29,25 35,25" fill={a}/>
      <polygon points="24,40 19,35 22,29 30,29 33,35" fill={a}/>
      <polygon points="12,32 9,25 13,20 19,22 20,29" fill={a}/>
      <polygon points="13,17 17,12 22,16 20,23 14,23" fill={a}/>
      {/* Costura */}
      <circle cx="24" cy="24" r="19" stroke={b} strokeWidth="0.8" fill="none" opacity="0.3"/>
    </svg>
  )
}

function Gimnasio({ s }) {
  const { a, b, c } = PALETTES.gimnasio
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Sombra */}
      <ellipse cx="24" cy="45" rx="18" ry="2" fill={a} opacity="0.15"/>
      {/* Peso izquierdo */}
      <rect x="2" y="18" width="8" height="12" rx="4" fill={a}/>
      <rect x="2" y="20" width="8" height="8" rx="2" fill={c}/>
      {/* Barra izquierda */}
      <rect x="10" y="21" width="8" height="6" rx="3" fill={b}/>
      {/* Centro */}
      <rect x="18" y="20" width="12" height="8" rx="4" fill={a}/>
      {/* Barra derecha */}
      <rect x="30" y="21" width="8" height="6" rx="3" fill={b}/>
      {/* Peso derecho */}
      <rect x="38" y="18" width="8" height="12" rx="4" fill={a}/>
      <rect x="38" y="20" width="8" height="8" rx="2" fill={c}/>
      {/* Brillo */}
      <rect x="3" y="19" width="6" height="3" rx="1.5" fill="white" opacity="0.3"/>
      <rect x="39" y="19" width="6" height="3" rx="1.5" fill="white" opacity="0.3"/>
    </svg>
  )
}

function Tenis({ s }) {
  const { a, b, c } = PALETTES.tenis
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Cabeza de la raqueta */}
      <ellipse cx="21" cy="19" rx="14" ry="16" fill={b} stroke={a} strokeWidth="2.5"/>
      {/* Cuerdas */}
      <ellipse cx="21" cy="19" rx="11" ry="13" fill="none" stroke={a} strokeWidth="0.8" opacity="0.3"/>
      <line x1="16" y1="6.5" x2="16" y2="31.5" stroke={a} strokeWidth="1" opacity="0.7"/>
      <line x1="21" y1="5.5" x2="21" y2="32.5" stroke={a} strokeWidth="1" opacity="0.7"/>
      <line x1="26" y1="6.5" x2="26" y2="31.5" stroke={a} strokeWidth="1" opacity="0.7"/>
      <line x1="10" y1="15" x2="32" y2="15" stroke={a} strokeWidth="1" opacity="0.7"/>
      <line x1="9" y1="19" x2="33" y2="19" stroke={a} strokeWidth="1" opacity="0.7"/>
      <line x1="10" y1="23" x2="32" y2="23" stroke={a} strokeWidth="1" opacity="0.7"/>
      {/* Mango */}
      <rect x="18" y="34" width="6" height="11" rx="3" fill={a}/>
      <rect x="19.5" y="35.5" width="3" height="8" rx="1.5" fill={b} opacity="0.6"/>
      {/* Bola */}
      <circle cx="38" cy="10" r="7" fill={a}/>
      <path d="M35 7 Q38 10 35 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M41 7 Q38 10 41 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function Natacion({ s }) {
  const { a, b, c } = PALETTES.natacion
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Agua de fondo */}
      <rect x="0" y="28" width="48" height="20" rx="4" fill={b} opacity="0.4"/>
      {/* Olas */}
      <path d="M2 32 Q8 28 14 32 Q20 36 26 32 Q32 28 38 32 Q44 36 46 32" stroke={a} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M2 38 Q8 34 14 38 Q20 42 26 38 Q32 34 38 38 Q44 42 46 38" stroke={a} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* Nadador */}
      <circle cx="36" cy="20" r="5" fill={a}/>
      {/* Gorro */}
      <path d="M32 18 Q36 13 40 18" fill={c} stroke={c} strokeWidth="1"/>
      {/* Gafas */}
      <ellipse cx="34" cy="20" rx="2.5" ry="2" fill="none" stroke="white" strokeWidth="1.2"/>
      <ellipse cx="39" cy="20" rx="2.5" ry="2" fill="none" stroke="white" strokeWidth="1.2"/>
      <line x1="36.5" y1="20" x2="36.5" y2="20" stroke="white" strokeWidth="1.5"/>
      {/* Cuerpo */}
      <path d="M32 24 L14 22 L8 20" stroke={a} strokeWidth="3" strokeLinecap="round"/>
      {/* Brazo adelante */}
      <path d="M30 22 L20 18 L14 22" stroke={a} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

function Ciclismo({ s }) {
  const { a, b, c } = PALETTES.ciclismo
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Rueda trasera */}
      <circle cx="12" cy="32" r="11" fill="none" stroke={c} strokeWidth="3"/>
      <circle cx="12" cy="32" r="4" fill={c}/>
      {[0,60,120,180,240,300].map((angle,i) => {
        const rad = angle * Math.PI / 180
        return <line key={i} x1={12} y1={32} x2={12+7*Math.cos(rad)} y2={32+7*Math.sin(rad)} stroke={c} strokeWidth="1.5"/>
      })}
      {/* Rueda delantera */}
      <circle cx="36" cy="32" r="11" fill="none" stroke={a} strokeWidth="3"/>
      <circle cx="36" cy="32" r="4" fill={a}/>
      {[0,60,120,180,240,300].map((angle,i) => {
        const rad = angle * Math.PI / 180
        return <line key={i} x1={36} y1={32} x2={36+7*Math.cos(rad)} y2={32+7*Math.sin(rad)} stroke={a} strokeWidth="1.5"/>
      })}
      {/* Cuadro */}
      <path d="M12 32 L22 14 L36 32" stroke={b} strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      <path d="M22 14 L22 32" stroke={b} strokeWidth="2" strokeLinecap="round"/>
      {/* Manillar */}
      <path d="M28 14 L36 14" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M36 12 L36 17" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Sillín */}
      <path d="M19 14 L25 14" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="14" x2="22" y2="17" stroke={c} strokeWidth="1.5"/>
      {/* Casco ciclista */}
      <circle cx="26" cy="8" r="4" fill={a}/>
      <path d="M22 9 Q26 4 30 9" fill={b} stroke={b} strokeWidth="0.5"/>
    </svg>
  )
}

function Yoga({ s }) {
  const { a, b, c } = PALETTES.yoga
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Aura/círculo de fondo */}
      <circle cx="24" cy="26" r="18" fill={b} opacity="0.3"/>
      {/* Esterilla */}
      <rect x="6" y="38" width="36" height="5" rx="2.5" fill={c} opacity="0.5"/>
      <rect x="6" y="38" width="36" height="2" rx="1" fill={c} opacity="0.3"/>
      {/* Figura sentada en loto */}
      <circle cx="24" cy="12" r="5" fill={a}/>
      {/* Pelo */}
      <path d="M20 10 Q24 6 28 10" fill={c} stroke={c} strokeWidth="0.5"/>
      {/* Torso */}
      <path d="M24 17 L24 28" stroke={a} strokeWidth="3" strokeLinecap="round"/>
      {/* Brazos horizontal - mudra */}
      <path d="M8 22 L24 24 L40 22" stroke={a} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Manos */}
      <circle cx="8" cy="22" r="2.5" fill={b}/>
      <circle cx="40" cy="22" r="2.5" fill={b}/>
      {/* Piernas en loto */}
      <path d="M24 28 Q16 30 12 38" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 28 Q32 30 36 38" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Puntos de chakra */}
      <circle cx="24" cy="20" r="1.5" fill={c}/>
      <circle cx="24" cy="24" r="1.5" fill={c}/>
    </svg>
  )
}

function Baloncesto({ s }) {
  const { a, b, c } = PALETTES.baloncesto
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Sombra */}
      <ellipse cx="24" cy="45" rx="14" ry="2.5" fill={a} opacity="0.2"/>
      {/* Balón */}
      <circle cx="24" cy="24" r="19" fill={a}/>
      {/* Brillo */}
      <ellipse cx="18" cy="14" rx="5" ry="4" fill="white" opacity="0.25" transform="rotate(-20 18 14)"/>
      {/* Líneas del balón */}
      <line x1="24" y1="5" x2="24" y2="43" stroke={c} strokeWidth="2"/>
      <line x1="5" y1="24" x2="43" y2="24" stroke={c} strokeWidth="2"/>
      <path d="M8 13 Q18 18 18 24" stroke={c} strokeWidth="2" fill="none"/>
      <path d="M8 35 Q18 30 18 24" stroke={c} strokeWidth="2" fill="none"/>
      <path d="M40 13 Q30 18 30 24" stroke={c} strokeWidth="2" fill="none"/>
      <path d="M40 35 Q30 30 30 24" stroke={c} strokeWidth="2" fill="none"/>
      <circle cx="24" cy="24" r="19" stroke={b} strokeWidth="1" fill="none" opacity="0.4"/>
    </svg>
  )
}

function Voleibol({ s }) {
  const { a, b, c } = PALETTES.voleibol
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Sombra */}
      <ellipse cx="24" cy="45" rx="14" ry="2.5" fill={a} opacity="0.2"/>
      {/* Balón base blanco */}
      <circle cx="24" cy="24" r="19" fill="white" stroke={a} strokeWidth="1.5"/>
      {/* Paneles azules */}
      <path d="M24 5 Q34 8 38 16 Q30 14 24 20 Q18 14 14 16 Q16 8 24 5Z" fill={a}/>
      <path d="M38 16 Q43 24 38 32 Q33 28 30 24 Q34 20 38 16Z" fill={a}/>
      <path d="M38 32 Q34 40 24 43 Q24 36 24 30 Q30 28 38 32Z" fill={a}/>
      <path d="M24 43 Q14 40 10 32 Q18 28 24 30 Q24 36 24 43Z" fill={b}/>
      <path d="M10 32 Q5 24 10 16 Q14 20 18 24 Q14 28 10 32Z" fill={b}/>
      <path d="M10 16 Q14 8 24 5 Q24 12 24 20 Q18 14 10 16Z" fill={b}/>
      <circle cx="24" cy="24" r="19" stroke={a} strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

function Badminton({ s }) {
  const { a, b, c } = PALETTES.badminton
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      {/* Base del volante */}
      <ellipse cx="24" cy="38" rx="7" ry="5" fill={c} stroke="#f1c40f" strokeWidth="1.5"/>
      <ellipse cx="24" cy="38" rx="4.5" ry="3" fill={c} opacity="0.7"/>
      {/* Cañas de las plumas */}
      {[
        [24,34,16,8], [24,34,19,5], [24,34,24,4],
        [24,34,29,5], [24,34,32,8], [24,34,35,12],
        [24,34,13,12],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      ))}
      {/* Plumas — elipses redondeadas */}
      <ellipse cx="16" cy="11" rx="4" ry="7" fill={b} stroke={a} strokeWidth="1.2" transform="rotate(-25 16 11)"/>
      <ellipse cx="20" cy="7" rx="4" ry="7" fill={b} stroke={a} strokeWidth="1.2" transform="rotate(-10 20 7)"/>
      <ellipse cx="24" cy="6" rx="4" ry="7" fill={b} stroke={a} strokeWidth="1.2"/>
      <ellipse cx="28" cy="7" rx="4" ry="7" fill={b} stroke={a} strokeWidth="1.2" transform="rotate(10 28 7)"/>
      <ellipse cx="32" cy="11" rx="4" ry="7" fill={b} stroke={a} strokeWidth="1.2" transform="rotate(25 32 11)"/>
      {/* Aro de las plumas */}
      <path d="M12 15 Q16 8 24 6 Q32 8 36 15" stroke={a} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

const ICONS = {
  running: Running, padel: Padel, senderismo: Senderismo,
  futbol: Futbol, gimnasio: Gimnasio, tenis: Tenis,
  natacion: Natacion, ciclismo: Ciclismo, yoga: Yoga,
  baloncesto: Baloncesto, voleibol: Voleibol, badminton: Badminton,
}

export function SportIcon({ sport, size = 48 }) {
  const Icon = ICONS[sport]
  if (!Icon) return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#586875" fillOpacity="0.2"/>
      <text x="24" y="30" textAnchor="middle" fontSize="20">🎯</text>
    </svg>
  )
  return <Icon s={size} />
}

// Compatibilidad con código existente
export const SPORT_COLORS = {
  running:'#4f6ef7', padel:'#00b894', senderismo:'#e17055',
  futbol:'#2d3436', gimnasio:'#6c5ce7', tenis:'#fdcb6e',
  natacion:'#0984e3', ciclismo:'#e17055', yoga:'#fd79a8',
  baloncesto:'#e17055', voleibol:'#0984e3', badminton:'#00b894',
}

export const SPORT_LABELS = {
  running:'Running', padel:'Pádel', senderismo:'Senderismo', futbol:'Fútbol',
  gimnasio:'Gimnasio', tenis:'Tenis', natacion:'Natación', ciclismo:'Ciclismo',
  yoga:'Yoga', baloncesto:'Baloncesto', voleibol:'Voleibol', badminton:'Bádminton',
}

export function sportIconSVGString(sport, color = '#586875') {
  return `<circle cx="16" cy="16" r="14" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>`
}
