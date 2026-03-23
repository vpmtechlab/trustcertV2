"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

export function BalanceCard() {
  const [topUpOpen, setTopUpOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary p-6 text-white shadow-lg">
      {/* Background Deco */}
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary opacity-20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        <div>
          <p className="text-sm font-medium text-gray-400">Available Balance</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">$2,450.00</h2>
          <p className="mt-1 text-xs text-gray-500">
            Last topped up: Jan 24, 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
            <DialogTrigger className="flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 bg-primary hover:bg-[#146c11] text-white transition-colors text-sm font-medium outline-none">
              <Plus size={16} />
              Top Up Balance
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Top Up Balance</DialogTitle>
                <DialogDescription>
                  Add funds to your TrustCert account for verifications and compliance checks.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {/* Form placeholder */}
                <p className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  Stripe Payment Element / Form goes here
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTopUpOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-[#146c11]">Proceed to Pay</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Optional secondary action */}
          <Link
            href="/dashboard/billing"
            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 py-2.5 px-4 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/10"
          >
            History
          </Link>
        </div>
      </div>
    </div>
  );
}
