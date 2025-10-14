import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TODO: Add utility functions for date formatting

// TODO: Add utility functions for currency formatting

// TODO: Add utility functions for time formatting
