"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApp } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "#nav-dashboard",
    title: "Dashboard Overview",
    content: "Start here to see a high-level summary of your compliance status and recent activity.",
    position: "right",
  },
  {
    target: "#user-stats",
    title: "Performance Metrics",
    content: "Monitor key performance indicators like total jobs and success rates in real-time.",
    position: "bottom",
  },
  {
    target: "#nav-analytics",
    title: "Deep Dive Analytics",
    content: "Access detailed reports and trends to optimize your verification workflows.",
    position: "right",
  },
  {
    target: "#nav-job-list",
    title: "Request Histoy",
    content: "View and manage all past and current verification requests in one place.",
    position: "right",
  },
  {
    target: "#nav-user-management",
    title: "Team Access",
    content: "Invite team members and manage their roles and permissions securely.",
    position: "right",
  },
  {
    target: "#nav-verification",
    title: "Verification Wizard",
    content: "Start a new KYC or KYB verification using our guided multi-step process.",
    position: "right",
  },
  {
    target: "#nav-reports",
    title: "Compliance Reports",
    content: "Generate and export official reports for audits and regulatory requirements.",
    position: "right",
  },
  {
    target: "#nav-billing",
    title: "Wallet & Credits",
    content: "Top up your balance and view detailed transaction history for all services.",
    position: "right",
  },
  {
    target: "#nav-audit-logs",
    title: "System Audit",
    content: "Track all administrative actions for complete transparency and accountability.",
    position: "right",
  },
  {
    target: "#nav-settings",
    title: "Account Settings",
    content: "Manage your profile, API keys, and notification preferences here.",
    position: "right",
  },
  {
    target: "#header-actions",
    title: "Quick Controls",
    content: "Access your profile settings, switch views, or re-run this tour anytime from here.",
    position: "bottom",
  },
];

export function AppTour() {
  const { member, setMember } = useApp();
  const updateTourStatus = useMutation(api.users.updateTourStatus);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Automatically start tour for new users who haven't completed it
    if (member && member.has_completed_tour === false && !isVisible) {
      // Delay slightly to allow layout to settle
      const timer = setTimeout(() => {
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [member, isVisible, startTour]);

  useEffect(() => {
    (window as unknown as { startAppTour: () => void }).startAppTour = startTour;
    return () => { 
      delete (window as unknown as { startAppTour?: () => void }).startAppTour; 
    };
  }, [startTour]);

  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const step = TOUR_STEPS[currentStep];
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isVisible, currentStep]);

  const handleFinish = async () => {
    setIsVisible(false);
    const userId = (member?.id || member?.userId) as Id<"users">;
    if (userId) {
      try {
        await updateTourStatus({ userId, completed: true });
        setMember({ ...member, has_completed_tour: true });
      } catch (e) {
        console.error("Failed to update tour status", e);
      }
    }
  };

  const handleSkip = async () => {
    setIsVisible(false);
    const userId = (member?.id || member?.userId) as Id<"users">;
    if (userId && member?.has_completed_tour === false) {
      try {
        await updateTourStatus({ userId, completed: true });
        setMember({ ...member, has_completed_tour: true });
      } catch (e) {
        console.error("Failed to update tour status", e);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 pointer-events-none">
        {/* Backdrop with hole */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 pointer-events-auto"
          style={{
            clipPath: `polygon(
              0% 0%, 
              0% 100%, 
              ${coords.left}px 100%, 
              ${coords.left}px ${coords.top}px, 
              ${coords.left + coords.width}px ${coords.top}px, 
              ${coords.left + coords.width}px ${coords.top + coords.height}px, 
              ${coords.left}px ${coords.top + coords.height}px, 
              ${coords.left}px 100%, 
              100% 100%, 
              100% 0%
            )`
          }}
          onClick={handleSkip}
        />

        {/* Tooltip */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            top: step.position === "bottom" ? coords.top + coords.height + 20 : 
                 step.position === "top" ? coords.top - 200 :
                 coords.top + (coords.height / 2) - 100,
            left: step.position === "right" ? coords.left + coords.width + 20 :
                  step.position === "left" ? coords.left - 340 :
                  coords.left + (coords.width / 2) - 160
          }}
          className="absolute w-[320px] bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto border border-gray-100"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-[#023e4a]">
              <Milestone size={20} className="text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Step {currentStep + 1} of {TOUR_STEPS.length}</span>
            </div>
            <button onClick={handleSkip} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {step.content}
          </p>

          <div className="flex justify-between items-center">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600"
            >
              Skip Tour
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="h-9 w-9 p-0 rounded-xl"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button 
                onClick={nextStep} 
                className="bg-[#023e4a] hover:bg-[#034e5d] text-white rounded-xl h-9 px-4 font-semibold shadow-lg shadow-teal-900/10"
              >
                {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next Step"}
                {currentStep < TOUR_STEPS.length - 1 && <ChevronRight size={18} className="ml-1" />}
              </Button>
            </div>
          </div>

          {/* Arrow */}
          <div 
            className={`absolute w-4 h-4 bg-white rotate-45 border-gray-100 
              ${step.position === "bottom" ? "-top-2 left-1/2 -translate-x-1/2 border-l border-t" : 
                step.position === "top" ? "-bottom-2 left-1/2 -translate-x-1/2 border-r border-b" :
                step.position === "right" ? "top-1/2 -translate-y-1/2 -left-2 border-l border-b" :
                "top-1/2 -translate-y-1/2 -right-2 border-r border-t"
              }`}
          />
        </motion.div>

        {/* Pulse effect on target */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute border-2 border-teal-500 rounded-lg pointer-events-none"
          style={{
            top: coords.top - 4,
            left: coords.left - 4,
            width: coords.width + 8,
            height: coords.height + 8,
          }}
        />
      </div>
    </AnimatePresence>
  );
}
