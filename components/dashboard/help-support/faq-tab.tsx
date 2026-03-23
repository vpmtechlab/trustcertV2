"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqTab() {
  const faqs = [
    {
      question: "How do I verify a new entity?",
      answer:
        "Go to the Dashboard and click on 'New Verification' in the Quick Actions section. Follow the steps to upload documents and submit for review. The process typically takes 1-2 business days.",
    },
    {
      question: "Where can I find my API keys?",
      answer:
        "Navigate to Settings > API Keys to manage your API credentials. You can view, copy, and regenerate your secret keys there. Remember to keep them secure!",
    },
    {
      question: "How do I upgrade my plan?",
      answer:
        "Go to Settings > Billing to view your current plan. Click on 'Upgrade Plan' to see available options. We offer Pro and Enterprise tiers with enhanced limits and features.",
    },
    {
      question: "Can I invite team members?",
      answer:
        "Yes! You can invite team members from the User Management screen or using the 'Invite Member' quick action on the Dashboard. You can assign different roles like Admin or Editor.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use industry-standard encryption for all data in transit and at rest. Our platform is SOC 2 Type II compliant and regularly audited for security.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="text-sm text-gray-500">
          Find answers to common questions about using the platform.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 px-4">
        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm font-medium text-gray-900 hover:text-secondary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed text-left">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
