export interface ImpactEvent {
  color: string
  strength: number
  x: number
  y: number
}

type Listener = (impact: ImpactEvent) => void

const listeners = new Set<Listener>()

export const onImpact = (fn: Listener): (() => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export const emitImpact = (impact: ImpactEvent) => {
  listeners.forEach((fn) => fn(impact))
}
