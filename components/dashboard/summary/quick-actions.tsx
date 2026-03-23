"use client";

import React, { useContext, useState } from "react";
import { PlusCircle, UserPlus, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AppContext } from "@/components/providers/app-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuickActions() {
  const router = useRouter();
  const { setShowTopUp } = useContext(AppContext);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const actions = [
    {
      label: "New Verification",
      icon: PlusCircle,
      onClick: () => router.push("/dashboard/verification"),
      variant: "default" as const,
    },
    {
      label: "Invite Member",
      icon: UserPlus,
      onClick: () => setInviteModalOpen(true),
      variant: "outline" as const,
    },
    {
      label: "View Reports",
      icon: FileText,
      onClick: () => router.push("/dashboard/reports"),
      variant: "outline" as const,
    },
    {
      label: "Top Up Balance",
      icon: CreditCard,
      onClick: () => setShowTopUp(true),
      variant: "outline" as const,
    },
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className={`w-full justify-center py-8 h-auto flex-col gap-2 ${
                action.variant === "outline" ? "hover:bg-gray-50 border-gray-200" : "bg-primary text-white hover:bg-primary/90"
              }`}
              onClick={action.onClick}
            >
              <action.icon size={24} className="mb-1" />
              <span className="text-xs font-semibold">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member to join your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                className="bg-gray-50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role" 
                className="flex h-9 w-full rounded-md border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="member">Compliance Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-[#146c11] text-white" onClick={() => setInviteModalOpen(false)}>
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
