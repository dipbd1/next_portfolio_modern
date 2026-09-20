import React, { useMemo, type CSSProperties, type HTMLAttributes } from "react"
import { motion } from "framer-motion"

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  perspective?: number
  beamsPerSide?: number
  beamSize?: number
  beamDelayMax?: number
  beamDelayMin?: number
  beamDuration?: number
  gridColor?: string
}

interface BeamConfig {
  x: number
  delay: number
  duration: number
  hue: number
  sat: number
  light: number
  ar: number
}

function unitNoise(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return n - Math.floor(n)
}

function generateBeams(
  side: number,
  beamsPerSide: number,
  beamSize: number,
  beamDelayMin: number,
  beamDelayMax: number,
  beamDuration: number
): BeamConfig[] {
  if (beamsPerSide <= 0) return []

  const cellsPerSide = Math.floor(100 / beamSize)
  const step = cellsPerSide / Math.max(beamsPerSide - 1, 1)

  return Array.from({ length: beamsPerSide }, (_, i) => {
    const seed = side * 17 + i + 1
    const isIce = (side + i) % 2 === 1
    const x =
      beamsPerSide === 1
        ? Math.floor(cellsPerSide / 2)
        : Math.floor(i * step)

    return {
      x,
      delay:
        beamDelayMin + unitNoise(seed) * (beamDelayMax - beamDelayMin),
      duration: beamDuration * (0.82 + unitNoise(seed + 4) * 0.36),
      hue: isIce
        ? 204 + Math.floor(unitNoise(seed + 9) * 10)
        : 34 + Math.floor(unitNoise(seed + 9) * 12),
      sat: isIce
        ? 88 + Math.floor(unitNoise(seed + 11) * 12)
        : 84 + Math.floor(unitNoise(seed + 11) * 10),
      light: isIce
        ? 78 + Math.floor(unitNoise(seed + 13) * 10)
        : 50 + Math.floor(unitNoise(seed + 13) * 6),
      ar: 12 + Math.floor(unitNoise(seed + 21) * 8),
    }
  })
}

const Beam = ({
  width,
  x,
  delay,
  duration,
  hue,
  sat,
  light,
  ar,
}: {
  width: string
  x: string
  delay: number
  duration: number
  hue: number
  sat: number
  light: number
  ar: number
}) => {
  return (
    <motion.div
      className="warp-beam"
      style={
        {
          "--x": x,
          "--width": width,
          "--aspect-ratio": `${ar}`,
          "--background": `linear-gradient(hsl(${hue} ${sat}% ${light}%), transparent)`,
        } as CSSProperties
      }
      initial={{ y: "100vmax", x: "-50%" }}
      animate={{ y: "-40%", x: "-50%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: [0.12, 0.8, 0.28, 1],
      }}
    />
  )
}

export const WarpBackground: React.FC<WarpBackgroundProps> = ({
  children,
  perspective = 100,
  className = "",
  beamsPerSide = 3,
  beamSize = 5,
  beamDelayMax = 3,
  beamDelayMin = 0,
  beamDuration = 3,
  gridColor = "rgba(246, 184, 70, 0.16)",
  ...props
}) => {
  const topBeams = useMemo(
    () =>
      generateBeams(
        1,
        beamsPerSide,
        beamSize,
        beamDelayMin,
        beamDelayMax,
        beamDuration
      ),
    [beamsPerSide, beamSize, beamDelayMax, beamDelayMin, beamDuration]
  )
  const rightBeams = useMemo(
    () =>
      generateBeams(
        2,
        beamsPerSide,
        beamSize,
        beamDelayMin,
        beamDelayMax,
        beamDuration
      ),
    [beamsPerSide, beamSize, beamDelayMax, beamDelayMin, beamDuration]
  )
  const bottomBeams = useMemo(
    () =>
      generateBeams(
        3,
        beamsPerSide,
        beamSize,
        beamDelayMin,
        beamDelayMax,
        beamDuration
      ),
    [beamsPerSide, beamSize, beamDelayMax, beamDelayMin, beamDuration]
  )
  const leftBeams = useMemo(
    () =>
      generateBeams(
        4,
        beamsPerSide,
        beamSize,
        beamDelayMin,
        beamDelayMax,
        beamDuration
      ),
    [beamsPerSide, beamSize, beamDelayMax, beamDelayMin, beamDuration]
  )

  const sceneStyle = {
    "--perspective": `${perspective}px`,
    "--grid-color": gridColor,
    "--beam-size": `${beamSize}%`,
  } as CSSProperties

  const renderBeams = (beams: BeamConfig[], keyPrefix: string) =>
    beams.map((beam, index) => (
      <Beam
        key={`${keyPrefix}-${index}`}
        width={`${beamSize}%`}
        x={`${beam.x * beamSize}%`}
        delay={beam.delay}
        duration={beam.duration}
        hue={beam.hue}
        sat={beam.sat}
        light={beam.light}
        ar={beam.ar}
      />
    ))

  return (
    <div className={`warp-root ${className}`.trim()} {...props}>
      <div className="warp-scene" style={sceneStyle} aria-hidden="true">
        <div className="warp-side warp-side--top">{renderBeams(topBeams, "top")}</div>
        <div className="warp-side warp-side--bottom">
          {renderBeams(bottomBeams, "bottom")}
        </div>
        <div className="warp-side warp-side--left">
          {renderBeams(leftBeams, "left")}
        </div>
        <div className="warp-side warp-side--right">
          {renderBeams(rightBeams, "right")}
        </div>
      </div>
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  )
}
