"use client";

import React, { useContext } from "react";
import { PlusCircle, UserPlus, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AppContext, useApp } from "@/components/providers/app-provider";

export function QuickActions() {
  const router = useRouter();
  const { setShowTopUp } = useContext(AppContext);
  const { setShowInviteModal } = useApp();

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
      onClick: () => setShowInviteModal(true),
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
    </>
  );
}
