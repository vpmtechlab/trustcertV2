"use client";

import React from "react";
import { User, Lock, Key, Bell, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings";
import { ApiSettings } from "@/components/dashboard/settings/api-settings";
import { BillingSettings } from "@/components/dashboard/settings/billing-settings";

export default function SettingsPage() {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 w-full lg:w-4/5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, security, and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start h-auto p-0 flex flex-wrap mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary border-transparent rounded-none px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[500px]">
          <TabsContent value="profile" className="mt-0 outline-none">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="security" className="mt-0 outline-none">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0 outline-none">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="api" className="mt-0 outline-none">
            <ApiSettings />
          </TabsContent>
          <TabsContent value="billing" className="mt-0 outline-none">
            <BillingSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
