"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ServiceType, ServiceAction } from "./choose-service";

interface SelectActionProps {
  service: ServiceType;
  onSelectAction: (action: ServiceAction) => void;
  onGoBack: () => void;
}

export function SelectAction({ service, onSelectAction, onGoBack }: SelectActionProps) {
  const [selectedActionId, setSelectedActionId] = useState<string>("");

  const IconComponent = service?.icon;

  const handleContinue = () => {
    const action = service.actions.find((a) => a.id === selectedActionId);
    if (action) {
      onSelectAction(action);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{service?.name} Actions</h2>
        <p className="text-sm text-gray-500 mt-1">Please select one action</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          {IconComponent && (
            <div className={`p-3 rounded-xl ${service?.color}`}>
              <IconComponent size={24} />
            </div>
          )}
          <span className="font-medium text-gray-800">{service?.name}</span>
        </div>

        <RadioGroup
          value={selectedActionId}
          onValueChange={(val) => setSelectedActionId(val || "")}
          className="space-y-3 pl-4 border-l-2 border-gray-100"
        >
          {service?.actions.map((action) => (
            <div key={action.id} className="flex items-center space-x-2">
              <RadioGroupItem value={action.id} id={action.id} />
              <Label htmlFor={action.id} className="flex items-center gap-2 font-medium cursor-pointer">
                {action.label}
                {action.enabled && <span className="text-xs text-primary">●</span>}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onGoBack} variant="outline">
          Go Back
        </Button>
        <Button onClick={handleContinue} disabled={!selectedActionId} variant="default" className="bg-primary hover:bg-[#146c11] text-white">
          Continue
        </Button>
      </div>
    </div>
  );
}
