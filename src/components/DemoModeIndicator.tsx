import React from 'react';
import { useAuth } from '../lib/auth';
import { AlertCircle } from 'lucide-react';

const DemoModeIndicator: React.FC = () => {
  const { isDemoMode } = useAuth();

  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <AlertCircle className="h-5 w-5" />
      <span className="font-medium">Demo Mode</span>
    </div>
  );
};

export default DemoModeIndicator;