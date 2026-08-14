'use client'

import { useEffect, useRef } from 'react'

export default function ScrollHideNav({ children }) {
  const ref = useRef(null)
  const lastScroll = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const y = window.scrollY
      if (y < 60) {
        el.style.transform = 'translateY(0)'
        el.style.opacity = '1'
      } else if (y > lastScroll.current) {
        el.style.transform = 'translateY(-110%)'
        el.style.opacity = '0'
      } else {
        el.style.transform = 'translateY(0)'
        el.style.opacity = '1'
      }
      lastScroll.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out',
      }}
    >
      {children}
    </div>
  )
}
