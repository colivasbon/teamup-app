'use client'

const SHAPES = [
  { type: 'circle', size: 320, x: '10%', y: '15%', color: 'primary', delay: 0 },
  { type: 'circle', size: 200, x: '80%', y: '25%', color: 'accent', delay: 2 },
  { type: 'square', size: 180, x: '70%', y: '60%', color: 'primary', delay: 4 },
  { type: 'circle', size: 140, x: '20%', y: '75%', color: 'accent', delay: 1 },
  { type: 'square', size: 100, x: '50%', y: '10%', color: 'primary', delay: 3 },
  { type: 'circle', size: 260, x: '85%', y: '80%', color: 'accent', delay: 5 },
]

export default function ParallaxBg() {
  return (
    <div className="parallax-bg" aria-hidden="true">
      {SHAPES.map((s, i) => (
        <div
          key={i}
          className={`parallax-shape parallax-shape--${s.type} parallax-shape--${s.color}`}
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <div className="parallax-gradient" />
    </div>
  )
}
