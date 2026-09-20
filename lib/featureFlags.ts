function readBoolFlag(envValue: string | undefined, fallback: boolean): boolean {
  if (envValue === undefined) return fallback
  const normalized = envValue.trim().toLowerCase()
  if (["false", "0", "off", "no"].includes(normalized)) return false
  if (["true", "1", "on", "yes"].includes(normalized)) return true
  return fallback
}

export const featureFlags = {
  /**
   * Magic UI smooth cursor. Default is on.
   * Set NEXT_PUBLIC_SMOOTH_CURSOR=false in .env to restore the native cursor.
   */
  smoothCursor: readBoolFlag(process.env.NEXT_PUBLIC_SMOOTH_CURSOR, true),
  /**
   * Magic UI warp splash. Default is on.
   * Set NEXT_PUBLIC_WARP_LOADER=false in .env to restore the classic orange bubble.
   */
  warpLoader: readBoolFlag(process.env.NEXT_PUBLIC_WARP_LOADER, true),
} as const
