'use client'

import { useEffect, useRef } from 'react'
import { useConsent } from '@/components/ConsentProvider'

const GA_ID = 'G-H6Y4J27C54'

export default function GoogleAnalytics() {
  const { consent, ready } = useConsent()
  const started = useRef(false)

  useEffect(() => {
    if (!ready || consent.thirdParty !== true || started.current) return
    if (document.querySelector('script[data-ga="loader"]')) return
    started.current = true

    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    window.gtag?.('js', new Date())
    window.gtag?.('config', GA_ID)

    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    script.dataset.ga = 'loader'
    document.head.appendChild(script)
  }, [consent.thirdParty, ready])

  return null
}
