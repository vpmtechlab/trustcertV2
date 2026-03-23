import { Aside } from "@/components/layout/aside";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-row bg-[#F4F4F5] p-3 gap-3 overflow-hidden">
      <Aside />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 gap-4" style={{ zIndex: 10 }}>
        <Topbar />
        <div className="w-full flex-1 overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-sm relative p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
