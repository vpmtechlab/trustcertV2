"use client";

import React, { createContext, useState } from "react";
import { usePathname } from "next/navigation";
import { useDevice } from "@/hooks/use-device";
import TopUpModal from "@/components/modals/topup-modal";
import InviteUserModal from "@/components/modals/invite-user-modal";


export interface BreadcrumbItem {
  title: string;
  link?: string;
}

export interface Member {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AppContextType {
  device: string;
  member: Member | null;
  setMember: React.Dispatch<React.SetStateAction<Member | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  sideBarOpen: boolean;
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapseSideBar: boolean;
  setCollapseSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  breadcrumbItems: BreadcrumbItem[];
  setBreadcrumbItems: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
  showTopUp: boolean;
  setShowTopUp: React.Dispatch<React.SetStateAction<boolean>>;
  showInviteModal: boolean;
  setShowInviteModal: React.Dispatch<React.SetStateAction<boolean>>;
  viewMode: "client" | "admin";
  setViewMode: React.Dispatch<React.SetStateAction<"client" | "admin">>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useApp = () => React.useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const device = useDevice();
  const pathname = usePathname();
  const [member, setMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [collapseSideBar, setCollapseSideBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  
  const [viewMode, setViewMode] = useState<"client" | "admin">(
    pathname?.startsWith("/admin") ? "admin" : "client"
  );
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (pathname?.startsWith("/admin")) {
      setViewMode("admin");
    } else if (pathname?.startsWith("/dashboard")) {
      setViewMode("client");
    }
  }

  return (
    <AppContext.Provider
      value={{
        device,
        member,
        setMember,
        token,
        setToken,
        sideBarOpen,
        setSideBarOpen,
        collapseSideBar,
        setCollapseSideBar,
        loading,
        setLoading,
        breadcrumbItems,
        setBreadcrumbItems,
        showTopUp,
        setShowTopUp,
        showInviteModal,
        setShowInviteModal,
        viewMode,
        setViewMode,
      }}
    >
      {children}
      {showTopUp && (
        <TopUpModal isOpen={showTopUp} onClose={() => setShowTopUp(false)} />
      )}
      {showInviteModal && (
        <InviteUserModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
      )}
    </AppContext.Provider>
  );
}
