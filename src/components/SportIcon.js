'use client'

import { useAuth } from '@/contexts/AuthContext'

// Modificadores de tono de piel Unicode
export const SKIN_TONES = [
  { id: 'default', label: 'Amarillo',     modifier: '',           color: '#FFCC22' },
  { id: 'light',   label: 'Muy claro',    modifier: '\u{1F3FB}', color: '#FDDBB4' },
  { id: 'medium-light', label: 'Claro',   modifier: '\u{1F3FC}', color: '#E8B88A' },
  { id: 'medium',  label: 'Medio',        modifier: '\u{1F3FD}', color: '#C68642' },
  { id: 'medium-dark', label: 'Oscuro medio', modifier: '\u{1F3FE}', color: '#8D5524' },
  { id: 'dark',    label: 'Oscuro',       modifier: '\u{1F3FF}', color: '#4A2912' },
]

// Emojis de PERSONAS — soportan modificador de tono de piel
const PERSON_EMOJIS = {
  running:  '🏃',
  gimnasio: '💪',
  natacion: '🏊',
  ciclismo: '🚴',
  yoga:     '🧘',
}

// Emojis de OBJETOS — no tienen variante de tono
const OBJECT_EMOJIS = {
  padel:      '🎾',
  senderismo: '🥾',
  futbol:     '⚽',
  tenis:      '🎾',
  baloncesto: '🏀',
  voleibol:   '🏐',
  badminton:  '🏸',
}

// Aplicar el modificador de tono al emoji si es de persona
function applyTone(emoji, toneId) {
  if (!toneId || toneId === 'default') return emoji
  const tone = SKIN_TONES.find(t => t.id === toneId)
  return tone ? emoji + tone.modifier : emoji
}

// Componente principal
export function SportIcon({ sport, size = 28, toneOverride }) {
  // Intentar leer el tono del perfil del usuario
  let tone = toneOverride || 'default'
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { profile } = useAuth()
    if (!toneOverride) tone = profile?.skin_tone || 'default'
  } catch(_) {}

  const isPerson = !!PERSON_EMOJIS[sport]
  const baseEmoji = PERSON_EMOJIS[sport] || OBJECT_EMOJIS[sport] || '🎯'
  const emoji = isPerson ? applyTone(baseEmoji, tone) : baseEmoji

  return (
    <span style={{ fontSize: size * 0.72, lineHeight: 1, display: 'block', textAlign: 'center' }}>
      {emoji}
    </span>
  )
}

// Versión sin hook (para usar fuera de componentes React, e.g. en strings)
export function getSportEmoji(sport, toneId = 'default') {
  const isPerson = !!PERSON_EMOJIS[sport]
  const base = PERSON_EMOJIS[sport] || OBJECT_EMOJIS[sport] || '🎯'
  return isPerson ? applyTone(base, toneId) : base
}

export const SPORT_COLORS = {
  running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b', futbol:'#ef4444',
  gimnasio:'#8b5cf6', tenis:'#fbbf24', natacion:'#0ea5e9', ciclismo:'#f97316',
  yoga:'#ec4899', baloncesto:'#f59e0b', voleibol:'#06d6a0', badminton:'#8b5cf6',
}

export const SPORT_LABELS = {
  running:'Running', padel:'Pádel', senderismo:'Senderismo', futbol:'Fútbol',
  gimnasio:'Gimnasio', tenis:'Tenis', natacion:'Natación', ciclismo:'Ciclismo',
  yoga:'Yoga', baloncesto:'Baloncesto', voleibol:'Voleibol', badminton:'Bádminton',
}

export function sportIconSVGString(sport, color = '#586875') {
  return `<circle cx="16" cy="16" r="14" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>`
}
