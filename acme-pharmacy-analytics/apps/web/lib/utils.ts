import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A'
  return `${value.toFixed(1)}%`
}

export function getAdherenceStatus(pdc: number | null | undefined): {
  label: string
  color: string
} {
  if (pdc === null || pdc === undefined) {
    return { label: 'Unknown', color: 'text-gray-500' }
  }

  if (pdc >= 80) {
    return { label: 'Healthy', color: 'text-green-600' }
  } else if (pdc >= 75) {
    return { label: 'At Risk', color: 'text-yellow-600' }
  } else {
    return { label: 'Critical', color: 'text-red-600' }
  }
}
