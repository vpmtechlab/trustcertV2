"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ServiceType, ServiceAction } from "./choose-service";
import { getIcon } from "@/lib/icon-registry";

interface SelectActionProps {
  service: ServiceType;
  onSelectAction: (action: ServiceAction) => void;
  onGoBack: () => void;
}

export function SelectAction({ service, onSelectAction, onGoBack }: SelectActionProps) {
  const [selectedActionSlug, setSelectedActionSlug] = useState<string>("");


  const handleContinue = () => {
    const action = service.actions.find((a) => a.slug === selectedActionSlug);
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
          <div className={`p-3 rounded-xl ${service?.color}`}>
            {React.createElement(getIcon(service.icon), { size: 24 })}
          </div>
          <span className="font-medium text-gray-800">{service?.name}</span>
        </div>

        <RadioGroup
          value={selectedActionSlug}
          onValueChange={(val) => setSelectedActionSlug(val || "")}
          className="space-y-3 pl-4 border-l-2 border-gray-100"
        >
          {service?.actions.map((action) => (
            <div key={action._id} className="flex items-center space-x-2">
              <RadioGroupItem value={action.slug} id={action._id} />
              <Label htmlFor={action._id} className="flex items-center gap-2 font-medium cursor-pointer">
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
        <Button
          onClick={handleContinue}
          disabled={!selectedActionSlug}
          variant="default"
          className="bg-primary hover:bg-[#146c11] text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
