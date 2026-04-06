"use client";

import React from "react";
import { HelpCircle, MessageSquare, FileText, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaqTab } from "@/components/dashboard/help-support/faq-tab";
import { ContactTab } from "@/components/dashboard/help-support/contact-tab";
import { DocumentationTab } from "@/components/dashboard/help-support/documentation-tab";
import { LegalTab } from "@/components/dashboard/help-support/legal-tab";

export default function HelpAndSupportPage() {
	const tabs = [
		{ id: "faq", label: "FAQ", icon: HelpCircle },
		{ id: "contact", label: "Contact Us", icon: MessageSquare },
		{ id: "docs", label: "Documentation", icon: FileText },
		{ id: "legal", label: "Legal", icon: Shield },
	];

	return (
		<div className="flex flex-col gap-6 p-2 w-full lg:w-4/5">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
				<p className="text-gray-500">
					Find answers to your questions and get support.
				</p>
			</div>

			<Tabs defaultValue="faq" className="w-full">
				<TabsList className="bg-transparent border-b border-gray-200 w-full justify-start h-auto p-0 flex flex-wrap mb-6">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary border-transparent rounded-none px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-200 transition-all"
							>
								<div className="flex items-center gap-2">
									<Icon size={16} />
									<span>{tab.label}</span>
								</div>
							</TabsTrigger>
						);
					})}
				</TabsList>

				<div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[500px]">
					<TabsContent value="faq" className="mt-0 outline-none">
						<FaqTab />
					</TabsContent>
					<TabsContent value="contact" className="mt-0 outline-none">
						<ContactTab />
					</TabsContent>
					<TabsContent value="docs" className="mt-0 outline-none">
						<DocumentationTab />
					</TabsContent>
					<TabsContent value="legal" className="mt-0 outline-none">
						<LegalTab />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
