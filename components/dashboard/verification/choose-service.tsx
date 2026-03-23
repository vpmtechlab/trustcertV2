"use client";

import React from "react";
import {
  UserCheck,
  Building2,
  UserPlus,
  Shield,
  Fingerprint,
  MapPin,
  ChevronRight,
  Check,
} from "lucide-react";

export type ServiceAction = { id: string; label: string; enabled: boolean };
export type ServiceType = {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  actions: ServiceAction[];
};

export const SERVICES: ServiceType[] = [
  {
    id: "kyc",
    name: "KYC Services",
    icon: UserCheck,
    color: "bg-blue-100 text-blue-600",
    actions: [
      { id: "enhanced_kyc", label: "Enhanced KYC", enabled: true },
      { id: "biometric_kyc", label: "Biometric KYC", enabled: true },
      {
        id: "document_verification",
        label: "Document Verification",
        enabled: true,
      },
    ],
  },
  {
    id: "kyb",
    name: "KYB Services",
    icon: Building2,
    color: "bg-indigo-100 text-indigo-600",
    actions: [
      {
        id: "business_verification",
        label: "Business Verification",
        enabled: true,
      },
    ],
  },
  {
    id: "user_registration",
    name: "User Registration",
    icon: UserPlus,
    color: "bg-green-100 text-green-600",
    actions: [
      {
        id: "smart_selfie_registration",
        label: "SmartSelfie™ Authentication (user registration)",
        enabled: true,
      },
    ],
  },
  {
    id: "aml",
    name: "AML",
    icon: Shield,
    color: "bg-purple-100 text-purple-600",
    actions: [{ id: "aml_check", label: "AML Check", enabled: true }],
  },
  {
    id: "biometric_2fa",
    name: "Biometric 2nd Factor Authentication",
    icon: Fingerprint,
    color: "bg-orange-100 text-orange-600",
    actions: [
      {
        id: "smart_selfie_auth",
        label: "SmartSelfie™ Authentication (authentication)",
        enabled: true,
      },
    ],
  },
  {
    id: "address_verification",
    name: "Address Verification",
    icon: MapPin,
    color: "bg-teal-100 text-teal-600",
    actions: [
      { id: "address_verify", label: "Address Verification", enabled: true },
    ],
  },
];

interface ChooseServiceProps {
  onSelectService: (service: ServiceType) => void;
}

export function ChooseService({ onSelectService }: ChooseServiceProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Choose a Service</h2>
        <p className="text-sm text-gray-500 mt-1">
          Click on any of the services below
        </p>
      </div>

      <div className="space-y-3">
        {SERVICES.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${service.color}`}>
                  <IconComponent size={24} />
                </div>
                <span className="font-medium text-gray-800">
                  {service.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-wrap gap-2 max-w-md">
                  {service.actions.map((action) => (
                    <span
                      key={action.id}
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
