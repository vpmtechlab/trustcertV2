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
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Info } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";

const countries = [
	{ code: "KE", name: "Kenya", flag: "🇰🇪" },
	{ code: "UG", name: "Uganda", flag: "🇺🇬" },
	{ code: "TZ", name: "Tanzania", flag: "🇹🇿" },
	{ code: "NG", name: "Nigeria", flag: "🇳🇬" },
	{ code: "GH", name: "Ghana", flag: "🇬🇭" },
	{ code: "ZA", name: "South Africa", flag: "🇿🇦" },
];

interface FillDetailsProps {
	service: ServiceType;
	action: ServiceAction;
	onSubmit: (data: Record<string, unknown>) => void;
	onGoBack: () => void;
}

export function FillDetails({
	service,
	action,
	onSubmit,
	onGoBack,
}: FillDetailsProps) {
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
	const { member, setShowTopUp } = useApp();
	const runVerification = useAction(api.verifications.runVerification);

	// Dynamically fetch check types from Convex using the service slug
	const categoryData = useQuery(api.services.getBySlug, { slug: service.slug });
	const checkTypes = categoryData?.checkTypes ?? [];

	// Fetch real price from Convex based on selected service check type
	const pricingData = useQuery(api.pricing.getPriceByServiceId, 
		formData.serviceType ? { serviceId: formData.serviceType } : "skip"
	);

	const handleSubmit = async () => {
		if (!member?.companyId || !member?.id) {
			toast.error("User session not found. Please log in again.");
			return;
		}

		setIsLoading(true);
		try {
			// 1. Call the Convex action to deduct balance, create job, and simulate response
			// Note: We no longer call seedMockData() here, as it was associate verifications with the wrong company.
			const result = await runVerification({
				companyId: member.companyId as Id<"companies">,
				userId: member.id as Id<"users">,
				serviceType: formData.serviceType || service.slug,
				entityData: formData,
				source: "web_api",
			});

			toast.success("Verification completed successfully!");
			// 2. Delegate to parent component
			onSubmit({
				...formData,
				jobId: result.jobId,
				resultPayload: result.data,
			});
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Failed to run verification";
			
			// Detect insufficient funds to show top-up modal
			if (message.toLowerCase().includes("insufficient balance") || message.toLowerCase().includes("funds")) {
				toast.error("Insufficient funds! Please top up to proceed.");
				setShowTopUp(true);
			} else {
				toast.error(message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const isKYB = service?.slug === "kyb";
	const isAML = service?.slug === "aml";
	const isKRA = service?.slug === "kra";
	
	// Determine if Name fields should be shown (KYB and AML need names, KYC/KRA don't)
	const showNames = isKYB || isAML;
	
	// Determine main ID field label (KRA uses PIN, others use ID Number)
	const idLabel = isKRA ? "KRA PIN" : isKYB ? "Company Number" : "ID Number";
	const idPlaceholder = isKRA ? "Enter KRA PIN" : isKYB ? "Enter company number" : "Enter ID number";

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-bold text-gray-900">
					Fill in the Required Info
				</h2>
				<p className="text-sm text-gray-500 mt-1">
					The details are used to perform {action?.label || "verification"} on
					the target entity
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
      
				{/* Country Select */}
				<div className="gap-2">
					<Label htmlFor="country-select">Select country *</Label>
					<Select
						value={formData.country}
						onValueChange={(val) => handleChange("country", val || "")}
					>
						<SelectTrigger id="country-select" className="w-full">
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

				{/* Service Check Type — dynamically loaded from Convex */}
				<div className="grid gap-2">
					<Label htmlFor="service-type-select">Choose Service Type *</Label>
					<Select
						value={formData.serviceType}
						onValueChange={(val) => handleChange("serviceType", val || "")}
						disabled={checkTypes.length === 0}
					>
						<SelectTrigger id="service-type-select" className="w-full">
							<SelectValue
								placeholder={
									categoryData === undefined
									? "Loading..."
									: checkTypes.length === 0
									? "No check types available"
									: "Select a service type"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{checkTypes.map((type) => (
								<SelectItem key={type._id} value={type.slug}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{formData.serviceType && (
						<div className="mt-1 flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
							<Info size={14} className="text-blue-600" />
							<p className="text-xs font-semibold text-blue-700">
								Service Fee: {pricingData ? `${pricingData.price.toFixed(2)} USD` : "Loading..."}
							</p>
						</div>
					)}
				</div>

				<div className="h-px bg-gray-100 my-2" />

				{/* Conditional Fields Generation */}
				<div className="space-y-4">
					{/* Name Fields (Conditional) */}
					{showNames && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="firstName">{isKYB ? "Company Name" : "First Name"} *</Label>
								<Input
									id="firstName"
									value={formData.firstName}
									onChange={(e) => handleChange("firstName", e.target.value)}
									placeholder={isKYB ? "Enter full company name" : "Enter first name"}
								/>
							</div>
							{!isKYB && (
								<div className="grid gap-2">
									<Label htmlFor="lastName">Last Name *</Label>
									<Input
										id="lastName"
										value={formData.lastName}
										onChange={(e) => handleChange("lastName", e.target.value)}
										placeholder="Enter last name"
									/>
								</div>
							)}
						</div>
					)}

					{/* ID / PIN / Company Number Field (Common for all but customized label) */}
					<div className="w-full grid gap-2">
						<Label htmlFor="idNumber">{idLabel} *</Label>
						<Input
							id="idNumber"
							value={formData.idNumber}
							onChange={(e) => handleChange("idNumber", e.target.value)}
							placeholder={idPlaceholder}
						/>
						{(!isKYB && !isAML) && (
							<p className="text-[10px] text-gray-400 italic">
								* Name and personal details will be automatically retrieved during verification
							</p>
						)}
					</div>

					{/* KYB Specific Address Fields */}
					{isKYB && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="postalAddress">
										Postal address (5 digit code) *
									</Label>
									<Input
										id="postalAddress"
										value={formData.postalAddress}
										onChange={(e) =>
											handleChange("postalAddress", e.target.value)
										}
										placeholder="Enter postal address"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="postalCode">Postal Code *</Label>
									<Input
										id="postalCode"
										value={formData.postalCode}
										onChange={(e) => handleChange("postalCode", e.target.value)}
										placeholder="Enter postal code"
									/>
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Button onClick={onGoBack} variant="outline" disabled={isLoading}>
					Go Back
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={isLoading || !formData.serviceType || !formData.idNumber}
					className="bg-primary hover:bg-[#146c11] text-white min-w-[140px]"
				>
					{isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
					{isLoading ? "Processing..." : "Submit Details"}
				</Button>
			</div>
		</div>
	);
}
