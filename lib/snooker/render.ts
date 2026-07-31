import type { Ball, World, Rect } from "./physics"

let feltPattern: HTMLCanvasElement | null = null
let feltPatternKey = ""

let cachedTable: HTMLCanvasElement | null = null

export const invalidateTable = () => {
  cachedTable = null
}

export const drawTableCached = (
  ctx: CanvasRenderingContext2D,
  world: World,
  dpr: number,
  trailAlpha = 1
) => {
  if (
    !cachedTable ||
    cachedTable.width !== Math.round(world.width * dpr) ||
    cachedTable.height !== Math.round(world.height * dpr)
  ) {
    cachedTable = document.createElement("canvas")
    cachedTable.width = Math.round(world.width * dpr)
    cachedTable.height = Math.round(world.height * dpr)
    const off = cachedTable.getContext("2d")
    if (off) {
      off.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawTable(off, world, dpr)
    }
  }
  ctx.save()
  ctx.globalAlpha = trailAlpha
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.drawImage(cachedTable, 0, 0)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.restore()
}

export const drawTable = (
  ctx: CanvasRenderingContext2D,
  world: World,
  dpr: number
) => {
  const { width, height } = world

  // navy felt base
  const base = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.1,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.75
  )
  base.addColorStop(0, "#152036")
  base.addColorStop(0.55, "#0f172a")
  base.addColorStop(1, "#080d18")
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  // procedural cloth noise, baked once per size bucket
  drawFeltNoise(ctx, width, height, dpr)

  // rails
  const rail = Math.max(18, Math.min(30, width / 50))
  ctx.save()
  ctx.strokeStyle = "rgba(101, 68, 33, 0.35)"
  ctx.lineWidth = rail * 0.5
  ctx.strokeRect(rail * 0.25, rail * 0.25, width - rail * 0.5, height - rail * 0.5)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
  ctx.lineWidth = 1.5
  ctx.strokeRect(rail, rail, width - rail * 2, height - rail * 2)
  ctx.restore()

  // six pocket wells
  const pr = rail * 0.95
  const pockets: [number, number][] = [
    [rail * 0.4, rail * 0.4],
    [width / 2, rail * 0.25],
    [width - rail * 0.4, rail * 0.4],
    [rail * 0.4, height - rail * 0.4],
    [width / 2, height - rail * 0.25],
    [width - rail * 0.4, height - rail * 0.4],
  ]
  for (const [px, py] of pockets) {
    const g = ctx.createRadialGradient(px, py, 0, px, py, pr)
    g.addColorStop(0, "rgba(0, 0, 0, 0.85)")
    g.addColorStop(0.7, "rgba(0, 0, 0, 0.45)")
    g.addColorStop(1, "rgba(0, 0, 0, 0)")
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(px, py, pr, 0, Math.PI * 2)
    ctx.fill()
  }

  // baulk line + D arc
  const bx = width * 0.22
  ctx.save()
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(bx, rail)
  ctx.lineTo(bx, height - rail)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(bx, height / 2, height * 0.14, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()
  ctx.restore()
}

const drawFeltNoise = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number
) => {
  const key = `${Math.round(width / 128)}x${Math.round(height / 128)}`
  if (!feltPattern || feltPatternKey !== key) {
    feltPatternKey = key
    const size = 256
    const c = document.createElement("canvas")
    c.width = size
    c.height = size
    const off = c.getContext("2d")
    if (off) {
      const img = off.createImageData(size, size)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 200 + Math.random() * 55
        img.data[i] = v
        img.data[i + 1] = v
        img.data[i + 2] = v
        img.data[i + 3] = Math.random() * 14
      }
      off.putImageData(img, 0, 0)
    }
    feltPattern = c
  }
  if (feltPattern) {
    ctx.save()
    ctx.globalAlpha = 0.5
    ctx.drawImage(feltPattern, 0, 0, width, height)
    ctx.restore()
  }
}

export const drawBall = (ctx: CanvasRenderingContext2D, b: Ball) => {
  const { x, y, r } = b

  // contact shadow
  ctx.save()
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)"
  ctx.beginPath()
  ctx.ellipse(x + r * 0.25, y + r * 0.45, r * 0.9, r * 0.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.clip()

  if (b.striped) {
    ctx.fillStyle = "#f5f2ea"
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
    const bandOffset = Math.sin(b.spin) * r * 0.35
    ctx.fillStyle = b.color
    ctx.fillRect(x - r, y - r * 0.62 + bandOffset, r * 2, r * 1.24)
  } else {
    ctx.fillStyle = b.color
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  // shading for sphere volume
  const shade = ctx.createRadialGradient(
    x - r * 0.35,
    y - r * 0.35,
    r * 0.2,
    x,
    y,
    r * 1.05
  )
  shade.addColorStop(0, "rgba(255, 255, 255, 0.28)")
  shade.addColorStop(0.5, "rgba(0, 0, 0, 0)")
  shade.addColorStop(1, "rgba(0, 0, 0, 0.42)")
  ctx.fillStyle = shade
  ctx.fillRect(x - r, y - r, r * 2, r * 2)

  // number disc, wobbling with the spin
  const discR = r * 0.42
  const discDX = Math.sin(b.spin) * r * 0.15
  const discDY = Math.cos(b.spin * 0.7) * r * 0.1
  ctx.fillStyle = "#f5f2ea"
  ctx.beginPath()
  ctx.arc(x + discDX, y + discDY, discR, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  // number text
  ctx.save()
  ctx.fillStyle = "#1c1917"
  ctx.font = `700 ${Math.round(r * 0.55)}px Poppins, sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(String(b.number), x + discDX, y + discDY + 1)
  ctx.restore()

  // specular highlight
  ctx.save()
  const spec = ctx.createRadialGradient(
    x - r * 0.4,
    y - r * 0.45,
    0,
    x - r * 0.4,
    y - r * 0.45,
    r * 0.5
  )
  spec.addColorStop(0, "rgba(255, 255, 255, 0.75)")
  spec.addColorStop(1, "rgba(255, 255, 255, 0)")
  ctx.fillStyle = spec
  ctx.beginPath()
  ctx.arc(x - r * 0.4, y - r * 0.45, r * 0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export interface Ripple {
  x: number
  y: number
  color: string
  age: number
  life: number
  maxR: number
}

export const drawRipple = (ctx: CanvasRenderingContext2D, r: Ripple) => {
  const t = r.age / r.life
  const alpha = (1 - t) * 0.45
  const radius = 10 + t * r.maxR
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = r.color
  ctx.lineWidth = 2.5 * (1 - t)
  ctx.beginPath()
  ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

export const drawCueLine = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) => {
  ctx.save()
  ctx.strokeStyle = "rgba(245, 158, 11, 0.7)"
  ctx.lineWidth = 3
  ctx.setLineDash([10, 8])
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = "rgba(245, 158, 11, 0.9)"
  ctx.beginPath()
  ctx.arc(toX, toY, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export const obstacleOutline = (ctx: CanvasRenderingContext2D, rect: Rect | null) => {
  if (!rect) return
  ctx.save()
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"
  ctx.lineWidth = 2
  ctx.strokeRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top)
  ctx.restore()
}
