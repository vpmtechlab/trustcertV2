"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onDelete: (user: any) => void;
}

export function DeleteUserModal({ isOpen, onClose, user, onDelete }: DeleteUserModalProps) {
  if (!user) return null;

  const handleDelete = () => {
    onDelete(user);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader className="flex flex-col items-center">
          {/* Warning Icon */}
          <div className="flex justify-center mb-4 w-full">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-xl">Delete User?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700">{user.name}</span>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* User Card */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl my-4">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-10 h-10 rounded-full bg-gray-200 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <AlertDialogFooter className="flex-row gap-3 !justify-between">
          <AlertDialogCancel className="mt-0 flex-1">Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            <Trash2 size={18} className="mr-2" />
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
