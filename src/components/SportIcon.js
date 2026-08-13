'use client'

import { useAuth } from '@/contexts/AuthContext'
import {
  SKIN_TONES,
  getSportEmoji,
  SPORT_COLORS,
  getSportColor,
  SPORT_LABELS,
} from '@/lib/sportConfig'

export { SKIN_TONES, SPORT_COLORS, SPORT_LABELS, getSportColor, getSportEmoji }

export function SportIcon({ sport, size = 28, toneOverride }) {
  let tone = toneOverride || 'default'
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { profile } = useAuth()
    if (!toneOverride) tone = profile?.skin_tone || 'default'
  } catch(_) {}

  const emoji = getSportEmoji(sport, tone)

  return (
    <span style={{ fontSize: size * 0.72, lineHeight: 1, display: 'block', textAlign: 'center' }}>
      {emoji}
    </span>
  )
}

export function sportIconSVGString(sport, color = '#586875') {
  return `<circle cx="16" cy="16" r="14" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>`
}
