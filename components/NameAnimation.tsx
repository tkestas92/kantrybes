'use client'

import { useEffect, useRef } from 'react'

const TOP_TEXT = 'Kęstas Trybė'
const WORD = 'Kantrybės'

function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function NameAnimation() {
  const topRef = useRef<HTMLDivElement>(null)
  const botRef = useRef<HTMLDivElement>(null)
  const modeRef = useRef(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const topEl = topRef.current
    const botEl = botRef.current
    if (!topEl || !botEl) return

    function playCycle() {
      if (!topEl || !botEl) return
      topEl.innerHTML = ''
      botEl.innerHTML = ''
      topEl.style.transition = 'none'
      topEl.style.opacity = '1'

      const letterSpans: HTMLSpanElement[] = []
      ;[...TOP_TEXT].forEach(ch => {
        const s = document.createElement('span')
        s.textContent = ch === ' ' ? '\u00A0' : ch
        s.style.opacity = '0'
        s.style.display = 'inline-block'
        topEl.appendChild(s)
        letterSpans.push(s)
      })

      const cursor = document.createElement('span')
      cursor.style.display = 'inline-block'
      cursor.style.width = '2px'
      cursor.style.height = '30px'
      cursor.style.verticalAlign = '-5px'
      cursor.style.marginLeft = '2px'
      cursor.style.background = '#f0f0f0'
      cursor.style.opacity = '0'
      topEl.appendChild(cursor)

      letterSpans.forEach((s, i) => {
        setTimeout(() => { s.style.opacity = '1' }, i * 70)
      })

      let blinkCount = 0
      const blinkInterval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '1' ? '0' : '1'
        blinkCount++
        if (blinkCount > 6) clearInterval(blinkInterval)
      }, 250)

      setTimeout(() => {
        clearInterval(blinkInterval)
        cursor.style.opacity = '0'
        topEl.style.transition = 'opacity 0.6s ease'
        topEl.style.opacity = '0'
      }, 2400)

      const mode = modeRef.current
      const bottomSpans: HTMLSpanElement[] = []
      ;[...WORD].forEach(ch => {
        const s = document.createElement('span')
        s.textContent = ch
        s.style.display = 'inline-block'
        s.style.position = 'relative'
        s.style.opacity = '0'

        if (mode === 0) {
          const fx = Math.round((Math.random() - 0.5) * 2 * (250 + Math.random() * 200))
          const fy = Math.round((Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 140))
          const fr = Math.round((Math.random() - 0.5) * 50)
          s.style.transform = `translate(${fx}px,${fy}px) rotate(${fr}deg) scale(0.6)`
          s.style.transition = 'transform 0.85s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease'
        } else {
          s.style.transform = 'translateY(-220px)'
          s.style.transition = 'transform 0.6s cubic-bezier(0.55,0,1,0.45), opacity 0.3s ease'
        }
        botEl.appendChild(s)
        bottomSpans.push(s)
      })

      const order = shuffledIndices(bottomSpans.length)
      order.forEach((letterIdx, orderPos) => {
        const delay = 3000 + orderPos * 80
        setTimeout(() => {
          const s = bottomSpans[letterIdx]
          if (mode === 0) {
            s.style.transform = 'translate(0,0) rotate(0deg) scale(1)'
            s.style.opacity = '1'
          } else {
            s.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease'
            s.style.transform = 'translateY(0)'
            s.style.opacity = '1'
          }
        }, delay)
      })

      modeRef.current = 1 - modeRef.current
    }

    playCycle()
    const interval = setInterval(playCycle, 7500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        ref={topRef}
        style={{
          fontSize: 34,
          fontWeight: 400,
          color: '#f0f0f0',
          letterSpacing: 4,
          whiteSpace: 'nowrap',
          marginBottom: -30,
          position: 'relative',
          zIndex: 1,
        }}
      />
      <div
        ref={botRef}
        style={{
          fontSize: 40,
          fontWeight: 500,
          color: '#4afa8a',
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          minHeight: 48,
        }}
      />
    </div>
  )
}
