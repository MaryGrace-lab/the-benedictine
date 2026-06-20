import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This is safe for both Client and Server
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}