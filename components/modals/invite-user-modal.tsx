"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";
import { getErrorMessage } from "@/lib/utils";

interface InviteUserModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function InviteUserModal({
	isOpen,
	onClose,
}: InviteUserModalProps) {
	const { member } = useApp();
	const inviteUser = useMutation(api.users.inviteUser);
	const sendEmail = useAction(api.emails.sendWelcomeEmail);

	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [surname, setSurname] = useState("");
	const [role, setRole] = useState("Compliance Officer");
	const [isLoading, setIsLoading] = useState(false);

	const handleInvite = async () => {
		if (!member?.companyId) {
			toast.error("Company information missing. Please log in again.");
			return;
		}

		if (!email || !firstName || !surname) {
			toast.error("Please fill in all details.");
			return;
		}

		// Check for personal email
		const personalDomains = [
			"gmail.com",
			"yahoo.com",
			"hotmail.com",
			"outlook.com",
			"live.com",
			"msn.com",
			"icloud.com",
			"me.com",
			"aol.com",
			"mail.com",
			"protonmail.com",
			"zoho.com",
			"yandex.com",
		];
		const domain = email.split("@")[1]?.toLowerCase();
		if (personalDomains.includes(domain)) {
			toast.error(
				"Please use a work email address. Personal emails (e.g. Gmail, Yahoo) are not permitted.",
			);
			return;
		}

		setIsLoading(true);
		try {
			// 1. Create user in DB
			const result = await inviteUser({
				companyId: member.companyId as Id<"companies">,
				firstName,
				surname,
				email,
				role,
			});

			toast.success("User invited! Sending welcome email...");

			// 2. Trigger welcome email (fire and forget or wait depends on UX, usually action is async)
			const emailResult = await sendEmail({
				email,
				firstName,
				tempPassword: result.tempPassword,
				setupToken: result.setupToken,
			});

			if (emailResult.sent) {
				toast.success(`Welcome email sent to ${email}`);
			} else {
				toast.warning(
					`User invited, but email delivery failed: ${emailResult.error}`,
				);
				console.warn(
					"Email failed:",
					emailResult.error,
					"Temp Pass was:",
					result.tempPassword,
				);
			}

			// Reset form
			setEmail("");
			setFirstName("");
			setSurname("");
			setRole("Compliance Officer");
			onClose();
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && !isLoading && onClose()}
		>
			<DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
				<div className="bg-secondary p-6 text-white">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-white">
							Invite Team Member
						</DialogTitle>
						<DialogDescription className="text-teal-50/70">
							Grow your team by inviting a new member. They will receive an
							email with login credentials.
						</DialogDescription>
					</DialogHeader>
				</div>

				<div className="p-6 space-y-4 bg-white">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName" className="text-gray-700 font-medium">
								First Name
							</Label>
							<Input
								id="firstName"
								placeholder="Jane"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
								disabled={isLoading}
								className="bg-gray-50 border-gray-100 focus:border-[#023e4a] focus:ring-[#023e4a]/10"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="surname" className="text-gray-700 font-medium">
								Surname
							</Label>
							<Input
								id="surname"
								placeholder="Smith"
								value={surname}
								onChange={(e) => setSurname(e.target.value)}
								required
								disabled={isLoading}
								className="bg-gray-50 border-gray-100 focus:border-[#023e4a] focus:ring-[#023e4a]/10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="text-gray-700 font-medium">
							Email Address
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="jane.smith@company.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
							className="bg-gray-50 border-gray-100 focus:border-[#023e4a] focus:ring-[#023e4a]/10"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="role" className="text-gray-700 font-medium">
							Assigned Role
						</Label>
						<Select
							value={role}
							onValueChange={(val) => val && setRole(val)}
							disabled={isLoading}
						>
							<SelectTrigger className="bg-gray-50 border-gray-100 focus:border-[#023e4a] focus:ring-[#023e4a]/10 w-full">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Admin">Admin</SelectItem>
								<SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<DialogFooter className="pt-4 gap-4">
						<div className="gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button onClick={handleInvite} disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
										Inviting...
									</>
								) : (
									"Send Invitation"
								)}
							</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
