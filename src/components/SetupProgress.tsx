import React from 'react';
import { Store, Package, Truck, AlertCircle, CheckCircle } from 'lucide-react';

interface SetupProgressProps {
  currentStep: number;
}

const steps = [
  { icon: <Store className="h-6 w-6" />, label: 'Add Store', description: 'Register store information' },
  { icon: <Package className="h-6 w-6" />, label: 'Add Product', description: 'List your energy products' },
  { icon: <Truck className="h-6 w-6" />, label: 'Shipment', description: 'Define logistics & delivery' },
  { icon: <AlertCircle className="h-6 w-6" />, label: 'Approval', description: 'Verification by Gasable' },
  { icon: <CheckCircle className="h-6 w-6" />, label: 'Go Live', description: 'Active on marketplace' },
];

const SetupProgress: React.FC<SetupProgressProps> = ({ currentStep }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
              index < currentStep ? 'bg-primary-600 text-white' :
              index === currentStep ? 'bg-primary-100 text-primary-600' :
              'bg-secondary-100 text-secondary-400'
            }`}>
              {step.icon}
              {index < steps.length - 1 && (
                <div className={`absolute left-full w-full h-0.5 ${
                  index < currentStep ? 'bg-primary-600' : 'bg-secondary-200'
                }`} />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium text-secondary-900">{step.label}</p>
              <p className="text-sm text-secondary-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupProgress;