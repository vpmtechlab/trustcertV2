import { Id } from "@/convex/_generated/dataModel";

export interface User {
  id: Id<"users">;
  name: string;
  email: string;
  role: string;
  status: string;
  companyId?: string;
  avatar?: string;
  needsPasswordChange?: boolean;
  has_completed_tour?: boolean;
  createdAt?: number;
  lastActive?: string; // Mock string for now
}
