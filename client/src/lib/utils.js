import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(/* REPLACED_PLACEHOLDER */inputs) {
  return twMerge(clsx(inputs))
}

