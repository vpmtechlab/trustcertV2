"use client";

import React, { useState } from "react";
import { Shield, Smartphone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const loginHistory = [
    {
      device: "MacBook Pro",
      location: "Nairobi, KE",
      date: "Today, 10:23 AM",
      status: "Active, Current",
    },
    {
      device: "iPhone 13",
      location: "Nairobi, KE",
      date: "Yesterday, 8:45 PM",
      status: "Signed out",
    },
    {
      device: "Windows PC",
      location: "Mombasa, KE",
      date: "Jan 20, 2:30 PM",
      status: "Signed out",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 2FA Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-100 rounded-lg h-fit shrink-0">
            <Shield className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-lg mb-4">
              Add an extra layer of security to your account by requiring both your password and a code from your mobile device.
            </p>
            <div className="flex items-center space-x-2">
              <Switch
                id="2fa-toggle"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
              <Label htmlFor="2fa-toggle" className="font-medium cursor-pointer">
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="Enter current password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="Confirm new password" />
          </div>
        </div>
        <div className="mt-6">
          <Button className="bg-secondary hover:bg-gray-800 text-white w-full sm:w-auto">
            Update Password
          </Button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Login History */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Login Activity</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loginHistory.map((login, index) => (
                <tr key={index} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                    {login.device.includes("Phone") ? (
                      <Smartphone size={16} className="text-gray-400 shrink-0" />
                    ) : (
                      <Globe size={16} className="text-gray-400 shrink-0" />
                    )}
                    <span className="truncate">{login.device}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{login.location}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{login.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        login.status.includes("Active") ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {login.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Danger Zone */}
      <div>
        <h3 className="text-lg font-bold text-red-600 mb-3">Danger Zone</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-100 bg-red-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Delete Account</h4>
            <p className="text-sm text-gray-500 mt-1">
              Permanently delete your account and all data.
            </p>
          </div>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
