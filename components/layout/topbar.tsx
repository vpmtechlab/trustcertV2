"use client";

import React, { useContext } from "react";
import { AppContext } from "@/components/providers/app-provider";
import { IoChevronDown, IoMenu } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, Shield } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topbar() {
  const { sideBarOpen, setSideBarOpen, device, member, setMember, viewMode, setViewMode } = useContext(AppContext);
  const pathname = usePathname();
  const router = useRouter();

  // For testing purposes, we assume VPMTechLab users have access.
  // In a real app with auth, you'd check member.email or use the backend role.
  const isSuperAdmin = true; // Temporary override for testing Super Admin logic 
  // const isSuperAdmin = member?.email?.endsWith("@vpmtechlab.com");

  const toggleViewMode = () => {
    setViewMode((prev: string) => prev === "admin" ? "client" : "admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("companyId");
    setMember(null);
    router.push("/login");
  };

  // Generate dynamic breadcrumb
  const pathSegments = pathname.split("/").filter(p => p);

  return (
    <div className="w-full bg-white py-4 px-6 flex justify-between items-center rounded-2xl shadow-sm">
      {/* Left Section: Menu and Breadcrumb */}
      <div className="flex items-center gap-4">
        {device === "sm" && (
          <div onClick={() => setSideBarOpen(true)} className="cursor-pointer text-2xl text-gray-700">
            <IoMenu />
          </div>
        )}
        {device !== "sm" && !sideBarOpen && (
          <div onClick={() => setSideBarOpen(true)} className="cursor-pointer text-2xl text-gray-700">
            <IoMenu />
          </div>
        )}
        <div className="flex gap-2 max-md:flex-col text-sm text-gray-500 font-medium capitalize">
          {pathSegments.map((segment, index) => (
            <span key={segment} className="flex items-center gap-2">
              <span className={index === pathSegments.length - 1 ? "text-primary" : ""}>
                {segment.replace("-", " ")}
              </span>
              {index < pathSegments.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Right Section: Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        
        <Popover>
          <PopoverTrigger className="flex items-center gap-[3px] cursor-pointer hover:bg-slate-50 p-1 rounded-md transition-colors outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member?.profile_image_url || ""} />
              <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                {member?.first_name?.[0] || <User size={16} />}
              </AvatarFallback>
            </Avatar>
            <IoChevronDown className="text-lg text-gray-500" />
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="flex flex-col space-y-1 mb-2 px-2 pb-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 leading-none">
                {member?.first_name || "John"} {member?.last_name || "Doe"}
              </p>
              <p className="text-xs text-gray-500 leading-none mt-1">
                {member?.email || "john.doe@trustcert.com"}
              </p>
            </div>
            
            <div className="flex flex-col gap-1">
              <div 
                className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-100 rounded-md text-gray-700 transition-colors text-sm"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
              
              {isSuperAdmin && (
                <div 
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors text-sm mt-1"
                  onClick={toggleViewMode}
                >
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">
                    {viewMode === "admin" ? "Switch to Client View" : "Switch to Admin View"}
                  </span>
                </div>
              )}
              
              <div
                className="flex items-center gap-2 cursor-pointer p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors mt-1 text-sm"
                onClick={handleLogout}
              >
                <HiOutlineLogout className="text-lg" />
                <span className="font-medium">Log Out</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
