import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Loader from "./Loader"
import { WarpBackground } from "./WarpBackground"
import { featureFlags } from "../lib/featureFlags"

const BOOT_HOLD_MS = 2600
const BOOT_HOLD_REDUCED_MS = 700
const BOOT_EXIT_MS = 0.9
const BOOT_EXIT_REDUCED_MS = 0.22
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1]
const BOOT_SURFACE = "#0f172a"

function ClassicLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
      <Loader />
    </div>
  )
}

function WarpLoader({
  reducedMotion,
  holdMs,
}: {
  reducedMotion: boolean
  holdMs: number
}) {
  return (
    <WarpBackground
      className="h-full w-full overflow-hidden rounded-none border-0 p-0"
      perspective={150}
      beamsPerSide={reducedMotion ? 0 : 6}
      beamSize={5}
      beamDuration={1.05}
      beamDelayMax={0.05}
      beamDelayMin={-0.28}
      gridColor="rgba(246, 184, 70, 0.14)"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.2) 42%, #0f172a 100%)",
        }}
      />

      <div className="absolute bottom-16 left-1/2 z-20 w-[16rem] max-w-[60vw] -translate-x-1/2">
        <div
          className="h-2 overflow-hidden rounded-full"
          style={{ background: "rgba(246, 184, 70, 0.28)" }}
        >
          <motion.div
            className="h-full w-full rounded-full bg-main-orange"
            style={{ originX: 0, originY: 0.5 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: holdMs / 1000,
              ease: EASE_OUT_EXPO,
            }}
          />
        </div>
      </div>
    </WarpBackground>
  )
}

export default function LoaderPage() {
  const reducedMotion = useReducedMotion() === true
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(true)
  const holdMs = reducedMotion ? BOOT_HOLD_REDUCED_MS : BOOT_HOLD_MS
  const useWarp = featureFlags.warpLoader

  useEffect(() => {
    document.documentElement.classList.add("is-booting")
    const timeoutId = window.setTimeout(() => setVisible(false), holdMs)
    return () => {
      window.clearTimeout(timeoutId)
      document.documentElement.classList.remove("is-booting")
    }
  }, [holdMs])

  if (!mounted) return null

  return (
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {visible && (
        <motion.section
          key="boot-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          className="boot-loader overflow-hidden"
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          exit={
            reducedMotion
              ? {
                  opacity: 0,
                  transition: { duration: BOOT_EXIT_REDUCED_MS },
                }
              : useWarp
              ? {
                  opacity: 0,
                  scale: 1.07,
                  transition: {
                    duration: BOOT_EXIT_MS,
                    ease: EASE_OUT_EXPO,
                  },
                }
              : {
                  opacity: 0,
                  transition: { duration: 0.55, ease: EASE_OUT_EXPO },
                }
          }
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 10000,
            backgroundColor: BOOT_SURFACE,
            overflow: "hidden",
            transformOrigin: "50% 50%",
            willChange: "opacity, transform",
          }}
        >
          {useWarp ? (
            <WarpLoader reducedMotion={reducedMotion} holdMs={holdMs} />
          ) : (
            <ClassicLoader />
          )}
        </motion.section>
      )}
    </AnimatePresence>
  )
}
