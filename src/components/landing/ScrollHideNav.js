'use client'

import { useEffect, useRef } from 'react'

export default function ScrollHideNav({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const y = window.scrollY
      if (y > 40) {
        el.classList.add('ln-nav-scrolled')
      } else {
        el.classList.remove('ln-nav-scrolled')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={ref}
      className="ln-nav-fixed"
    >
      {children}
    </div>
  )
}
