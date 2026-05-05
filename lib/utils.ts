import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConvexError } from "convex/values"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ConvexError) {
    return error.data as string;
  }
  
  if (error instanceof Error) {
    // In development, you might want to see the full error, but for production
    // and based on user request, we return a generic message for standard Errors.
    return "An error occurred. Please contact the system administrator.";
  }
  
  return "An unexpected error occurred.";
}
