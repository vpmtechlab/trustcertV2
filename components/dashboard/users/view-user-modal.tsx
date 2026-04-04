"use client";

import React from "react";
import {  Mail, Shield, Calendar, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { User } from "@/types/user";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ViewUserModal({ isOpen, onClose, user }: ViewUserModalProps) {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">View User</DialogTitle>
          <DialogDescription className="sr-only">Details for user {user.name}</DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 mt-4">
            <div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                user.status
              )}`}
            >
              {user.status}
            </span>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Role</p>
              <p className="font-medium text-gray-900">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }) : "Jan 15, 2026"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Last Active</p>
              <p className="font-medium text-gray-900">{user.lastActive || "2 hours ago"}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
