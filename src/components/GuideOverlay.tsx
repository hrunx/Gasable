import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Step {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuideOverlayProps {
  steps: Step[];
  onComplete: () => void;
  isOpen: boolean;
}

const GuideOverlay: React.FC<GuideOverlayProps> = ({ steps, onComplete, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    }
  }, [currentStep, isOpen, steps]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      setCurrentStep(0);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div
        className="absolute bg-white rounded-lg shadow-xl p-4 w-80"
        style={{
          top: `${position.top + 20}px`,
          left: `${position.left}px`,
        }}
      >
        <button
          onClick={onComplete}
          className="absolute top-2 right-2 text-secondary-400 hover:text-secondary-600"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
        <p className="text-secondary-600 mb-4">{currentStepData.content}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideOverlay;