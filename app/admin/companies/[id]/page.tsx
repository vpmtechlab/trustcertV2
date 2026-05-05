"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Loader2, 
  User, 
  Building2, 
  Mail, 
  Globe, 
  MapPin, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/lib/utils";

export default function CompanyDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const id = params.id as Id<"companies">;

	const company = useQuery(api.admin.getCompanyById, { companyId: id });
	const users = useQuery(api.admin.getCompanyUsers, { companyId: id });
	const updateCompany = useMutation(api.admin.updateCompany);

	const [name, setName] = useState("");
	const [domain, setDomain] = useState("");
	const [status, setStatus] = useState("");
	const [country, setCountry] = useState("");
	const [location, setLocation] = useState("");
	const [supportEmail, setSupportEmail] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (company) {
			setName(company.name);
			setDomain(company.domain);
			setStatus(company.status);
			setCountry(company.country);
			setLocation(company.location);
			setSupportEmail(company.support_email);
		}
	}, [company]);

	const handleUpdate = async () => {
		setIsSaving(true);
		try {
			await updateCompany({
				companyId: id,
				name,
				domain,
				status,
				country,
				location,
				support_email: supportEmail,
			});
			toast.success("Company updated successfully!");
		} catch (error) {
			toast.error(getErrorMessage(error));
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	if (company === undefined) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (company === null) {
		return (
			<div className="p-8 text-center">
				<h1 className="text-2xl font-bold text-gray-900">Company Not Found</h1>
				<p className="text-gray-500 mt-2 text-sm">The organization you&apos;re looking for doesn&apos;t exist or has been removed.</p>
				<Button className="mt-6" onClick={() => router.push("/admin/companies")}>
					Back to Companies
				</Button>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-8 space-y-8">
			{/* Breadcrumbs & Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<Link href="/admin/companies" className="hover:text-primary transition-colors">Companies</Link>
					<ChevronRight className="w-4 h-4" />
					<span className="text-gray-900 font-medium">{company.name}</span>
				</div>
				
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
							<Building2 className="w-6 h-6" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight">{company.name}</h1>
							<p className="text-gray-500 flex items-center gap-1.5 text-sm mt-0.5">
								<Globe className="w-3.5 h-3.5" /> {company.domain}
							</p>
						</div>
					</div>
					<Button variant="outline" className="gap-2 self-start md:self-auto" onClick={() => router.push("/admin/companies")}>
						<ArrowLeft className="w-4 h-4" /> Back to List
					</Button>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<p className="text-sm text-gray-500 font-medium">Wallet Balance</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">${company.availableBalance.toFixed(2)}</p>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<p className="text-sm text-gray-500 font-medium">Total Users</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">{company.userCount}</p>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<p className="text-sm text-gray-500 font-medium">Verifications</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">{company.verificationCount}</p>
				</div>
				<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
					<p className="text-sm text-gray-500 font-medium">Joined Date</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">{new Date(company.createdAt).toLocaleDateString()}</p>
				</div>
			</div>

			{/* Main Content Tabs */}
			<div className="bg-white border text-gray-900 border-gray-100 rounded-2xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
				<Tabs defaultValue="users" className="flex-1 flex flex-col">
					<div className="px-6 border-b border-gray-100 pt-2">
						<TabsList className="bg-transparent h-auto p-0 gap-8">
							<TabsTrigger
								value="users"
								className="rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-4 px-1 text-base font-semibold text-gray-500 data-[state=active]:text-primary"
							>
								Users & Roles
							</TabsTrigger>
							<TabsTrigger
								value="edit"
								className="rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-4 px-1 text-base font-semibold text-gray-500 data-[state=active]:text-primary"
							>
								Edit Details
							</TabsTrigger>
						</TabsList>
					</div>

					<div className="flex-1 p-6">
						<TabsContent value="users" className="mt-0 outline-none">
							{users === undefined ? (
								<div className="flex justify-center py-20">
									<Loader2 className="w-10 h-10 animate-spin text-primary/30" />
								</div>
							) : users.length === 0 ? (
								<div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
									<User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
									<h3 className="text-lg font-semibold text-gray-900">No users found</h3>
									<p className="text-gray-500 text-sm">There are no team members registered under this organization.</p>
								</div>
							) : (
								<div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
									<Table>
										<TableHeader className="bg-gray-50/50">
											<TableRow>
												<TableHead className="font-semibold text-gray-700">Name</TableHead>
												<TableHead className="font-semibold text-gray-700">Email Address</TableHead>
												<TableHead className="font-semibold text-gray-700">System Role</TableHead>
												<TableHead className="font-semibold text-gray-700">Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{users.map((user) => (
												<TableRow key={user._id} className="hover:bg-gray-50/30 transition-colors">
													<TableCell className="font-medium text-gray-900">
														{user.firstName} {user.surname}
													</TableCell>
													<TableCell className="text-gray-600">{user.email}</TableCell>
													<TableCell>
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
															{user.role}
														</span>
													</TableCell>
													<TableCell>
														<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border
															${user.status === "active" ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-700 border-gray-100"}`}
														>
															{user.status}
														</span>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</TabsContent>

						<TabsContent value="edit" className="mt-0 outline-none max-w-4xl">
							<div className="space-y-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="comp-name" className="text-gray-700 font-semibold tracking-tight">Organization Name</Label>
										<div className="relative">
											<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
											<Input
												id="comp-name"
												className="pl-10 h-11 focus:ring-primary/20 bg-gray-50/30 border-gray-200"
												value={name}
												onChange={(e) => setName(e.target.value)}
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="comp-domain" className="text-gray-700 font-semibold tracking-tight">Domain Registry</Label>
										<div className="relative">
											<Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
											<Input
												id="comp-domain"
												className="pl-10 h-11 focus:ring-primary/20 bg-gray-50/30 border-gray-200"
												value={domain}
												onChange={(e) => setDomain(e.target.value)}
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="comp-email" className="text-gray-700 font-semibold tracking-tight">Technical Support Email</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
											<Input
												id="comp-email"
												type="email"
												className="pl-10 h-11 focus:ring-primary/20 bg-gray-50/30 border-gray-200"
												value={supportEmail}
												onChange={(e) => setSupportEmail(e.target.value)}
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="comp-status" className="text-gray-700 font-semibold tracking-tight">Operational Status</Label>
										<select
											id="comp-status"
											className="flex h-11 w-full rounded-md border border-gray-200 bg-gray-50/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											value={status}
											onChange={(e) => setStatus(e.target.value)}
										>
											<option value="active">Active & Operational</option>
											<option value="inactive">Locked / Inactive</option>
										</select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="comp-country" className="text-gray-700 font-semibold tracking-tight">Registration Country</Label>
										<Input
											id="comp-country"
											className="h-11 bg-gray-50/30 border-gray-200"
											value={country}
											onChange={(e) => setCountry(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="comp-location" className="text-gray-700 font-semibold tracking-tight">Office Location</Label>
										<div className="relative">
											<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
											<Input
												id="comp-location"
												className="pl-10 h-11 focus:ring-primary/20 bg-gray-50/30 border-gray-200"
												value={location}
												onChange={(e) => setLocation(e.target.value)}
												required
											/>
										</div>
									</div>
								</div>

								<div className="pt-8 border-t border-gray-100 flex justify-end gap-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.push("/admin/companies")}
										disabled={isSaving}
										className="px-8 h-11 shadow-lg shadow-primary/20"
									>
										Cancel
									</Button>
									<Button onClick={handleUpdate} disabled={isSaving} className="gap-2 px-8 h-11 shadow-lg shadow-primary/20">
										{isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
										Save Organization Profiles
									</Button>
								</div>
							</div>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
