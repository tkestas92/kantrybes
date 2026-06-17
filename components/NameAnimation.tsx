'use client'

import { useEffect, useRef } from 'react'

const TOP_TEXT = 'Kęstas Trybė'
const BOTTOM_WORD = 'Kantrybės'

export default function NameAnimation() {
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const builtRef = useRef(false)

  useEffect(() => {
    if (builtRef.current) return
    builtRef.current = true

    const topEl = topRef.current
    const bottomEl = bottomRef.current
    if (!topEl || !bottomEl) return

    // "Kęstas Trybė" — typewriter raidė po raidės
    ;[...TOP_TEXT].forEach((ch, i) => {
      const s = document.createElement('span')
      s.textContent = ch === ' ' ? '\u00A0' : ch
      s.className = 'na-typeletter'
      s.style.animationDelay = `${i * 0.07}s`
      topEl.appendChild(s)
    })

    const cursor = document.createElement('span')
    cursor.className = 'na-cursor'
    topEl.appendChild(cursor)

    // "Kantrybės" — raidės atskrenda iš atsitiktinų pozicijų
    ;[...BOTTOM_WORD].forEach((ch, i) => {
      const s = document.createElement('span')
      s.textContent = ch
      s.className = 'na-flyletter'
      const fx = Math.round((Math.random() - 0.5) * 2 * (250 + Math.random() * 200))
      const fy = Math.round((Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 140))
      const fr = Math.round((Math.random() - 0.5) * 50)
      s.style.setProperty('--fx', `${fx}px`)
      s.style.setProperty('--fy', `${fy}px`)
      s.style.setProperty('--fr', `${fr}deg`)
      s.style.animationDelay = `${i * 0.08}s`
      bottomEl.appendChild(s)
    })
  }, [])

  return (
    <div className="na-wrap">
      <style>{`
        .na-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        @keyframes naTopFade { 0%{opacity:1} 38%{opacity:1} 50%{opacity:0} 100%{opacity:0} }
        @keyframes naLetterIn {
          0% { opacity:0; transform: translate(var(--fx), var(--fy)) rotate(var(--fr)) scale(0.6); }
          47% { opacity:0; transform: translate(var(--fx), var(--fy)) rotate(var(--fr)) scale(0.6); }
          72% { opacity:1; transform: translate(0,0) rotate(0deg) scale(1.08); }
          82% { transform: translate(0,0) rotate(0deg) scale(0.97); }
          90%,100% { opacity:1; transform: translate(0,0) rotate(0deg) scale(1); }
        }
        @keyframes naTypeIn { 0%{opacity:0} 1%{opacity:1} 100%{opacity:1} }
        @keyframes naCursorBlink {
          0% { opacity:0; }
          1% { opacity:1; }
          3%,3.5% { opacity:0; }
          4%,4.5% { opacity:1; }
          6%,6.5% { opacity:0; }
          7%,7.5% { opacity:1; }
          9%,9.5% { opacity:0; }
          10%,10.5% { opacity:1; }
          38% { opacity:1; }
          39%,100% { opacity:0; }
        }
        .na-top {
          font-size: 34px;
          font-weight: 400;
          color: #f0f0f0;
          letter-spacing: 4px;
          white-space: nowrap;
          animation: naTopFade 9.5s ease infinite;
          margin-bottom: -30px;
          position: relative;
          z-index: 1;
        }
        .na-typeletter {
          display: inline-block;
          opacity: 0;
          animation-name: naTypeIn;
          animation-duration: 9.5s;
          animation-timing-function: steps(1);
          animation-iteration-count: infinite;
        }
        .na-cursor {
          display: inline-block;
          width: 2px;
          height: 30px;
          vertical-align: -5px;
          margin-left: 2px;
          background: #f0f0f0;
          opacity: 0;
          animation: naCursorBlink 9.5s steps(1) infinite;
        }
        .na-bottom {
          font-size: 40px;
          font-weight: 500;
          color: #4afa8a;
          white-space: nowrap;
          display: inline-flex;
          min-height: 48px;
        }
        .na-flyletter {
          display: inline-block;
          position: relative;
          animation-name: naLetterIn;
          animation-duration: 9.5s;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
        }
        @media (max-width: 480px) {
          .na-top { font-size: 22px; letter-spacing: 2px; margin-bottom: -20px; }
          .na-bottom { font-size: 28px; min-height: 34px; }
          .na-cursor { height: 20px; }
        }
      `}</style>
      <div ref={topRef} className="na-top" />
      <div ref={bottomRef} className="na-bottom" />
    </div>
  )
}
