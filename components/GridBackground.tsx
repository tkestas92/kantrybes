'use client'

import { useEffect, useRef } from 'react'
import { useGridPulse } from '@/components/GridPulse'

const CELL = 48
const BG_FALLBACK = '#0f0f0f'
const LINE = '#262626'
const FILL = '74, 250, 138'
const SPEED = 0.3
const BAND = 80
const LIFE = 6500
const PEAK = 0.32
const SKIP = 0.004
const DESKTOP_GAP = 3200
const PHONE_GAP = 4500
const PHONE_MAX = 2
const DESKTOP_MAX = 3

type Wave = { x: number; y: number; born: number }

export default function GridBackground() {
  const { enabled } = useGridPulse()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const enabledRef = useRef(enabled)
  const apiRef = useRef<null | { enable: () => void; disable: () => void }>(null)
  enabledRef.current = enabled

  useEffect(() => {
    const node = canvasRef.current
    if (!node) return
    const canvas: HTMLCanvasElement = node
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let alphas = new Float32Array(0)
    const touched: number[] = []
    const waves: Wave[] = []
    let lastSpawn = 0
    let raf = 0
    let pulsing = false
    let solid = BG_FALLBACK
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    function isPhone() {
      return window.innerWidth < 640
    }

    function readSolid() {
      solid = getComputedStyle(document.documentElement).getPropertyValue('--surface-solid').trim() || BG_FALLBACK
    }

    function resize() {
      readSolid()
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const nextCols = Math.ceil(width / CELL)
      const nextRows = Math.ceil(height / CELL)
      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols
        rows = nextRows
        alphas = new Float32Array(cols * rows)
        touched.length = 0
      }
    }

    function drawGrid() {
      ctx.strokeStyle = LINE
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= width; x += CELL) {
        const px = Math.round(x) + 0.5
        ctx.moveTo(px, 0)
        ctx.lineTo(px, height)
      }
      for (let y = 0; y <= height; y += CELL) {
        const py = Math.round(y) + 0.5
        ctx.moveTo(0, py)
        ctx.lineTo(width, py)
      }
      ctx.stroke()
    }

    function paint(now: number) {
      ctx.fillStyle = solid
      ctx.fillRect(0, 0, width, height)

      if (!reduced && pulsing) {
        for (let i = 0; i < touched.length; i++) alphas[touched[i]] = 0
        touched.length = 0

        for (let w = waves.length - 1; w >= 0; w--) {
          if (now - waves[w].born >= LIFE) waves.splice(w, 1)
        }
        const cap = isPhone() ? PHONE_MAX : DESKTOP_MAX
        while (waves.length > cap) waves.shift()

        const gap = isPhone() ? PHONE_GAP : DESKTOP_GAP
        if (lastSpawn === 0) lastSpawn = now
        if (now - lastSpawn >= gap && waves.length < cap) {
          waves.push({
            x: Math.random() * width,
            y: Math.random() * height,
            born: now,
          })
          lastSpawn = now
        }

        for (const wave of waves) {
          const age = now - wave.born
          const radius = age * SPEED
          const fade = Math.max(0, 1 - age / LIFE)
          if (fade === 0) continue
          const reach = radius + BAND
          const minCol = Math.max(0, Math.floor((wave.x - reach) / CELL))
          const maxCol = Math.min(cols - 1, Math.floor((wave.x + reach) / CELL))
          const minRow = Math.max(0, Math.floor((wave.y - reach) / CELL))
          const maxRow = Math.min(rows - 1, Math.floor((wave.y + reach) / CELL))
          for (let row = minRow; row <= maxRow; row++) {
            const cy = row * CELL + CELL / 2
            for (let col = minCol; col <= maxCol; col++) {
              const cx = col * CELL + CELL / 2
              const dist = Math.abs(Math.hypot(cx - wave.x, cy - wave.y) - radius)
              if (dist >= BAND) continue
              const alpha = (1 - dist / BAND) ** 2 * PEAK * fade
              if (alpha < SKIP) continue
              const index = row * cols + col
              if (alpha <= alphas[index]) continue
              if (alphas[index] === 0) touched.push(index)
              alphas[index] = alpha
            }
          }
        }

        for (let i = 0; i < touched.length; i++) {
          const alpha = alphas[touched[i]]
          if (alpha < SKIP) continue
          const index = touched[i]
          const col = index % cols
          const row = (index - col) / cols
          ctx.fillStyle = `rgba(${FILL}, ${alpha})`
          ctx.fillRect(col * CELL, row * CELL, CELL - 1, CELL - 1)
        }
      }

      drawGrid()
    }

    function frame(now: number) {
      paint(now)
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (reduced || !pulsing || document.visibilityState === 'hidden' || raf) return
      raf = requestAnimationFrame(frame)
    }

    function stop() {
      if (!raf) return
      cancelAnimationFrame(raf)
      raf = 0
    }

    function onResize() {
      resize()
      if (!raf) paint(performance.now())
    }

    function onVisibility() {
      if (document.visibilityState === 'hidden') stop()
      else start()
    }

    function onMotion() {
      reduced = motionQuery.matches
      if (reduced) {
        waves.length = 0
        stop()
        paint(performance.now())
        return
      }
      lastSpawn = performance.now()
      start()
    }

    function enable() {
      pulsing = true
      lastSpawn = 0
      start()
    }

    function disable() {
      pulsing = false
      waves.length = 0
      stop()
      paint(performance.now())
    }

    apiRef.current = { enable, disable }
    resize()
    paint(performance.now())
    if (enabledRef.current) enable()

    const observer = new ResizeObserver(onResize)
    observer.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    motionQuery.addEventListener('change', onMotion)

    return () => {
      apiRef.current = null
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener('change', onMotion)
    }
  }, [])

  useEffect(() => {
    const api = apiRef.current
    if (!api) return
    if (enabled) api.enable()
    else api.disable()
  }, [enabled])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: -1 }}
    />
  )
}
