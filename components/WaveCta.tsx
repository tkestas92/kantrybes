'use client'

import { useRef, useEffect } from 'react'

export default function WaveCta() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | null>(null)
  const activeRef = useRef(false)
  const isMobileRef = useRef(false)
  const particlesRef = useRef<{ x: number; y: number; speed: number; char: string; opacity: number }[]>([])

  function draw() {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const W = wrap.offsetWidth || 150
    canvas.width = W
    const H = 20
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)

    if (activeRef.current && Math.random() < 0.35) {
      particlesRef.current.push({
        x: 0,
        y: H / 2 + (Math.random() - 0.5) * 6,
        speed: 0.4,
        char: Math.random() > 0.5 ? '1' : '0',
        opacity: 0.5 + Math.random() * 0.5,
      })
    }

    particlesRef.current.forEach((p) => {
      const progress = p.x / W
      const isMobileDevice = window.matchMedia('(hover: none)').matches
      p.speed = isMobileDevice
        ? 0.2 + Math.pow(progress, 2) * 6
        : 0.4 + Math.pow(progress, 2) * 18
      p.x += p.speed
      const fade = progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1
      const alpha = p.opacity * Math.max(0, fade)
      ctx.fillStyle = `rgba(74, 250, 138, ${alpha})`
      ctx.font = `500 10px 'JetBrains Mono', monospace`
      ctx.fillText(p.char, p.x, p.y + 4)
    })

    particlesRef.current = particlesRef.current.filter((p) => p.x < W + 10)

    if (activeRef.current || particlesRef.current.length > 0) {
      animRef.current = requestAnimationFrame(draw)
    } else {
      ctx.clearRect(0, 0, W, H)
      animRef.current = null
    }
  }

  function startStream() {
    activeRef.current = true
    if (!animRef.current) animRef.current = requestAnimationFrame(draw)
  }

  function stopStream() {
    if (isMobileRef.current) return
    activeRef.current = false
  }

  useEffect(() => {
    const isMobile = window.matchMedia('(hover: none)').matches
    let startTimer: ReturnType<typeof setTimeout> | undefined

    if (isMobile) {
      isMobileRef.current = true
      startTimer = setTimeout(startStream, 300)
    }

    return () => {
      if (startTimer) clearTimeout(startTimer)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <section
      className="mt-12 p-5 bg-[#161616] border border-[#252525] rounded-xl hover:border-[#333] transition-all duration-200 cursor-pointer group"
      onMouseEnter={startStream}
      onMouseLeave={stopStream}
    >
      <p className="text-[13px] text-white font-medium mb-2">Reikia pagalbos su:</p>
      <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
        Python · Go · React Native · Kotlin · Next.js · MySQL · AI · ML · GraphQL · REST · Docker · Railway
      </p>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-0 flex-1 min-w-0">
          <span className="text-[13px] font-medium text-[#4afa8a] whitespace-nowrap">Kantrybės... Padėsiu!</span>
          <div ref={wrapRef} className="flex-1 mx-2.5 relative" style={{ height: '20px', overflow: 'hidden' }}>
            <canvas ref={canvasRef} height={20} style={{ position: 'absolute', top: 0, left: 0 }} />
          </div>
        </div>
        <a
          href="mailto:kestas@kantrybes.lt"
          className="text-[13px] font-medium bg-[#4afa8a] text-black px-4 py-2 rounded-lg group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(74,250,138,0.4)] transition-all duration-300 whitespace-nowrap"
        >
          Pasikalbėkim!
        </a>
      </div>
    </section>
  )
}
