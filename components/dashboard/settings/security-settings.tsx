import React, { useState, useContext, useEffect } from "react";
import QRCode from "qrcode";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	X,
	ShieldCheck,
	Copy,
	Check,
	Smartphone,
	Globe,
	Loader2,
	Shield,
} from "lucide-react";
import Image from "next/image";

export function SecuritySettings() {
	const { member } = useContext(AppContext);
	const user = useQuery(
		api.users.getUserById,
		member?.id ? { userId: member.id as Id<"users"> } : "skip",
	);

	const changePassword = useMutation(api.users.changePassword);
	const generateSecret = useMutation(api.auth.generate2FASecret);
	const verifyAndEnable = useMutation(api.auth.verifyAndEnable2FA);
	const disable2FA = useMutation(api.auth.disable2FA);

	const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
	const [setupStep, setSetupStep] = useState<"intro" | "qr" | "verify">(
		"intro",
	);
	const [setupData, setSetupData] = useState<{
		secret: string;
		otpauth: string;
	} | null>(null);
	const [otpCode, setOtpCode] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
	const [copied, setCopied] = useState(false);

	const [loading, setLoading] = useState(false);
	const [passwords, setPasswords] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const handlePasswordChange = async () => {
		if (!member?.id) return;
		if (!passwords.new || passwords.new !== passwords.confirm) {
			toast.error("New passwords do not match.");
			return;
		}

		setLoading(true);
		try {
			await changePassword({
				userId: member.id as Id<"users">,
				newPassword: passwords.new,
			});
			toast.success("Password updated successfully!");
			setPasswords({ current: "", new: "", confirm: "" });
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update password.";
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handle2FAToggle = async (checked: boolean) => {
		if (!member?.id) return;

		if (!checked) {
			// Disable 2FA
			try {
				await disable2FA({ userId: member.id as Id<"users"> });
				toast.success("Two-Factor Authentication disabled.");
			} catch {
				toast.error("Failed to disable 2FA.");
			}
			return;
		}

		// Start 2FA Setup
		setSetupStep("intro");
		setIs2FAModalOpen(true);
	};

	const handleStartSetup = async () => {
		if (!member?.id) return;
		setIsGenerating(true);
		try {
			const data = await generateSecret({ userId: member.id as Id<"users"> });
			setSetupData(data);
			setSetupStep("qr");
		} catch {
			toast.error("Failed to generate 2FA secret.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleVerifySetup = async () => {
		if (!member?.id || !setupData || otpCode.length < 6) return;
		setIsVerifying(true);
		try {
			await verifyAndEnable({
				userId: member.id as Id<"users">,
				secret: setupData.secret,
				code: otpCode,
			});
			toast.success("Two-Factor Authentication enabled!");
			setIs2FAModalOpen(false);
			resetSetup();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Invalid verification code.";
			toast.error(errorMessage);
		} finally {
			setIsVerifying(false);
		}
	};

	const resetSetup = () => {
		setSetupStep("intro");
		setSetupData(null);
		setQrCodeUrl("");
		setOtpCode("");
		setCopied(false);
	};

	useEffect(() => {
		if (setupData?.otpauth) {
			QRCode.toDataURL(setupData.otpauth)
				.then((url) => setQrCodeUrl(url))
				.catch((err) => {
					console.error("Failed to generate QR code:", err);
					toast.error("Failed to generate QR code.");
				});
		}
	}, [setupData]);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const loginHistoryLogs = useQuery(
		api.audit.getLoginHistoryByUser,
		member?.id ? { userId: member.id as Id<"users"> } : "skip",
	);

	const parseUA = (ua?: string) => {
		if (!ua) return "Unknown Device";
		const userAgent = ua.toLowerCase();
		if (userAgent.includes("iphone")) return "iPhone";
		if (userAgent.includes("ipad")) return "iPad";
		if (userAgent.includes("android")) return "Android Device";
		if (userAgent.includes("macintosh")) return "MacBook Pro";
		if (userAgent.includes("windows")) return "Windows PC";
		if (userAgent.includes("linux")) return "Linux PC";
		return "Web Browser";
	};

	return (
		<div className="space-y-8">
			{/* 2FA Section */}
			<div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
				<div className="flex gap-4">
					<div className="p-3 bg-blue-100 rounded-lg h-fit shrink-0">
						<Shield className="text-blue-600" size={24} />
					</div>
					<div>
						<h3 className="text-lg font-bold text-gray-900">
							Two-Factor Authentication
						</h3>
						<p className="text-sm text-gray-600 mt-1 max-w-lg mb-4">
							Add an extra layer of security to your account by requiring both
							your password and a code from your mobile device.
						</p>
						<div className="flex items-center space-x-2">
							<Switch
								id="2fa-toggle"
								checked={user?.twoFactorEnabled ?? false}
								onCheckedChange={handle2FAToggle}
							/>
							<Label
								htmlFor="2fa-toggle"
								className="font-medium cursor-pointer"
							>
								{user?.twoFactorEnabled ? "Enabled" : "Disabled"}
							</Label>
						</div>
					</div>
				</div>
			</div>

			{/* 2FA Setup Modal */}
			{is2FAModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
						{/* Header */}
						<div className="p-6 border-b border-gray-100 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-50 rounded-lg text-blue-600">
									<ShieldCheck size={20} />
								</div>
								<h3 className="font-bold text-gray-900">Configure 2FA</h3>
							</div>
							<button
								onClick={() => {
									setIs2FAModalOpen(false);
									resetSetup();
								}}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={20} className="text-gray-400" />
							</button>
						</div>

						{/* Content */}
						<div className="p-6">
							{setupStep === "intro" && (
								<div className="space-y-6">
									<div className="text-center">
										<p className="text-gray-600 mb-6">
											Protect your account with a second security step.
											We&apos;ll use an authenticator app to generate a
											temporary code.
										</p>
										<div className="space-y-3 text-left">
											<div className="flex gap-3 text-sm">
												<div className="size-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
													1
												</div>
												<p className="text-gray-700">
													Install an authenticator app (Google Authenticator,
													Authy, etc.)
												</p>
											</div>
											<div className="flex gap-3 text-sm">
												<div className="size-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
													2
												</div>
												<p className="text-gray-700">
													Scan the QR code we&apos;ll provide
												</p>
											</div>
											<div className="flex gap-3 text-sm">
												<div className="size-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
													3
												</div>
												<p className="text-gray-700">
													Enter the verification code to finish setup
												</p>
											</div>
										</div>
									</div>
									<Button
										onClick={handleStartSetup}
										disabled={isGenerating}
										className="w-full bg-secondary hover:bg-gray-800 text-white"
									>
										{isGenerating ? (
											<Loader2 className="animate-spin size-4" />
										) : (
											"Get Started"
										)}
									</Button>
								</div>
							)}

							{setupStep === "qr" && setupData && (
								<div className="space-y-6">
									<div className="flex flex-col items-center">
										<div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 min-w-[200px] min-h-[200px] flex items-center justify-center">
											{qrCodeUrl ? (
												<Image
													src={qrCodeUrl}
													alt="2FA QR Code"
													width={160}
													height={160}
													className="animate-in fade-in duration-500"
												/>
											) : (
												<div className="size-40 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center">
													<Loader2 className="animate-spin text-gray-300" />
												</div>
											)}
										</div>
										<p className="text-center text-sm text-gray-500 mb-4 px-4">
											Scan this QR code with your authenticator app.
										</p>
										<div className="w-full p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
											<code className="text-xs font-mono text-gray-600">
												{setupData.secret}
											</code>
											<button
												onClick={() => copyToClipboard(setupData.secret)}
												className="text-blue-600 hover:text-blue-700 p-1"
											>
												{copied ? <Check size={16} /> : <Copy size={16} />}
											</button>
										</div>
										<p className="text-[10px] text-gray-400 mt-2">
											Can&apos;t scan? Use the secret key above.
										</p>
									</div>
									<Button
										onClick={() => setSetupStep("verify")}
										className="w-full bg-secondary hover:bg-gray-800 text-white"
									>
										I&apos;ve Scanned It
									</Button>
								</div>
							)}

							{setupStep === "verify" && (
								<div className="space-y-6">
									<div className="text-center space-y-4">
										<p className="text-gray-600">
											Enter the 6-digit code from your app to verify the setup.
										</p>
										<div className="flex justify-center">
											<InputOTP
												id="otp-setup"
												maxLength={6}
												value={otpCode}
												onChange={(value) => setOtpCode(value)}
												containerClassName="justify-center"
											>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</div>
									</div>
									<div className="space-y-3">
										<Button
											onClick={handleVerifySetup}
											disabled={isVerifying || otpCode.length < 6}
											className="w-full bg-secondary hover:bg-gray-800 text-white"
										>
											{isVerifying ? (
												<Loader2 className="animate-spin size-4" />
											) : (
												"Verify & Enable"
											)}
										</Button>
										<Button
											variant="ghost"
											onClick={() => setSetupStep("qr")}
											className="w-full text-gray-500"
										>
											Back to QR Code
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Change Password */}
			<div>
				<h3 className="text-lg font-bold text-gray-900 mb-4">
					Change Password
				</h3>
				<div className="max-w-md space-y-4">
					<div className="space-y-2">
						<Label htmlFor="current-password">Current Password</Label>
						<Input
							id="current-password"
							type="password"
							placeholder="Enter current password"
							value={passwords.current}
							onChange={(e) =>
								setPasswords((prev) => ({ ...prev, current: e.target.value }))
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="new-password">New Password</Label>
						<Input
							id="new-password"
							type="password"
							placeholder="Enter new password"
							value={passwords.new}
							onChange={(e) =>
								setPasswords((prev) => ({ ...prev, new: e.target.value }))
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirm-password">Confirm New Password</Label>
						<Input
							id="confirm-password"
							type="password"
							placeholder="Confirm new password"
							value={passwords.confirm}
							onChange={(e) =>
								setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
							}
						/>
					</div>
				</div>
				<div className="mt-6">
					<Button
						onClick={handlePasswordChange}
						disabled={loading}
						className="bg-secondary hover:bg-gray-800 text-white w-full sm:w-auto"
					>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Update Password
					</Button>
				</div>
			</div>

			<hr className="border-gray-100" />

			{/* Login History */}
			<div>
				<h3 className="text-lg font-bold text-gray-900 mb-4">
					Recent Login Activity
				</h3>
				<div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
							<tr>
								<th className="px-4 py-3">Device</th>
								<th className="px-4 py-3">Location</th>
								<th className="px-4 py-3">Date</th>
								<th className="px-4 py-3">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{loginHistoryLogs === undefined ? (
								<tr>
									<td
										colSpan={4}
										className="px-4 py-8 text-center text-gray-500"
									>
										<Loader2 className="animate-spin size-4 mx-auto mb-2" />
										Loading activity...
									</td>
								</tr>
							) : loginHistoryLogs.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="px-4 py-8 text-center text-gray-500"
									>
										No recent login activity found.
									</td>
								</tr>
							) : (
								loginHistoryLogs.map((log, index) => {
									const device = parseUA(log.metadata?.userAgent as string);
									const location =
										(log.metadata?.location as string) || "Unknown";
									const date = format(log.createdAt, "MMM d, h:mm a");
									// First item in a recent fetch is likely the current session
									const status = index === 0 ? "Active, Current" : "Signed out";

									return (
										<tr key={log._id} className="hover:bg-gray-50/50">
											<td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
												{device.includes("iPhone") ||
												device.includes("Android") ? (
													<Smartphone
														size={16}
														className="text-gray-400 shrink-0"
													/>
												) : (
													<Globe size={16} className="text-gray-400 shrink-0" />
												)}
												<span className="truncate">{device}</span>
											</td>
											<td className="px-4 py-3 text-gray-600 whitespace-nowrap">
												{location}
											</td>
											<td className="px-4 py-3 text-gray-500 whitespace-nowrap">
												{date}
											</td>
											<td className="px-4 py-3 whitespace-nowrap">
												<span
													className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
														status.includes("Active")
															? "bg-green-50 text-green-700"
															: "bg-gray-100 text-gray-600"
													}`}
												>
													{status}
												</span>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			<hr className="border-gray-100" />

			{/* Danger Zone */}
			<div>
				<h3 className="text-lg font-bold text-red-600 mb-3">Danger Zone</h3>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-100 bg-red-50 rounded-xl">
					<div>
						<h4 className="font-medium text-gray-900">Delete Account</h4>
						<p className="text-sm text-gray-500 mt-1">
							Permanently delete your account and all data.
						</p>
					</div>
					<Button
						variant="outline"
						className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
					>
						Delete Account
					</Button>
				</div>
			</div>
		</div>
	);
}
