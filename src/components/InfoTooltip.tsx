import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="text-secondary-400 hover:text-secondary-600 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      {isVisible && (
        <div
          className={`absolute z-50 w-64 p-2 text-sm text-white bg-secondary-800 rounded-lg shadow-lg ${getPositionClasses()}`}
          role="tooltip"
        >
          <div className="relative">
            {content}
            <div className="tooltip-arrow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;