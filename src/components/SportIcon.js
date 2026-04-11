'use client'

const EMOJIS = {
  running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽',
  gimnasio:'💪', tenis:'🎾', natacion:'🏊', ciclismo:'🚴',
  yoga:'🧘', baloncesto:'🏀', voleibol:'🏐', badminton:'🏸',
}

export function SportIcon({ sport, size = 28 }) {
  return (
    <span style={{ fontSize: size * 0.72, lineHeight: 1, display: 'block', textAlign: 'center' }}>
      {EMOJIS[sport] || '🎯'}
    </span>
  )
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
