"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApp } from "@/components/providers/app-provider";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const login = useMutation(api.users.login);
	const { setMember } = useApp();

	const handleSubmit = async () => {
		if (!email || !password) {
			toast.warning("Email and Password are required!");
			return;
		}

		setIsLoading(true);
		try {
			const result = await login({ email, password });

			// Simple local auth state persistence for MVP
			localStorage.setItem("userId", result.userId);
			localStorage.setItem("companyId", result.companyId);
			setMember(result);

			toast.success("Login Successful!");

			// Clear form state
			setEmail("");
			setPassword("");

			// Role-based/Domain-based routing
			if (email.includes("@vpmtechlab.com")) {
				router.push("/admin");
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Invalid email or password.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full space-y-4">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email Address</Label>
					<Input
						id="email"
						type="email"
						placeholder="Enter your email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20 rounded-lg py-2"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="bg-gray-50 border-gray-200 focus:border-[#023e4a] focus:ring-[#023e4a]/20 rounded-lg py-2"
					/>
				</div>
			</div>

			<Button
				onClick={handleSubmit}
				variant="secondary"
				size="lg"
				disabled={isLoading}
				className="w-full mt-6 py-3 transition-colors text-white font-semibold shadow-lg text-sm gap-2"
			>
				{isLoading ? "Signing In..." : "Sign In"}
			</Button>
		</div>
	);
}
