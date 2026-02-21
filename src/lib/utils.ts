// ============================================
// FleetFlow — Utility Functions
// ============================================

/**
 * Merge class names conditionally (simple cn utility)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
