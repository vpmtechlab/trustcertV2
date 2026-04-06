"use client";

import React, { useState } from "react";
import {
	ChevronRight,
	Terminal,
	Code2,
	Key,
	Copy,
	Check,
	ArrowRight,
	Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { toast } from "sonner";

const languages = [
	{ id: "curl", name: "cURL", icon: Terminal },
	{ id: "node", name: "Node.js", icon: Code2 },
	{ id: "python", name: "Python", icon: Code2 },
	{ id: "go", name: "GoLang", icon: Code2 },
	{ id: "php", name: "PHP", icon: Code2 },
];

const codeSamples: Record<string, string> = {
	curl: `curl -X POST https://trustcert-api.convex.site/v1/verifications \\
  -H "X-API-KEY: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "enhanced_kyc",
    "data": {
      "firstName": "John",
      "surname": "Doe",
      "id_number": "12345678"
    },
    "webhook_url": "https://your-server.com/webhooks"
  }'`,
	node: `const fetch = require('node-fetch');

async function runVerification() {
  const response = await fetch('https://trustcert-api.convex.site/v1/verifications', {
    method: 'POST',
    headers: {
      'X-API-KEY': 'your_api_key_here',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'enhanced_kyc',
      data: {
        firstName: 'John',
        surname: 'Doe',
        id_number: '12345678'
      }
    })
  });

  const result = await response.json();
  console.log(result);
}

runVerification();`,
	python: `import requests
import json

url = "https://trustcert-api.convex.site/v1/verifications"
headers = {
    "X-API-KEY": "your_api_key_here",
    "Content-Type": "application/json"
}

payload = {
    "type": "enhanced_kyc",
    "data": {
        "firstName": "John",
        "surname": "Doe",
        "id_number": "12345678"
    }
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`,
	go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    url := "https://trustcert-api.convex.site/v1/verifications"
    payload := map[string]interface{}{
        "type": "enhanced_kyc",
        "data": map[string]string{
            "firstName": "John",
            "surname": "Doe",
            "id_number": "12345678",
        },
    }

    jsonData, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    
    req.Header.Set("X-API-KEY", "your_api_key_here")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    fmt.Println(resp.Status)
}`,
	php: `<?php

$url = "https://trustcert-api.convex.site/v1/verifications";
$apiKey = "your_api_key_here";

$data = [
    "type" => "enhanced_kyc",
    "data" => [
        "firstName" => "John",
        "surname" => "Doe",
        "id_number" => "12345678"
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-KEY: " . $apiKey,
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`,
};

export default function DocumentationPage() {
	const [activeLang, setActiveLang] = useState("curl");
	const [copied, setCopied] = useState(false);
	const { member } = useApp();

	const handleCopy = () => {
		navigator.clipboard.writeText(codeSamples[activeLang]);
		setCopied(true);
		toast.success("Code copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex flex-col gap-8 max-w-[1200px] mx-auto p-4 animate-in fade-in duration-700">
			{/* Hero Header - Explicit Dark Background */}
			<div
				style={{ backgroundColor: "#0e1b42" }}
				className="relative overflow-hidden p-4 rounded-lg text-white shadow-2xl border border-white/5"
			>
				<div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded- blur-[100px] -translate-y-1/2 translate-x-1/2" />

				<div className="relative z-10 md:w-3/4">
					<div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
						<Cpu
							size={14}
							className="text-primary-foreground bg-primary rounded-sm p-0.5"
						/>
						<span className="text-white">Developer Portal</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-white">
						Build with the <span className="text-primary">TrustCert</span> SDK
					</h1>
					<p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl font-medium">
						The most reliable verification engine for modern fintech and
						compliance teams. Automate your BRS, KRA, and identity workflows in
						minutes.
					</p>
					<div className="flex flex-wrap gap-5">
						<Button className="bg-primary hover:bg-[#156a15] text-white rounded-2xl px-8 h-14 font-extrabold flex items-center gap-3 transition-all shadow-lg active:scale-95">
							Explore API Reference <ArrowRight size={20} />
						</Button>
						<Button
							variant="outline"
							className=" px-8 h-14 font-bold border-2 text-gray-900"
						>
							GitHub Repository
						</Button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Navigation Sidebar */}
				<aside className="lg:col-span-3 space-y-10">
					<div>
						<h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-6">
							Documentation
						</h3>
						<nav className="flex flex-col gap-2">
							{[
								{ name: "Authentication", active: true },
								{ name: "Verifications", active: false },
								{ name: "Webhooks", active: false },
								{ name: "Rate Limits", active: false },
								{ name: "Status Codes", active: false },
							].map((item) => (
								<button
									key={item.name}
									className={`flex items-center justify-between px-4 py-5 rounded-2xl text-sm font-bold transition-all duration-300 ${
										item.active
											? "bg-teal-50 text-teal-800 shadow-sm border border-teal-100"
											: "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
									}`}
								>
									{item.name}
									{item.active && (
										<ChevronRight size={16} className="text-primary" />
									)}
								</button>
							))}
						</nav>
					</div>

					<div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner group">
						<div className="flex items-center gap-3 text-gray-900 font-black text-sm mb-3">
							<Key size={18} className="text-primary" />
							<span>Your API Key</span>
						</div>
						<p className="text-xs text-gray-500 leading-relaxed mb-6 font-medium">
							Authenticate your requests using your private key. Keep it secret
							and out of client-side code.
						</p>
						<Button
							variant="default"
							className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl font-bold py-2 shadow-sm"
							onClick={() => (window.location.href = "/dashboard/settings")}
						>
							Settings
						</Button>
					</div>
				</aside>

				{/* Documentation Content */}
				<main className="lg:col-span-9 space-y-16">
					<section id="auth" className="scroll-mt-24 space-y-8">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-teal-50 rounded-2xl text-primary">
								<Terminal size={28} />
							</div>
							<div>
								<h2 className="text-3xl font-black text-gray-900 tracking-tight">
									Authentication
								</h2>
								<div className="h-1.5 w-12 bg-primary rounded-full mt-1" />
							</div>
						</div>

						<div className="space-y-4 max-w-3xl">
							<p className="text-gray-600 text-lg leading-relaxed font-medium">
								All requests to the TrustCert API must include an{" "}
								<code className="bg-gray-100 px-2 py-0.5 rounded-lg text-primary font-mono font-bold">
									X-API-KEY
								</code>{" "}
								header. This key acts as a secure credential for your
								organization.
							</p>
						</div>

						{/* Code Block - High Fidelity Dark Mode for Code */}
						<div className="bg-slate-900 rounded-lg p-4 mb-10 overflow-hidden shadow-2xl border border-white/5 group">
							<div className="flex items-center justify-between px-6 py-5 bg-black/20 border-b border-white/5">
								<div className="flex items-center gap-1.5">
									{languages.map((lang) => (
										<button
											key={lang.id}
											onClick={() => setActiveLang(lang.id)}
											className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${
												activeLang === lang.id
													? "bg-primary text-white shadow-lg"
													: "text-gray-500 hover:text-gray-300 hover:bg-white/5"
											}`}
										>
											{lang.name}
										</button>
									))}
								</div>

								<button
									onClick={handleCopy}
									className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5"
								>
									{copied ? (
										<>
											<Check size={14} className="text-primary" />
											<span>Copied</span>
										</>
									) : (
										<>
											<Copy size={14} />
											<span>Copy Code</span>
										</>
									)}
								</button>
							</div>

							<div className="p-10 overflow-x-auto min-h-[300px] flex items-center">
								<pre className="text-sm font-mono text-emerald-300 leading-loose w-full">
									{codeSamples[activeLang]}
								</pre>
							</div>
						</div>
					</section>

					{/* Response Object Section */}
					<section className="bg-gray-50 rounded-lg p-4 border border-gray-100">
						<h3 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-primary pl-6">
							Response Payload
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div className="space-y-6">
								<p className="text-gray-500 font-medium leading-relaxed">
									Every API request returns a standardized JSON object. Pay
									attention to the{" "}
									<code className="text-primary font-bold">jobId</code> as it is
									required for polling verification results.
								</p>
								<div className="space-y-3">
									{[
										{ field: "success", type: "bool", desc: "Request status" },
										{ field: "jobId", type: "uid", desc: "Reference ID" },
										{ field: "status", type: "int", desc: "HTTP code" },
									].map((item) => (
										<div
											key={item.field}
											className="flex items-center gap-6 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
										>
											<div className="font-mono text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
												{item.field}
											</div>
											<div>
												<div className="text-xs text-gray-900 font-black">
													{item.desc}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl">
								<pre className="text-xs font-mono text-blue-300 leading-[1.8]">
									{`{
  "success": true,
  "jobId": "kyc_8h2j9sx",
  "status": 201,
  "message": "Job initiated",
  "data": {
    "feesCharged": 15.00
  }
}`}
								</pre>
							</div>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
