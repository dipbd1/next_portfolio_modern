import { useEffect, useRef } from "react"
import {
  Ball,
  Rect,
  World,
  createBalls,
  resetAccumulator,
  step,
} from "../lib/snooker/physics"
import {
  Ripple,
  drawBall,
  drawCueLine,
  drawRipple,
  drawTableCached,
  invalidateTable,
} from "../lib/snooker/render"
import { emitImpact } from "../lib/snooker/impactBus"

const IMPACT_THROTTLE_MS = 120
const RIPPLE_LIFE = 0.6

interface DragState {
  startX: number
  startY: number
  x: number
  y: number
  ball: Ball | null
}

const Background2 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const world: World = { width: 0, height: 0, obstacle: null }
    let balls: Ball[] = []
    let ripples: Ripple[] = []
    let rafId = 0
    let lastTime = performance.now()
    let lastImpactAt = 0
    let running = true
    let visible = true
    let drag: DragState | null = null
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const obstacleEl = document.querySelector<HTMLElement>("[data-table-obstacle]")

    const measureObstacle = () => {
      if (!obstacleEl) {
        world.obstacle = null
        return
      }
      const r = obstacleEl.getBoundingClientRect()
      world.obstacle = {
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
      } as Rect
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      world.width = window.innerWidth
      world.height = window.innerHeight
      invalidateTable()
      canvas.width = world.width * dpr
      canvas.height = world.height * dpr
      canvas.style.width = `${world.width}px`
      canvas.style.height = `${world.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      measureObstacle()
      if (balls.length === 0) {
        balls = createBalls(world)
      } else {
        for (const b of balls) {
          b.x = Math.min(Math.max(b.x, b.r), world.width - b.r)
          b.y = Math.min(Math.max(b.y, b.r), world.height - b.r)
        }
      }
    }

    const render = (dt: number) => {
      // re-composite the cached table at partial alpha so moving balls
      // leave short fading trails instead of a hard clear
      drawTableCached(ctx, world, dpr, 0.32)

      ripples = ripples.filter((r) => r.age < r.life)
      for (const r of ripples) {
        r.age += dt
        drawRipple(ctx, r)
      }

      for (const b of balls) {
        drawBall(ctx, b)
      }

      if (drag) {
        const fromX = drag.ball ? drag.ball.x : drag.startX
        const fromY = drag.ball ? drag.ball.y : drag.startY
        drawCueLine(ctx, drag.x, drag.y, fromX, fromY)
      }
    }

    const frame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      if (running && visible && !reducedMotion.matches) {
        const impacts = step(balls, world, dt)
        for (const impact of impacts) {
          ripples.push({
            x: impact.x,
            y: impact.y,
            color: impact.color,
            age: 0,
            life: RIPPLE_LIFE,
            maxR: 60 + impact.strength * 90,
          })
          if (impact.strength > 0.05 && now - lastImpactAt > IMPACT_THROTTLE_MS) {
            lastImpactAt = now
            emitImpact(impact)
          }
        }
      }

      render(dt)
      rafId = requestAnimationFrame(frame)
    }

    const pickBall = (x: number, y: number): Ball | null => {
      let best: Ball | null = null
      let bestDist = Infinity
      for (const b of balls) {
        const d = Math.hypot(b.x - x, b.y - y)
        if (d < bestDist) {
          bestDist = d
          best = b
        }
      }
      return bestDist < 220 ? best : null
    }

    const onPointerDown = (e: PointerEvent) => {
      if (reducedMotion.matches) return
      drag = { startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, ball: pickBall(e.clientX, e.clientY) }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!drag) return
      drag.x = e.clientX
      drag.y = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!drag) return
      const { ball } = drag
      if (ball) {
        const pullX = drag.startX - e.clientX
        const pullY = drag.startY - e.clientY
        const pull = Math.hypot(pullX, pullY)
        if (pull > 12) {
          const power = Math.min(pull, 260) * 5.5
          ball.vx = (pullX / pull) * power
          ball.vy = (pullY / pull) * power
          ball.resting = false
        }
      }
      drag = null
    }

    const onVisibility = () => {
      visible = !document.hidden
      lastTime = performance.now()
      resetAccumulator()
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", measureObstacle, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    let resizeObserver: ResizeObserver | undefined
    if (obstacleEl && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measureObstacle)
      resizeObserver.observe(obstacleEl)
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      running = false
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", measureObstacle)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0"
      style={{ touchAction: "none" }}
    />
  )
}

export default Background2
