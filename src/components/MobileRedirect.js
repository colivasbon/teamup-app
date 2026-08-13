'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MOBILE_BREAKPOINT = 768

export default function MobileRedirect() {
  const router = useRouter()

  useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    if (isMobile) {
      router.replace('/start')
    }
  }, [router])

  return null
}
