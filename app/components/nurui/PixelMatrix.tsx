'use client'

import React, { useEffect, useRef } from 'react'

type Props = {
  animationSpeed?: number // higher = faster
  opacities?: number[]
  colors?: number[][]
  containerClassName?: string
  dotSize?: number
  totalSize?: number // grid cell size
  reverse?: boolean
  isVisible?: boolean // optional external visibility hint
  showGradient?: boolean
}

export default function CanvasRevealEffect2D({
  animationSpeed = 10,
  opacities = [0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  colors = [[99, 102, 241], [196, 181, 253]],
  containerClassName = '',
  dotSize = 5,
  totalSize = 20,
  reverse = false,
  isVisible: externalVisible,
  showGradient = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const visibleRef = useRef(true)
  const stateRef = useRef({
    time: 0,
    width: 0,
    height: 0,
    cols: 0,
    rows: 0,
    grid: [] as number[][],
  })

  // IntersectionObserver to auto-pause when offscreen (if externalVisible not provided)
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    if (typeof externalVisible === 'boolean') {
      visibleRef.current = externalVisible
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [externalVisible])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // DPR cap: reduce work on high-DPI screens
    const getDpr = () => Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const parent = canvas.parentElement ?? document.documentElement
      const w = Math.max(1, parent.clientWidth)
      const h = Math.max(1, parent.clientHeight)
      const dpr = getDpr()

      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // scale drawing operations

      stateRef.current.width = w
      stateRef.current.height = h
      stateRef.current.cols = Math.ceil(w / totalSize)
      stateRef.current.rows = Math.ceil(h / totalSize)

      // rebuild grid with same dims but preserve previous values where possible
      const newGrid: number[][] = Array.from({ length: stateRef.current.rows }, (_, r) =>
        Array.from({ length: stateRef.current.cols }, (_, c) => {
          // try to preserve a value if within old bounds
          const old = stateRef.current.grid?.[r]?.[c]
          return typeof old === 'number' ? old : Math.random()
        }),
      )
      stateRef.current.grid = newGrid
    }

    // init
    resize()
    window.addEventListener('resize', resize)

    // Animation control
    const targetFps = 24 // feel free to lower this to 15 if needed
    const frameInterval = 1000 / targetFps
    let lastFrameTime = performance.now()

    // Parameters tuned for visual similarity to original shader
    const fadeSpeedBase = 0.015 // base fade per frame
    const randomSpawnProb = 0.0025 // chance each cell re-ignites per frame

    const drawFrame = (now: number) => {
      rafRef.current = null
      // Respect external visibility prop if provided; otherwise use IntersectionObserver result
      const visible = typeof externalVisible === 'boolean' ? externalVisible : visibleRef.current
      if (!visible) {
        lastFrameTime = now
        // don't schedule next frame while invisible
        return
      }

      const elapsed = now - lastFrameTime
      if (elapsed < frameInterval) {
        // schedule next and skip heavy work
        rafRef.current = requestAnimationFrame(drawFrame)
        return
      }
      lastFrameTime = now

      const s = stateRef.current
      const grid = s.grid
      const cols = s.cols
      const rows = s.rows
      const cell = totalSize
      const d = dotSize
      const speedFactor = Math.max(0.1, animationSpeed / 10) // map animationSpeed to a small factor

      // Clear canvas with subtle transparent fill to avoid full repaint cost for complex composite layers
      ctx.clearRect(0, 0, s.width, s.height)

      // iterate grid once (batch-friendly)
      for (let y = 0; y < rows; y++) {
        const row = grid[y]
        for (let x = 0; x < cols; x++) {
          let v = row[x]
          // decay
          v -= fadeSpeedBase * speedFactor
          // random re-ignite
          if (Math.random() < randomSpawnProb * speedFactor) v = 1

          // clamp
          if (v < 0) v = 0
          row[x] = v

          // skip drawing very faint cells
          if (v < 0.02) continue

          // choose color based on some pseudo-random but stable index (so it feels patterned)
          const colorIdx = Math.floor((x + y * 13) % colors.length)
          const [r, g, b] = colors[colorIdx] ?? colors[0]
          const alpha = Math.min(1, v * (opacities[colorIdx % opacities.length] ?? 0.5))

          // position - optionally reverse the propagation by offsetting grid index based on time
          // create small movement when playing (gives a sense of flow)
          const time = (now / 1000) * (speedFactor * 0.6)
          const jitterX = Math.sin((x + y) * 0.3 + time) * 0.2
          const jitterY = Math.cos((x - y) * 0.21 + time) * 0.2
          const px = x * cell + (cell - d) / 2 + jitterX
          const py = y * cell + (cell - d) / 2 + jitterY

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx.fillRect(px, py, d, d)
        }
      }

      // schedule next frame
      rafRef.current = requestAnimationFrame(drawFrame)
    }

    // start loop
    rafRef.current = requestAnimationFrame(drawFrame)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [
    animationSpeed,
    dotSize,
    totalSize,
    JSON.stringify(colors),
    JSON.stringify(opacities),
    reverse,
    externalVisible,
    showGradient,
  ])

  return (
    <div className={`h-full w-full relative overflow-hidden ${containerClassName}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block', willChange: 'transform' }}
      />
      {showGradient && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/40 to-transparent dark:from-slate-900/30" />
      )}
    </div>
  )
}
