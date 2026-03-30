"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuditFeed } from "@/components/shared/audit-feed";
import { Activity, ShieldCheck, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAuditPage() {
  const logs = useQuery(api.audit.getGlobalAuditLogs);

  return (
    <div className="p-4 space-y-12 min-h-screen bg-gray-50/20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                   Platform Governance
                </h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] mt-2">Global System Audit Trail</p>
             </div>
          </div>
          <p className="text-gray-500 font-medium max-w-xl">
             Monitoring every configuration change, administrative override, and high-level platform event across all tenant organizations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
           <Button variant="outline" className="rounded-2xl px-6 font-bold text-xs gap-2 shadow-sm uppercase tracking-widest h-12">
              <Filter size={16} /> Filter Results
           </Button>
           <Button className="rounded-2xl px-6 font-bold text-xs gap-2 shadow-xl uppercase tracking-widest h-12 bg-gray-900 text-white hover:bg-black transition-all">
              <Download size={16} /> Export Logs
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Stats Sidebar */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
               <div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Audit Strength</h3>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full w-[95%] bg-primary rounded-full transition-all duration-1000" />
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Platform Hits</p>
                     <p className="text-2xl font-black text-gray-900 tracking-tighter">{logs?.length || "--"}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
                     <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">Log Status</p>
                     <p className="text-xl font-black tracking-tighter flex items-center gap-2">
                        <Activity size={16} className="animate-pulse" />
                        Healthy
                     </p>
                  </div>
               </div>

               <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                  Platform audits are tamper-proof and cryptographically verified. Deletions are strictly prohibited by protocol.
               </p>
            </div>
         </div>

         {/* Main Audit Feed */}
         <div className="lg:col-span-3">
            <AuditFeed 
               logs={logs} 
               title="Platform Interactions" 
               showCompany={true} 
            />
         </div>
      </div>
    </div>
  );
}
