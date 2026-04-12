'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const SPORT_COLORS = {
  running:'#5b6ef5', padel:'#06d6a0', senderismo:'#f59e0b',
  futbol:'#ef4444',  gimnasio:'#8b5cf6', tenis:'#fbbf24',
  natacion:'#0ea5e9', ciclismo:'#f97316', yoga:'#ec4899',
  baloncesto:'#f59e0b', voleibol:'#06d6a0', badminton:'#8b5cf6',
}
const SPORT_ICONS = {
  running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽',
  gimnasio:'💪', tenis:'🎾', natacion:'🏊', ciclismo:'🚴',
  yoga:'🧘', baloncesto:'🏀', voleibol:'🏐', badminton:'🏸',
}
const LEVEL_LABELS = {
  any:'Todos los niveles', beginner:'Principiante',
  intermediate:'Intermedio', advanced:'Avanzado',
}

// Formatea fecha larga en español sin depender de locale del sistema
function fmtDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const days  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const months= ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const d = new Date(dateStr + 'T00:00:00')
  const day  = days[d.getDay()]
  const date = d.getDate()
  const month= months[d.getMonth()]
  const time = timeStr ? timeStr.slice(0,5) : ''
  return `${day} ${date} de ${month}${time ? ' · ' + time + 'h' : ''}`
}

// Dibuja texto con ajuste de línea
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' '
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, cy)
      line = words[i] + ' '
      cy += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, cy)
  return cy
}

