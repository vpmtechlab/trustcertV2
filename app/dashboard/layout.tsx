import { Aside } from "@/components/layout/aside";
import { Topbar } from "@/components/layout/topbar";
import { AppTour } from "@/components/dashboard/app-tour";
import Script from "next/script";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-row bg-[#F4F4F5] p-3 gap-3 overflow-hidden">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <Aside />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 gap-4" style={{ zIndex: 10 }}>
        <Topbar />
        <div className="w-full flex-1 overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-sm relative p-4">
          {children}
        </div>
      </div>
      <AppTour />
    </div>
  );
}
