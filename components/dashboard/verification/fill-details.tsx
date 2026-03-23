"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceType, ServiceAction } from "./choose-service";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

const countries = [
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
];

const serviceTypes = {
  kyb: [
    { id: "business_registration", label: "BUSINESS REGISTRATION" },
    { id: "tax_information", label: "TAX INFORMATION" },
  ],
  kyc: [
    { id: "national_id", label: "NATIONAL ID" },
    { id: "passport", label: "PASSPORT" },
    { id: "drivers_license", label: "DRIVER'S LICENSE" },
  ],
  aml: [
    { id: "individual", label: "INDIVIDUAL CHECK" },
    { id: "business", label: "BUSINESS CHECK" },
  ],
};

interface FillDetailsProps {
  service: ServiceType;
  action: ServiceAction;
  onSubmit: (data: any) => void;
  onGoBack: () => void;
}

export function FillDetails({ service, action, onSubmit, onGoBack }: FillDetailsProps) {
  const [formData, setFormData] = useState({
    country: "KE",
    serviceType: "",
    companyNumber: "",
    postalAddress: "",
    postalCode: "",
    idNumber: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const runVerification = useAction(api.verifications.runVerification);
  const seedMockData = useMutation(api.init.seedMockData);

  const getServiceTypesList = () => {
    if (service?.id === "kyb") return serviceTypes.kyb;
    if (service?.id === "kyc") return serviceTypes.kyc;
    if (service?.id === "aml") return serviceTypes.aml;
    return serviceTypes.kyc;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Ensure test user and company exist (for dev simulation)
      const { companyId, userId } = await seedMockData();
      
      // 2. Call the Convex action to deduct balance, create job, and simulate response
      const result = await runVerification({
        companyId,
        userId,
        serviceType: formData.serviceType || service.id,
        entityData: formData,
        source: "web_api",
      });

      toast.success("Verification completed successfully!");
      // 3. Delegate to parent component
      onSubmit({ ...formData, jobId: result.jobId, resultPayload: result.data });
    } catch (error: any) {
      toast.error(error.message || "Failed to run verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isKYB = service?.id === "kyb";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Fill in the Required Info</h2>
        <p className="text-sm text-gray-500 mt-1">
          The details are used to perform {action?.label || "verification"} on the user
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Country Select */}
        <div className="grid gap-2">
          <Label htmlFor="country-select">Select country *</Label>
          <Select value={formData.country} onValueChange={(val) => handleChange("country", val || "")}>
            <SelectTrigger id="country-select">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Type */}
        <div className="grid gap-2">
          <Label htmlFor="service-type-select">Choose Service Type *</Label>
          <Select value={formData.serviceType} onValueChange={(val) => handleChange("serviceType", val || "")}>
            <SelectTrigger id="service-type-select">
              <SelectValue placeholder="Select a service type" />
            </SelectTrigger>
            <SelectContent>
              {getServiceTypesList().map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.serviceType && (
            <p className="mt-1 text-xs text-red-500">
              ● You will be charged $ for this check
            </p>
          )}
        </div>

        {/* Conditional Fields */}
        {isKYB ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="companyNumber">Company Number *</Label>
                <Input
                  id="companyNumber"
                  value={formData.companyNumber}
                  onChange={(e) => handleChange("companyNumber", e.target.value)}
                  placeholder="Enter company number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalAddress">Postal address (5 digit code) *</Label>
                <Input
                  id="postalAddress"
                  value={formData.postalAddress}
                  onChange={(e) => handleChange("postalAddress", e.target.value)}
                  placeholder="Enter postal address"
                />
              </div>
            </div>
            <div className="max-w-xs grid gap-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                placeholder="Enter postal code"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="w-full grid gap-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                placeholder="Enter ID number"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onGoBack} variant="outline" disabled={isLoading}>
          Go Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !formData.serviceType}
          className="bg-primary hover:bg-[#146c11] text-white min-w-[140px]"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isLoading ? "Processing..." : "Submit Details"}
        </Button>
      </div>
    </div>
  );
}
