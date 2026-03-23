"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
	const router = useRouter();
	const createCompanyAndUser = useMutation(api.users.createCompanyAndUser);

	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	// Step 1: Company Info
	const [companyName, setCompanyName] = useState("");
	const [regNumber, setRegNumber] = useState("");
	const [country, setCountry] = useState("");
	const [location, setLocation] = useState("");
	const [domain, setDomain] = useState("");

	// Step 2: Admin Info
	const [firstName, setFirstName] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreeTerms, setAgreeTerms] = useState<boolean | string>(false);

	const hasLength = password.length >= 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

	const handleNext = (e: React.FormEvent) => {
		e.preventDefault();
		if (companyName && regNumber && country && location && domain) {
			setStep(2);
		} else {
			toast.error("Please fill in all company details.");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!firstName || !surname || !email || !password || !confirmPassword || !agreeTerms) {
			toast.error(
				"Please fill in all personal details and agree to the terms.",
			);
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
		
		if (password.length < 8 || !hasUpperCase || !hasLowerCase || !hasSpecialChar) {
			toast.error("Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, and a special character.");
			return;
		}

		setIsLoading(true);
		try {
			const res = await createCompanyAndUser({
				companyName,
				regNumber,
				country,
				location,
				domain,
				firstName,
				surname,
				email,
				password,
			});

			console.log(res);
			toast.success("Account created successfully! Welcome to TrustCert.");
			
			// Clear form state
			setCompanyName("");
			setRegNumber("");
			setCountry("");
			setLocation("");
			setDomain("");
			setFirstName("");
			setSurname("");
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setAgreeTerms(false);
			setStep(1);

			// Trigger sign-in tab switch or redirect
			if (onSuccess) {
				onSuccess();
			} else {
				router.push("/login");
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to create account. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full">
			{/* Progress Indicator */}
			<div className="flex items-center justify-between mb-8 px-2 relative">
				<div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-100 -z-10 -translate-y-1/2 rounded" />
				<div className="flex flex-col items-center">
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? "bg-[#023e4a] text-white" : "bg-gray-100 text-gray-400"}`}
					>
						1
					</div>
					<span className="text-xs text-center mt-2 font-medium text-gray-600">
						Company
					</span>
				</div>
				<div className="flex flex-col items-center">
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? "bg-[#023e4a] text-white" : "bg-gray-100 text-gray-400"}`}
					>
						2
					</div>
					<span className="text-xs text-center mt-2 font-medium text-gray-600">
						Admin
					</span>
				</div>
			</div>

			{step === 1 ? (
				<div
					className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300"
				>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="companyName">Company Name</Label>
							<Input
								id="companyName"
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
								placeholder="Acme Corporation Ltd"
								required
								className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="regNumber">Registration Number</Label>
							<Input
								id="regNumber"
								value={regNumber}
								onChange={(e) => setRegNumber(e.target.value)}
								placeholder="BN-1234567"
								required
								className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="country">Country</Label>
								<Input
									id="country"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									placeholder="Kenya"
									required
									className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="location">City / Location</Label>
								<Input
									id="location"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
									placeholder="Nairobi"
									required
									className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="domain">Company Domain</Label>
							<Input
								id="domain"
								value={domain}
								onChange={(e) => setDomain(e.target.value)}
								placeholder="acme.com"
								required
								className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
							/>
						</div>
					</div>

					<Button
						onClick={handleNext}
						size="lg"
						variant="secondary"
						className="w-full mt-6 transition-colors text-white font-semibold shadow-lg text-sm gap-2"
					>
						Continue to Admin Profile <ArrowRight size={16} />
					</Button>
				</div>
			) : (
				<form
					onSubmit={handleSubmit}
					className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300"
				>
					<Button
						type="button"
						variant="ghost"
						onClick={() => setStep(1)}
						className="p-0 h-auto text-gray-500 hover:text-gray-900 hover:bg-transparent mb-2 gap-1"
					>
						<ArrowLeft size={14} /> Back to Company Info
					</Button>

					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="John"
									required
									className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="surname">Surname</Label>
								<Input
									id="surname"
									value={surname}
									onChange={(e) => setSurname(e.target.value)}
									placeholder="Doe"
									required
									className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Work Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="john@acme.com"
								required
								className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Create a secure password"
								required
								className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
							/>
							{password.length > 0 && (
								<div className="flex flex-col gap-1 mt-1 text-xs">
									<span className={hasLength ? "text-green-600 font-medium" : "text-gray-400"}>
										{hasLength ? "✓" : "○"} At least 8 characters
									</span>
									<span className={hasUpperCase && hasLowerCase ? "text-green-600 font-medium" : "text-gray-400"}>
										{hasUpperCase && hasLowerCase ? "✓" : "○"} Uppercase & lowercase letters
									</span>
									<span className={hasSpecialChar ? "text-green-600 font-medium" : "text-gray-400"}>
										{hasSpecialChar ? "✓" : "○"} Special character (!@#$)
									</span>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm your password"
								required
								className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20"
							/>
						</div>
					</div>

					<div className="flex items-center space-x-2 pt-2">
						<Checkbox
							id="terms"
							checked={!!agreeTerms}
							onCheckedChange={(checked) => setAgreeTerms(checked)}
						/>
						<Label
							htmlFor="terms"
							className="text-gray-600 text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							I agree to the{" "}
							<a href="#" className="text-[#023e4a] hover:underline">
								Terms
							</a>{" "}
							&{" "}
							<a href="#" className="text-[#023e4a] hover:underline">
								Policy
							</a>
						</Label>
					</div>

					<Button
						type="submit"
						disabled={!agreeTerms || isLoading}
						className="w-full mt-6 transition-colors text-white font-semibold shadow-lg text-sm gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
							</>
						) : (
							"Complete Registration"
						)}
					</Button>
				</form>
			)}
		</div>
	);
}
