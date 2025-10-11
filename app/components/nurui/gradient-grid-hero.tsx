"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function GradientGridHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let devicePixelRatio: number

    const setCanvasDimensions = () => {
      devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio

      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Mouse position
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
    })

    class Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      color: string
      distance: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 4 + 1.5
        this.density = Math.random() * 30 + 1
        this.distance = 0

        const hue = Math.random() * 60 + 270 // purple-pink range
        this.color = `hsl(${hue}, 70%, 60%)`
      }

      update() {
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        this.distance = Math.sqrt(dx * dx + dy * dy)

        const forceDirectionX = dx / this.distance
        const forceDirectionY = dy / this.distance

        const maxDistance = 80
        const force = (maxDistance - this.distance) / maxDistance

        if (this.distance < maxDistance) {
          const directionX = forceDirectionX * force * this.density
          const directionY = forceDirectionY * force * this.density
          this.x -= directionX
          this.y -= directionY
        } else {
          if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10
          if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Particle grid
    const particlesArray: Particle[] = []
    const gridSize = 40 

    function init() {
      particlesArray.length = 0

      if (!canvas) return

      const canvasWidth = canvas.width / devicePixelRatio
      const canvasHeight = canvas.height / devicePixelRatio

      const numX = Math.floor(canvasWidth / gridSize)
      const numY = Math.floor(canvasHeight / gridSize)

      for (let y = 0; y < numY; y++) {
        for (let x = 0; x < numX; x++) {
          const posX = x * gridSize + gridSize / 2
          const posY = y * gridSize + gridSize / 2
          particlesArray.push(new Particle(posX, posY))
        }
      }
    }

    init()

    // Animation loop with throttling (~30fps)
    let lastTime = 0

    const animate = (time: number) => {
      if (time - lastTime < 33) {
        requestAnimationFrame(animate)
        return
      }
      lastTime = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 0.85 // Smooth blending

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.08
      mouseY += (targetY - mouseY) * 0.08

      for (let i = 0; i < particlesArray.length; i++) {
        const p1 = particlesArray[i]
        p1.update()
        p1.draw(ctx)

        // Only check nearby particles
        for (let j = i + 1; j < particlesArray.length; j++) {
          const p2 = particlesArray[j]
          const dx = p1.x - p2.x
          if (Math.abs(dx) > 40) continue // quick skip for performance
          const dy = p1.y - p2.y
          if (Math.abs(dy) > 40) continue
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 40) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(180, 120, 255, ${0.2 - distance / 150})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    window.addEventListener("resize", init)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("resize", init)
    }
  }, [])

  return (
    <motion.div
      className="w-full relative overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-screen" style={{ display: "block" }} />
    </motion.div>
  )
}
