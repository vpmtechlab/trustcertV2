"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ShieldAlert, Edit, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import AddPriceModal from "@/components/modals/add-price-modal";
import { Plus } from "lucide-react";

export default function SuperAdminPricingPage() {
  const prices = useQuery(api.pricing.getPrices);
  const updatePrice = useMutation(api.pricing.updatePrice);
  
  const [editingId, setEditingId] = useState<Id<"pricing"> | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Group prices by category
  const groupedPrices = prices?.reduce((acc, curr) => {
    if (!acc[curr.serviceCategory]) {
      acc[curr.serviceCategory] = [];
    }
    acc[curr.serviceCategory].push(curr);
    return acc;
  }, {} as Record<string, typeof prices>);

  const handleEdit = (id: Id<"pricing">, currentPrice: number) => {
    setEditingId(id);
    setEditValue(currentPrice.toString());
  };

  const handleSave = async (id: Id<"pricing">) => {
    const newPrice = parseFloat(editValue);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    setIsSaving(true);
    try {
      await updatePrice({ pricingId: id, newPrice });
      toast.success("Price updated successfully!");
      setEditingId(null);
    } catch (error: any) {
      toast.error("Failed to update price: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (prices === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-red-800">
        <ShieldAlert className="shrink-0" />
        <div>
          <h2 className="font-semibold">Super Admin Region</h2>
          <p className="text-sm">These settings are only visible to VPMTechLab administrators. Changes here immediately affect the cost of verification for all companies.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Pricing</h1>
          <p className="text-gray-500 text-sm">Configure the price per successful check for each verification type.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {(!prices || prices.length === 0) && (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No Services Found</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            Get started by adding your first verification service and its pricing.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setIsAddModalOpen(true)}>
            Add Your First Service
          </Button>
        </div>
      )}

      {Object.entries(groupedPrices || {}).map(([category, items]) => (
        <div key={category} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-sm">
              {category} Verifications
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
                <div className="mb-4 sm:mb-0">
                  <p className="font-medium text-gray-900">{item.serviceName}</p>
                  <p className="text-sm text-gray-500">Service ID: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{item.serviceId}</code></p>
                </div>
                
                <div className="flex items-center gap-4">
                  {editingId === item._id ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          type="number" 
                          step="0.01"
                          className="pl-7 w-32" 
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleSave(item._id)} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600" onClick={() => setEditingId(null)} disabled={isSaving}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-gray-900 w-24 text-right">
                        ${item.price.toFixed(2)}
                      </div>
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => handleEdit(item._id, item.price)}>
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <AddPriceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