export default function PosterModal({ event, onClose }) {
  const canvasRef  = useRef(null)
  const [mode, setMode]         = useState('poster') // 'poster' | 'qr'
  const [style, setStyle]       = useState('dark') // 'dark' | 'light' | 'sport'
  const [rendered, setRendered] = useState(false)
  const [downloading, setDown]  = useState(false)

  const eventUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${event?.id}`
    : `https://teamup-app-alpha.vercel.app/events/${event?.id}`

  useEffect(() => {
    if (!event) return
    if (mode === 'qr') drawQROnly()
    else drawPoster()
  }, [event, style, mode])

  async function drawPoster() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 1080, H = 1920
    canvas.width  = W
    canvas.height = H
    setRendered(false)

    const accent = SPORT_COLORS[event.sport] || '#586875'
    const icon   = SPORT_ICONS[event.sport]  || '🏅'

    // ── Fondo ──────────────────────────────────────────────
    if (style === 'dark') {
      ctx.fillStyle = '#0f1318'
      ctx.fillRect(0, 0, W, H)
      // Gradiente radial sutil
      const grd = ctx.createRadialGradient(W*0.85, H*0.12, 0, W*0.85, H*0.12, W*0.7)
      grd.addColorStop(0, accent + '22')
      grd.addColorStop(1, 'transparent')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)
    } else if (style === 'light') {
      ctx.fillStyle = '#f6eddc'
      ctx.fillRect(0, 0, W, H)
      const grd = ctx.createRadialGradient(W*0.15, H*0.88, 0, W*0.15, H*0.88, W*0.6)
      grd.addColorStop(0, accent + '18')
      grd.addColorStop(1, 'transparent')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)
    } else {
      // sport: fondo con color del deporte
      const grd = ctx.createLinearGradient(0, 0, W, H)
      grd.addColorStop(0, accent)
      grd.addColorStop(1, '#0f1318')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)
    }

    const isDark  = style === 'dark' || style === 'sport'
    const textCol = isDark ? '#f6eddc' : '#1a2028'
    const mutedCol= isDark ? 'rgba(246,237,220,0.55)' : 'rgba(26,32,40,0.55)'
    const bgCard  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    const borderC = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'

    // ── Franja superior accent ──────────────────────────────
    ctx.fillStyle = accent
    ctx.fillRect(0, 0, W, 14)

    // ── Logo texto ─────────────────────────────────────────
    ctx.font = 'bold 52px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = accent
    ctx.fillText('TEAM UP', 80, 110)

    ctx.font = '28px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = mutedCol
    ctx.fillText('Haz deporte · Conoce gente', 80, 155)

    // ── Icono deporte grande ────────────────────────────────
    ctx.font = '180px serif'
    ctx.fillText(icon, W - 280, 200)

    // ── Título evento ───────────────────────────────────────
    ctx.font = 'bold 88px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = textCol
    wrapText(ctx, event.title || 'Evento', 80, 340, W - 160, 100)

    // Separador
    ctx.fillStyle = accent
    ctx.fillRect(80, 480, 120, 6)

    // ── Datos del evento ────────────────────────────────────
    const rows = [
      { icon: '📅', val: fmtDate(event.date, event.time) },
      { icon: '📍', val: event.location || '' },
      { icon: '👥', val: `${event.participant_count || 0} / ${event.max_players || '—'} participantes` },
      { icon: '🏆', val: LEVEL_LABELS[event.level] || 'Todos los niveles' },
      event.price && event.price !== 'Gratis' ? { icon: '💶', val: event.price } : null,
    ].filter(Boolean)

    let rowY = 550
    for (const row of rows) {
      // Card fondo
      ctx.fillStyle = bgCard
      roundRect(ctx, 72, rowY - 46, W - 144, 76, 20)
      ctx.fill()
      ctx.strokeStyle = borderC
      ctx.lineWidth = 1.5
      roundRect(ctx, 72, rowY - 46, W - 144, 76, 20)
      ctx.stroke()

      ctx.font = '38px serif'
      ctx.fillStyle = textCol
      ctx.fillText(row.icon, 112, rowY + 6)

      ctx.font = '500 34px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = textCol
      ctx.fillText(row.val, 178, rowY + 6)

      rowY += 96
    }

    // ── Descripción ─────────────────────────────────────────
    if (event.description) {
      const descY = rowY + 30
      ctx.font = 'italic 30px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = mutedCol
      wrapText(ctx, event.description.slice(0, 160) + (event.description.length > 160 ? '…' : ''), 80, descY, W - 160, 44)
    }

    // ── QR ──────────────────────────────────────────────────
    try {
      const qrDataUrl = await QRCode.toDataURL(eventUrl, {
        width: 340, margin: 2,
        color: {
          dark:  isDark ? '#f6eddc' : '#1a2028',
          light: isDark ? '#1a2028' : '#f6eddc',
        },
      })
      const qrImg = new Image()
      await new Promise((res, rej) => {
        qrImg.onload = res
        qrImg.onerror = rej
        qrImg.src = qrDataUrl
      })
      // Caja del QR
      const qrX = W/2 - 220, qrY = H - 620
      ctx.fillStyle = isDark ? '#1a2028' : '#f0e8d8'
      roundRect(ctx, qrX - 24, qrY - 24, 488, 488, 28)
      ctx.fill()
      ctx.drawImage(qrImg, qrX, qrY, 440, 440)
    } catch(e) { /* QR falla silenciosamente */ }

    // ── Call to action ──────────────────────────────────────
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = mutedCol
    ctx.textAlign = 'center'
    ctx.fillText('Escanea para unirte al evento', W/2, H - 130)

    ctx.font = '26px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = mutedCol
    ctx.fillText('teamup-app-alpha.vercel.app', W/2, H - 82)
    ctx.textAlign = 'left'

    // ── Franja inferior accent ──────────────────────────────
    ctx.fillStyle = accent
    ctx.fillRect(0, H - 14, W, 14)

    setRendered(true)
  }

  // Utilidad: rectángulo redondeado
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  async function drawQROnly() {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = 800, H = 800
    canvas.width = W
    canvas.height = H
    setRendered(false)

    const isDark = style === 'dark' || style === 'sport'
    const accent = SPORT_COLORS[event.sport] || '#586875'
    const bg     = isDark ? '#0f1318' : '#f6eddc'
    const fg     = isDark ? '#f6eddc' : '#1a2028'

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Borde accent
    ctx.strokeStyle = accent
    ctx.lineWidth   = 16
    ctx.strokeRect(8, 8, W - 16, H - 16)

    try {
      const qrDataUrl = await QRCode.toDataURL(eventUrl, {
        width: 560, margin: 2,
        color: { dark: fg, light: bg },
      })
      const qrImg = new Image()
      await new Promise((res, rej) => { qrImg.onload = res; qrImg.onerror = rej; qrImg.src = qrDataUrl })
      ctx.drawImage(qrImg, 120, 80, 560, 560)
    } catch(e) {}

    ctx.font = 'bold 28px system-ui, sans-serif'
    ctx.fillStyle = fg
    ctx.textAlign = 'center'
    ctx.fillText(event.title || 'Evento', W/2, 690)
    ctx.font = '22px system-ui, sans-serif'
    ctx.fillStyle = accent
    ctx.fillText('teamup-app-alpha.vercel.app', W/2, 740)
    ctx.textAlign = 'left'

    setRendered(true)
  }

  function download() {
    setDown(true)
    const canvas = canvasRef.current
    const link   = document.createElement('a')
    link.download = `teamup-${event?.title?.replace(/\s+/g,'-').toLowerCase() || 'evento'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setDown(false)
  }

  if (!event) return null

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.82)', backdropFilter:'blur(12px)',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'flex-start', overflowY:'auto', padding:'24px 16px 40px',
    }}>
      {/* Cabecera */}
      <div style={{
        width:'100%', maxWidth:480, display:'flex',
        alignItems:'center', justifyContent:'space-between', marginBottom:20,
      }}>
        <h2 style={{ color:'#f6eddc', fontWeight:800, fontSize:20, margin:0, letterSpacing:'-0.03em' }}>
          Póster del evento
        </h2>
        <button onClick={onClose} style={{
          background:'rgba(255,255,255,0.12)', border:'none', borderRadius:50,
          width:36, height:36, cursor:'pointer', color:'#f6eddc', fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>✕</button>
      </div>

      {/* Toggle: Póster completo / Solo QR */}
      <div style={{
        display:'flex', gap:0, background:'rgba(255,255,255,0.08)',
        border:'1px solid rgba(255,255,255,0.15)', borderRadius:14,
        overflow:'hidden', marginBottom:14, width:'100%', maxWidth:480,
      }}>
        {[
          { id:'poster', label:'🖼 Póster completo' },
          { id:'qr',     label:'◻ Solo QR' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            flex:1, padding:'12px 0', border:'none', cursor:'pointer',
            fontFamily:'inherit', fontSize:13, fontWeight:700,
            background: mode===m.id ? 'rgba(255,255,255,0.18)' : 'transparent',
            color: mode===m.id ? '#f6eddc' : 'rgba(246,237,220,0.45)',
            transition:'all 0.15s ease',
          }}>{m.label}</button>
        ))}
      </div>

      {/* Selector de estilo */}
      <div style={{
        display:'flex', gap:8, marginBottom:20, width:'100%', maxWidth:480,
      }}>
        {[
          { id:'dark',  label:'Oscuro' },
          { id:'light', label:'Claro'  },
          { id:'sport', label:'Color'  },
        ].map(s => (
          <button key={s.id} onClick={() => setStyle(s.id)} style={{
            flex:1, padding:'10px 0', border: style===s.id ? `2px solid ${SPORT_COLORS[event?.sport]||'#586875'}` : '2px solid rgba(255,255,255,0.15)',
            borderRadius:12, background: style===s.id ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: style===s.id ? '#f6eddc' : 'rgba(246,237,220,0.5)',
            fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit',
            transition:'all 0.15s ease',
          }}>{s.label}</button>
        ))}
      </div>

      {/* Preview del póster */}
      <div style={{
        width:'100%', maxWidth:480, borderRadius:20, overflow:'hidden',
        boxShadow:'0 24px 60px rgba(0,0,0,0.6)',
      }}>
        <canvas ref={canvasRef} style={{ width:'100%', display:'block' }} />
      </div>

      {/* Botón descargar */}
      <button
        onClick={download}
        disabled={!rendered || downloading}
        style={{
          marginTop:24, width:'100%', maxWidth:480,
          background: SPORT_COLORS[event?.sport] || '#586875',
          color:'#fff', border:'none', borderRadius:16,
          padding:'16px 0', fontSize:16, fontWeight:800,
          cursor: rendered ? 'pointer' : 'default',
          opacity: rendered ? 1 : 0.5,
          fontFamily:'inherit', letterSpacing:'-0.02em',
          transition:'opacity 0.2s ease',
        }}
      >
        {rendered ? '⬇ Descargar PNG' : 'Generando...'}
      </button>

      <p style={{ color:'rgba(246,237,220,0.35)', fontSize:12, marginTop:12, textAlign:'center' }}>
        Listo para WhatsApp, Instagram o imprimir
      </p>
    </div>
  )
}
