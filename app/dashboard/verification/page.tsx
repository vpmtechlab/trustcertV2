"use client";

import React, { useState } from "react";
import { Shield, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { ChooseService, ServiceType, ServiceAction } from "@/components/dashboard/verification/choose-service";
import { SelectAction } from "@/components/dashboard/verification/select-action";
import { FillDetails } from "@/components/dashboard/verification/fill-details";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, label: "Choose Service", description: "Select verification type" },
  { id: 2, label: "Select Action", description: "Pick specific action" },
  { id: 3, label: "Fill Details", description: "Enter user information" },
];

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedAction, setSelectedAction] = useState<ServiceAction | null>(null);

  const router = useRouter();

  const handleSelectService = (service: ServiceType) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleSelectAction = (action: ServiceAction) => {
    setSelectedAction(action);
    setCurrentStep(3);
  };

  const handleSubmit = (data: any) => {
    // Navigate to the newly created job
    if (data.jobId) {
      router.push(`/dashboard/jobs/view/${data.jobId}`);
    } else {
      // Fallback if no jobId (e.g., error case)
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedAction(null);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      if (stepId === 1) {
        setSelectedService(null);
        setSelectedAction(null);
      } else if (stepId === 2) {
        setSelectedAction(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-secondary via-secondary/90 to-primary rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Run a Quick Verification
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Perform identity verification in just 3 simple steps
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <Sparkles className="text-yellow-300" size={16} />
            <span className="text-white text-sm font-medium">SmartVerify™</span>
          </div>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isClickable = step.id < currentStep;

            return (
              <React.Fragment key={step.id}>
                {/* Step */}
                <div
                  onClick={() => isClickable && handleStepClick(step.id)}
                  className={`flex flex-col md:flex-row items-center gap-3 ${
                    isClickable ? "cursor-pointer" : ""
                  }`}
                >
                  {/* Step Circle */}
                  <div
                    className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                      font-semibold text-sm md:text-base transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : isActive
                            ? "bg-secondary text-white shadow-lg shadow-secondary/30 ring-4 ring-secondary/20"
                            : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : isActive ? (
                      <Circle size={20} className="fill-current" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="text-center md:text-left">
                    <p
                      className={`text-xs md:text-sm font-semibold ${
                        isActive
                          ? "text-secondary"
                          : isCompleted
                            ? "text-primary"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="hidden md:block text-xs text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 md:mx-4">
                    <div className="h-1 rounded-full relative overflow-hidden bg-gray-100">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                          isCompleted
                            ? "bg-primary w-full"
                            : isActive
                              ? "bg-secondary/30 w-1/2"
                              : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Content Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                currentStep === 1
                  ? "bg-blue-500"
                  : currentStep === 2
                    ? "bg-purple-500"
                    : "bg-green-500"
              }`}
            >
              {currentStep}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {steps[currentStep - 1].label}
              </h2>
              <p className="text-xs text-gray-500">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {currentStep === 1 && (
            <ChooseService onSelectService={handleSelectService} />
          )}

          {currentStep === 2 && selectedService && (
            <SelectAction
              service={selectedService}
              onSelectAction={handleSelectAction}
              onGoBack={handleGoBack}
            />
          )}

          {currentStep === 3 && selectedService && selectedAction && (
            <FillDetails
              service={selectedService}
              action={selectedAction}
              onSubmit={handleSubmit}
              onGoBack={handleGoBack}
            />
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step.id === currentStep
                ? "w-8 bg-secondary"
                : step.id < currentStep
                  ? "w-4 bg-primary"
                  : "w-4 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
