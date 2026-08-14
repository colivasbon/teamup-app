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

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReduced
}

/**
 * Componente wrapper para scroll reveal.
 * Uso: <Reveal><div>...</div></Reveal>
 */
export function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView()
  const reduced = usePrefersReducedMotion()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: reduced ? 'none' : (inView ? 'translateY(0)' : 'translateY(24px)'),
        transition: reduced
          ? 'opacity 0.01ms'
          : `opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
