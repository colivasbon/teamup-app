// sportConfig.js — Fuente única de verdad para deportes: emojis, colores, labels, iconos Phosphor.
// Módulo sin 'use client' para poder usarse desde server components (landing, sitemaps).

// ─── SKIN TONES ──────────────────────────────────────
export const SKIN_TONES = [
  { id: 'default', label: 'Amarillo',     modifier: '',           color: '#FFCC22' },
  { id: 'light',   label: 'Muy claro',    modifier: '\u{1F3FB}', color: '#FDDBB4' },
  { id: 'medium-light', label: 'Claro',   modifier: '\u{1F3FC}', color: '#E8B88A' },
  { id: 'medium',  label: 'Medio',        modifier: '\u{1F3FD}', color: '#C68642' },
  { id: 'medium-dark', label: 'Oscuro medio', modifier: '\u{1F3FE}', color: '#8D5524' },
  { id: 'dark',    label: 'Oscuro',       modifier: '\u{1F3FF}', color: '#4A2912' },
]

// ─── EMOJIS (fallback para Canvas / contextos sin SVG) ──
const PERSON_EMOJIS = {
  running:  '🏃',
  gimnasio: '💪',
  natacion: '🏊',
  ciclismo: '🚴',
  yoga:     '🧘',
}

const OBJECT_EMOJIS = {
  padel:      '🎾',
  senderismo: '🥾',
  futbol:     '⚽',
  tenis:      '🎾',
  baloncesto: '🏀',
  voleibol:   '🏐',
  badminton:  '🏸',
}

export function applyTone(emoji, toneId) {
  if (!toneId || toneId === 'default') return emoji
  const tone = SKIN_TONES.find(t => t.id === toneId)
  return tone ? emoji + tone.modifier : emoji
}

export function getSportEmoji(sport, toneId = 'default') {
  const isPerson = !!PERSON_EMOJIS[sport]
  const base = PERSON_EMOJIS[sport] || OBJECT_EMOJIS[sport] || '🎯'
  return isPerson ? applyTone(base, toneId) : base
}

// ─── COLORES (fuente única — elimina duplicados en 5+ archivos) ──
export const SPORT_COLORS = {
  running:'#5b6ef5', padel:'#2d9e7a', senderismo:'#f59e0b', futbol:'#ef4444',
  gimnasio:'#8b5cf6', tenis:'#fbbf24', natacion:'#0ea5e9', ciclismo:'#f97316',
  yoga:'#ec4899', baloncesto:'#f59e0b', voleibol:'#1a8c6e', badminton:'#8b5cf6',
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function adjustLightness(hex, amount) {
  const normalized = hex.replace('#', '')
  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  const newR = clamp(r + amount, 0, 255)
  const newG = clamp(g + amount, 0, 255)
  const newB = clamp(b + amount, 0, 255)
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`
}

export function getSportColor(sport, theme = 'dark') {
  const base = SPORT_COLORS[sport] || '#586875'
  return theme === 'light' ? adjustLightness(base, -12) : adjustLightness(base, 12)
}

// ─── LABELS ──────────────────────────────────────────
export const SPORT_LABELS = {
  running:'Running', padel:'Pádel', senderismo:'Senderismo', futbol:'Fútbol',
  gimnasio:'Gimnasio', tenis:'Tenis', natacion:'Natación', ciclismo:'Ciclismo',
  yoga:'Yoga', baloncesto:'Baloncesto', voleibol:'Voleibol', badminton:'Bádminton',
}

// ─── ICONOS PHOSPHOR (nombre del componente) ─────────
// El componente SportIcon importa dinámicamente desde @phosphor-icons/react
export const SPORT_PHOSPHOR_ICONS = {
  running:    'PersonSimpleRun',
  padel:      'TennisBall',
  senderismo: 'PersonSimpleHike',
  futbol:     'SoccerBall',
  gimnasio:   'Dumbbell',
  tenis:      'TennisBall',
  natacion:   'SwimmingPool',
  ciclismo:   'Bicycle',
  yoga:       'Yoga',
  baloncesto: 'Basketball',
  voleibol:   'Volleyball',
  badminton:  'Racket',
}

// ─── LISTA COMPLETA DE DEPORTES ──────────────────────
export const SPORTS_LIST = Object.keys(SPORT_LABELS)

// ─── MAPA UNIFICADO (reemplaza SPORT_ICONS / S_ICONS en otros archivos) ──
export const SPORT_MAP = Object.fromEntries(
  SPORTS_LIST.map(sport => [
    sport,
    {
      label: SPORT_LABELS[sport],
      emoji: getSportEmoji(sport),
      color: SPORT_COLORS[sport],
      phosphorIcon: SPORT_PHOSPHOR_ICONS[sport],
    },
  ])
)
