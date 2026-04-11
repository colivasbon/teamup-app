// Componente para mostrar los iconos de deporte como imagen PNG generada con IA
// Uso: <SportImg sport="running" size={40} />

export function SportImg({ sport, size = 40, style = {} }) {
  const validSports = ['running','padel','senderismo','futbol','gimnasio','tenis','natacion','ciclismo','yoga','baloncesto','voleibol','badminton']
  
  if (!validSports.includes(sport)) {
    // Fallback: emoji genérico en un span
    const fallbacks = { running:'🏃', padel:'🎾', senderismo:'🥾', futbol:'⚽', gimnasio:'💪', tenis:'🎾', natacion:'🏊', ciclismo:'🚴', yoga:'🧘', baloncesto:'🏀', voleibol:'🏐', badminton:'🏸' }
    return <span style={{ fontSize: size * 0.8, lineHeight: 1, ...style }}>{fallbacks[sport] || '🎯'}</span>
  }

  return (
    <img
      src={`/icons/${sport}.png`}
      alt={sport}
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block', ...style }}
      loading="lazy"
    />
  )
}
