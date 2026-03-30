"use client";

import {
  UserCheck,
  Building2,
  UserPlus,
  Shield,
  Fingerprint,
  MapPin,
  FileText,
  LucideIcon,
} from "lucide-react";

/**
 * Maps icon name strings (stored in Convex) to Lucide React components.
 * Add new icons here as new service categories are added.
 */
export const iconRegistry: Record<string, LucideIcon> = {
  UserCheck,
  Building2,
  UserPlus,
  Shield,
  Fingerprint,
  MapPin,
  FileText,
};

export function getIcon(name: string): LucideIcon {
  return iconRegistry[name] ?? Shield; // fallback to Shield
}
