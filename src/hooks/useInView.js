'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Hook simple de IntersectionObserver para scroll reveal.
 * Uso: const [ref, inView] = useInView({ threshold: 0.15 })
 * El elemento debe tener las clases de transición de Tailwind.
 */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px', triggerOnce = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) observer.unobserve(el)
        } else if (!triggerOnce) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return [ref, inView]
}

/**
 * Componente wrapper para scroll reveal.
 * Uso: <Reveal><div>...</div></Reveal>
 */
export function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        filter: inView ? 'blur(0)' : 'blur(4px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
