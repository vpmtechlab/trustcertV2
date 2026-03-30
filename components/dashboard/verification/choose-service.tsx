"use client";

import React from "react";
import { ChevronRight, Check } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getIcon } from "@/lib/icon-registry";

// ── Types ─────────────────────────────────────────────────────────────────────
// Derived from the Convex `services.list` query shape

export type ServiceAction = {
  _id: string;
  label: string;
  slug: string;
  enabled: boolean;
};

export type ServiceCheckType = {
  _id: string;
  label: string;
  slug: string;
};

export type ServiceCategory = {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  actions: ServiceAction[];
  checkTypes: ServiceCheckType[];
};

// Legacy aliases — keep these so SelectAction and FillDetails don't break
export type ServiceType = ServiceCategory;

// ── Component ──────────────────────────────────────────────────────────────────

interface ChooseServiceProps {
  onSelectService: (service: ServiceType) => void;
}

export function ChooseService({ onSelectService }: ChooseServiceProps) {
  const services = useQuery(api.services.list);

  if (services === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-sm">No services configured yet.</p>
        <p className="text-xs mt-1">Run the seed mutation from the Convex dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Choose a Service</h2>
        <p className="text-sm text-gray-500 mt-1">
          Click on any of the services below
        </p>
      </div>

      <div className="space-y-3">
        {services.map((service) => {
          const IconComponent = getIcon(service.icon);
          return (
            <div
              key={service._id}
              onClick={() => onSelectService(service)}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${service.color}`}>
                  <IconComponent size={24} />
                </div>
                <span className="font-medium text-gray-800">{service.name}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-wrap gap-2 max-w-md">
                  {service.actions.map((action) => (
                    <span
                      key={action._id}
                      className="flex items-center gap-1 text-xs text-gray-500"
                    >
                      <Check size={12} className="text-primary" />
                      {action.label}
                    </span>
                  ))}
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-400 group-hover:text-primary transition-colors"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
