import { ReactNode, useEffect, useRef } from "react"
import Lenis from "lenis"

interface SmoothSectionProps {
  children: ReactNode
  id?: string
  className?: string
}

export default function SmoothSection({
  children,
  id,
  className = "",
}: SmoothSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      autoRaf: true,
      overscroll: false,
      anchors: false,
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      id={id}
      className={`smooth-section ${className}`.trim()}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
