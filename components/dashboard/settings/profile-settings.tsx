"use client";

import React, { useState } from "react";
import { Camera, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileSettings() {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@vpmtech.com",
    phone: "+254 700 123 456",
    role: "Senior Compliance Officer",
    bio: "Experienced compliance professional with over 5 years of ensuring regulatory adherence.",
  });

  const [avatar] = useState("https://i.pravatar.cc/150?u=a042581f4e29026024d");

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-500">Update your photo and personal details here.</p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="relative group w-20 h-20 shrink-0">
          <img
            src={avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
          />
          <button className="absolute bottom-0 right-0 p-1.5 bg-secondary text-white rounded-full shadow-md hover:bg-gray-800 transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            {profileData.firstName} {profileData.lastName}
            <BadgeCheck size={16} className="text-blue-500" />
          </h3>
          <p className="text-sm text-gray-500">{profileData.role}</p>
          <div className="flex items-center gap-2 mt-3">
            <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
              Change Photo
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50">
              Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            disabled
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <p className="text-xs text-gray-500">Contact admin to change your email address.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Job Title</Label>
          <Input
            id="role"
            value={profileData.role}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none resize-none text-sm"
            value={profileData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Brief description for your profile..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button className="bg-secondary hover:bg-gray-800 text-white w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
