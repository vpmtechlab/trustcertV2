"use client";

import React, { useState, useContext } from "react";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function BalanceCard() {
  const { member } = useContext(AppContext);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [amount, setAmount] = useState("500");
  const [loading, setLoading] = useState(false);

  const balance = useQuery(api.balances.getAvailableBalance, 
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  );

  const addFunds = useMutation(api.balances.addFunds);

  const handleTopUp = async () => {
    if (!member?.companyId || !member?.id) return;
    
    setLoading(true);
    try {
      await addFunds({
        companyId: member.companyId as Id<"companies">,
        userId: member.id as Id<"users">,
        amount: parseFloat(amount),
      });
      toast.success(`Successfully added $${amount} to your balance!`);
      setTopUpOpen(false);
    } catch (error) {
      toast.error("Failed to add funds. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-secondary p-6 text-white shadow-lg lg:h-full flex flex-col justify-between">
      {/* Background Deco */}
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary opacity-20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        <div>
          <p className="text-sm font-medium text-gray-400">Available Balance</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">
            {balance !== undefined ? `$${balance.toLocaleString()}` : "..."}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Real-time credit for verifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
            <DialogTrigger className="flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 bg-primary hover:bg-[#146c11] text-white transition-colors text-sm font-medium outline-none cursor-pointer">
              <Plus size={16} />
              Top Up Balance
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Top Up Balance</DialogTitle>
                <DialogDescription>
                  Enter the amount you wish to add to your account credits.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTopUpOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleTopUp} 
                  disabled={loading}
                  className="bg-primary hover:bg-[#146c11]"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Link
            href="/dashboard/billing"
            className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 py-2 px-4 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/10"
          >
            History
          </Link>
        </div>
      </div>
    </div>
  );
}
