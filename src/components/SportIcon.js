'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  SKIN_TONES,
  getSportEmoji,
  SPORT_COLORS,
  getSportColor,
  SPORT_LABELS,
  SPORT_PHOSPHOR_ICONS,
} from '@/lib/sportConfig'


export { SKIN_TONES, SPORT_COLORS, SPORT_LABELS, getSportColor, getSportEmoji }

// Cache de iconos Phosphor cargados
const iconCache = new Map()

function loadPhosphorIcon(iconName) {
  if (iconCache.has(iconName)) return Promise.resolve(iconCache.get(iconName))
  return import('@phosphor-icons/react').then(mod => {
    const icon = mod[iconName]
    iconCache.set(iconName, icon)
    return icon
  }).catch(() => null)
}

// Componente principal — Phosphor icon con fallback a PNG y luego emoji
export function SportIcon({ sport, size = 28, toneOverride, weight = 'light' }) {
  const [PhosphorIcon, setPhosphorIcon] = useState(() => iconCache.get(SPORT_PHOSPHOR_ICONS[sport]) || null)
  const [usePng, setUsePng] = useState(false)

  let tone = toneOverride || 'default'
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { profile } = useAuth()
    if (!toneOverride) tone = profile?.skin_tone || 'default'
  } catch(_) {}

  useEffect(() => {
    const iconName = SPORT_PHOSPHOR_ICONS[sport]
    if (!iconName) return

    let cancelled = false
    loadPhosphorIcon(iconName).then(icon => {
      if (!cancelled) setPhosphorIcon(() => icon)
    })
    return () => { cancelled = true }
  }, [sport])

  const handleError = useCallback(() => {
    setUsePng(true)
  }, [])

  // 1. Phosphor icon
  if (PhosphorIcon) {
    return (
      <PhosphorIcon
        size={size}
        weight={weight}
        color={SPORT_COLORS[sport] || '#586875'}
        style={{ display: 'block', flexShrink: 0 }}
      />
    )
  }

  // 2. Fallback: PNG image
  if (!usePng) {
    return (
      <img
        src={`/icons/${sport}.png`}
        alt={SPORT_LABELS[sport] || sport}
        width={size}
        height={size}
        style={{ objectFit: 'contain', display: 'block' }}
        onError={handleError}
        loading="lazy"
      />
    )
  }

  // 3. Fallback final: emoji
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
