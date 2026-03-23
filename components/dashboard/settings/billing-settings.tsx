"use client";

import React from "react";
import { CreditCard, CheckCircle, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BillingSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Billing & Plans</h2>
        <p className="text-sm text-gray-500">Manage your subscription and payment methods.</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">Pro Plan</h3>
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                Active
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              You are on the Pro plan with enhanced features and priority support.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Renews on Feb 24, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard size={14} />
                $49.00 / month
              </span>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Button variant="outline" className="text-gray-900 w-full md:w-auto hover:bg-gray-100">
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center shrink-0">
              <span className="font-bold text-xs text-gray-600 italic">VISA</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expiry 12/28</p>
            </div>
          </div>
          <button className="text-sm font-medium text-secondary hover:text-gray-900 transition-colors">
            Edit
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Recent Invoices</h3>
          <Link
            href="/dashboard/billing"
            className="text-sm text-secondary hover:text-gray-900 font-medium flex items-center gap-1"
          >
            View All <ExternalLink size={14} />
          </Link>
        </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {[
            {
              id: "INV-2026-001",
              date: "Jan 01, 2026",
              amount: "$49.00",
              status: "Paid",
            },
            {
              id: "INV-2025-012",
              date: "Dec 01, 2025",
              amount: "$49.00",
              status: "Paid",
            },
          ].map((inv, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-50 rounded-full text-green-600 shrink-0">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{inv.id}</p>
                  <p className="text-xs text-gray-500">{inv.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm text-gray-900">{inv.amount}</p>
                <span className="text-xs text-gray-500">Invoice</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
