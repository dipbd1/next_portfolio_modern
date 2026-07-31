export interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  spin: number
  color: string
  number: number
  striped: boolean
  resting: boolean
}

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

export interface Impact {
  x: number
  y: number
  color: string
  strength: number
}

export interface World {
  width: number
  height: number
  obstacle: Rect | null
}

const SUBSTEP = 1 / 120
const FRICTION = 0.995
const RESTITUTION = 0.92
const BALL_RESTITUTION = 0.96
const REST_SPEED = 14
const MAX_SPEED = 1400

export const SNOOKER_PALETTE: { color: string; number: number; striped: boolean }[] = [
  { color: "#e11d48", number: 3, striped: false },
  { color: "#f59e0b", number: 1, striped: false },
  { color: "#2563eb", number: 2, striped: false },
  { color: "#7c3aed", number: 4, striped: false },
  { color: "#16a34a", number: 6, striped: false },
  { color: "#78350f", number: 7, striped: false },
  { color: "#111111", number: 8, striped: false },
  { color: "#f59e0b", number: 9, striped: true },
  { color: "#2563eb", number: 10, striped: true },
  { color: "#e11d48", number: 11, striped: true },
  { color: "#7c3aed", number: 12, striped: true },
  { color: "#f97316", number: 13, striped: true },
  { color: "#16a34a", number: 14, striped: true },
  { color: "#78350f", number: 15, striped: true },
]

export const createBalls = (world: World): Ball[] => {
  const count = world.width < 768 ? 6 : 14
  const defs = SNOOKER_PALETTE.slice(0, count)
  const r = Math.max(14, Math.min(24, world.width / 55))
  const balls: Ball[] = []

  const obstacle = world.obstacle
  for (let i = 0; i < defs.length; i++) {
    let x = 0
    let y = 0
    let attempts = 0
    do {
      x = r * 2 + Math.random() * (world.width - r * 4)
      y = r * 2 + Math.random() * (world.height - r * 4)
      attempts++
    } while (attempts < 60 && (overlapsRect(x, y, r, obstacle) || overlapsBalls(x, y, r, balls)))

    const angle = Math.random() * Math.PI * 2
    const speed = 180 + Math.random() * 260
    balls.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r,
      spin: Math.random() * Math.PI * 2,
      color: defs[i].color,
      number: defs[i].number,
      striped: defs[i].striped,
      resting: false,
    })
  }
  return balls
}

const overlapsRect = (x: number, y: number, r: number, rect: Rect | null): boolean => {
  if (!rect) return false
  const cx = clamp(x, rect.left, rect.right)
  const cy = clamp(y, rect.top, rect.bottom)
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy < (r + 8) * (r + 8)
}

const overlapsBalls = (x: number, y: number, r: number, balls: Ball[]): boolean =>
  balls.some((b) => {
    const dx = x - b.x
    const dy = y - b.y
    return dx * dx + dy * dy < (r + b.r + 4) * (r + b.r + 4)
  })

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

let accumulator = 0

export const resetAccumulator = () => {
  accumulator = 0
}

export const step = (balls: Ball[], world: World, dt: number): Impact[] => {
  const impacts: Impact[] = []
  accumulator += Math.min(dt, 0.05)

  while (accumulator >= SUBSTEP) {
    substep(balls, world, SUBSTEP, impacts)
    accumulator -= SUBSTEP
  }
  return impacts
}

const substep = (balls: Ball[], world: World, dt: number, impacts: Impact[]) => {
  for (const b of balls) {
    b.x += b.vx * dt
    b.y += b.vy * dt
    b.spin += (Math.hypot(b.vx, b.vy) * dt) / b.r

    b.vx *= FRICTION
    b.vy *= FRICTION

    const speed = Math.hypot(b.vx, b.vy)
    if (speed < REST_SPEED) {
      if (!b.resting) b.resting = true
      // gentle random nudge keeps the table alive
      b.vx += (Math.random() - 0.5) * 6 * dt * 60
      b.vy += (Math.random() - 0.5) * 6 * dt * 60
    } else {
      b.resting = false
    }

    if (speed > MAX_SPEED) {
      const k = MAX_SPEED / speed
      b.vx *= k
      b.vy *= k
    }

    collideCushions(b, world, impacts)
    if (world.obstacle) collideObstacle(b, world.obstacle, impacts)
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      collideBalls(balls[i], balls[j])
    }
  }
}

