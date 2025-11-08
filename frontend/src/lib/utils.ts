import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDateForInput(date: string | undefined | null): string {
  if (!date) return '';
  // Extract just the date part (YYYY-MM-DD) from datetime strings
  return date.split('T')[0];
}

// TODO: Add utility functions for currency formatting

// TODO: Add utility functions for time formatting
