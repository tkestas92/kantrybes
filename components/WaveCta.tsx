'use client'

import { useRef, useEffect } from 'react'

export default function WaveCta() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGPolylineElement>(null)
  const animRef = useRef<number | null>(null)
  const progressRef = useRef(0)
  const timeRef = useRef(0)
  const activeRef = useRef(false)
  const isMobileRef = useRef(false)

  function drawWave() {
    const svg = svgRef.current
    const path = pathRef.current
    const head = headRef.current
    if (!svg || !path || !head) return

    const W = svg.getBoundingClientRect().width || 100
    const cy = 12
    const amp = 4
    const freq = 0.08

    timeRef.current += 0.06
    if (activeRef.current && progressRef.current < W) progressRef.current += 14
    if (!activeRef.current && progressRef.current > 0) progressRef.current -= 5
    if (isMobileRef.current && activeRef.current && progressRef.current >= W) {
      progressRef.current = 0
      timeRef.current = 0
    }

    const pts: string[] = []
    const steps = Math.ceil(progressRef.current)
    for (let x = 0; x <= steps; x += 2) {
      const y = cy + Math.sin(x * freq + timeRef.current) * amp
      pts.push(`${x},${y}`)
    }

    if (pts.length > 1) {
      path.setAttribute('d', 'M' + pts.join(' L'))
      path.setAttribute('opacity', String(Math.min(1, progressRef.current / 20)))
      const lastX = steps
      const lastY = cy + Math.sin(lastX * freq + timeRef.current) * amp
      const prevY = cy + Math.sin((lastX - 4) * freq + timeRef.current) * amp
      const angle = Math.atan2(lastY - prevY, 4)
      const hs = 7
      const hx1 = lastX - Math.cos(angle) * hs
      const hy1 = lastY - Math.sin(angle) * hs - hs * 0.6
      const hx2 = lastX - Math.cos(angle) * hs
      const hy2 = lastY - Math.sin(angle) * hs + hs * 0.6
      head.setAttribute('points', `${hx1},${hy1} ${lastX},${lastY} ${hx2},${hy2}`)
      head.setAttribute(
        'opacity',
        progressRef.current > 15 ? String(Math.min(1, (progressRef.current - 15) / 15)) : '0',
      )
    }

    if (progressRef.current > 0 || activeRef.current) {
      animRef.current = requestAnimationFrame(drawWave)
    } else {
      path.setAttribute('d', '')
      path.setAttribute('opacity', '0')
      head.setAttribute('opacity', '0')
      animRef.current = null
      progressRef.current = 0
    }
  }

  function startWave() {
    activeRef.current = true
    if (!animRef.current) animRef.current = requestAnimationFrame(drawWave)
  }

  function stopWave() {
    if (isMobileRef.current) return
    activeRef.current = false
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  useEffect(() => {
    const isMobile = window.matchMedia('(hover: none)').matches
    if (isMobile) {
      isMobileRef.current = true
      activeRef.current = true
      animRef.current = requestAnimationFrame(drawWave)
    }
  }, [])

  return (
    <section
      className="mt-12 p-5 bg-[#161616] border border-[#252525] rounded-xl hover:border-[#333] transition-all duration-200 cursor-pointer group"
      onMouseEnter={startWave}
      onMouseLeave={stopWave}
    >
      <p className="text-[13px] text-white font-medium mb-2">Reikia pagalbos su:</p>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
        Python · Go · React Native · Kotlin · Next.js · MySQL · AI · ML · GraphQL · REST · Docker · Railway
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-0 flex-1 min-w-0">
          <span className="text-[13px] font-medium text-[#4afa8a] whitespace-nowrap">Kantrybės... Padėsiu!</span>
          <div className="flex-1 mx-2.5 relative" style={{ height: '24px', overflow: 'visible' }}>
            <svg
              ref={svgRef}
              width="100%"
              height="24"
              style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
            >
              <path
                ref={pathRef}
                d=""
                stroke="#4afa8a"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0"
              />
              <polyline
                ref={headRef}
                points="0,12 0,12 0,12"
                stroke="#4afa8a"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0"
              />
            </svg>
          </div>
        </div>
        <a
          href="mailto:kestas@kantrybes.lt"
          className="text-[13px] font-medium bg-[#4afa8a] text-black px-4 py-2 rounded-lg group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(74,250,138,0.4)] transition-all duration-300 whitespace-nowrap"
        >
          Pasikalbėkim
        </a>
      </div>
    </section>
  )
}