const collideCushions = (b: Ball, world: World, impacts: Impact[]) => {
  if (b.x - b.r < 0) {
    b.x = b.r
    b.vx = -b.vx * RESTITUTION
    registerImpact(b, b.x - b.r, b.y, Math.abs(b.vx), impacts)
  } else if (b.x + b.r > world.width) {
    b.x = world.width - b.r
    b.vx = -b.vx * RESTITUTION
    registerImpact(b, b.x + b.r, b.y, Math.abs(b.vx), impacts)
  }
  if (b.y - b.r < 0) {
    b.y = b.r
    b.vy = -b.vy * RESTITUTION
    registerImpact(b, b.x, b.y - b.r, Math.abs(b.vy), impacts)
  } else if (b.y + b.r > world.height) {
    b.y = world.height - b.r
    b.vy = -b.vy * RESTITUTION
    registerImpact(b, b.x, b.y + b.r, Math.abs(b.vy), impacts)
  }
}

const collideObstacle = (b: Ball, rect: Rect, impacts: Impact[]) => {
  const cx = clamp(b.x, rect.left, rect.right)
  const cy = clamp(b.y, rect.top, rect.bottom)
  let dx = b.x - cx
  let dy = b.y - cy
  let distSq = dx * dx + dy * dy

  // ball center inside the rect: push out along the shortest axis
  if (distSq === 0) {
    const dl = b.x - rect.left
    const dr = rect.right - b.x
    const dt = b.y - rect.top
    const db = rect.bottom - b.y
    const min = Math.min(dl, dr, dt, db)
    if (min === dl) {
      dx = -1
      dy = 0
      b.x = rect.left - b.r
    } else if (min === dr) {
      dx = 1
      dy = 0
      b.x = rect.right + b.r
    } else if (min === dt) {
      dx = 0
      dy = -1
      b.y = rect.top - b.r
    } else {
      dx = 0
      dy = 1
      b.y = rect.bottom + b.r
    }
    distSq = 1
  }

  const dist = Math.sqrt(distSq)
  if (dist >= b.r) return

  const nx = dx / dist
  const ny = dy / dist

  // positional de-overlap
  const overlap = b.r - dist
  b.x += nx * overlap
  b.y += ny * overlap

  const vDotN = b.vx * nx + b.vy * ny
  if (vDotN < 0) {
    b.vx -= (1 + RESTITUTION) * vDotN * nx
    b.vy -= (1 + RESTITUTION) * vDotN * ny
    registerImpact(b, cx, cy, -vDotN, impacts)
  }
}

const collideBalls = (a: Ball, b: Ball) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distSq = dx * dx + dy * dy
  const minDist = a.r + b.r
  if (distSq === 0 || distSq >= minDist * minDist) return

  const dist = Math.sqrt(distSq)
  const nx = dx / dist
  const ny = dy / dist

  const overlap = (minDist - dist) / 2
  a.x -= nx * overlap
  a.y -= ny * overlap
  b.x += nx * overlap
  b.y += ny * overlap

  const rvx = b.vx - a.vx
  const rvy = b.vy - a.vy
  const vDotN = rvx * nx + rvy * ny
  if (vDotN >= 0) return

  const impulse = (-(1 + BALL_RESTITUTION) * vDotN) / 2
  a.vx -= impulse * nx
  a.vy -= impulse * ny
  b.vx += impulse * nx
  b.vy += impulse * ny
}

const registerImpact = (b: Ball, x: number, y: number, normalSpeed: number, impacts: Impact[]) => {
  if (normalSpeed < 60) return
  impacts.push({
    x,
    y,
    color: b.color,
    strength: clamp((normalSpeed - 60) / 900, 0, 1),
  })
}
