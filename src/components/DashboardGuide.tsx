import React, { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import GuideOverlay from './GuideOverlay';

const dashboardSteps = [
  {
    target: '.stats-overview',
    title: 'Performance Overview',
    content: 'Monitor key metrics like total revenue, active customers, and order statistics at a glance.',
    position: 'bottom',
  },
  {
    target: '.revenue-chart',
    title: 'Revenue Trends',
    content: 'Track your revenue performance over time with detailed charts and analytics.',
    position: 'top',
  },
  {
    target: '.recent-orders',
    title: 'Recent Orders',
    content: 'View and manage your latest orders, track their status, and take quick actions.',
    position: 'left',
  },
];

const DashboardGuide: React.FC = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    const guided = localStorage.getItem('dashboard-guided');
    if (!guided) {
      setIsGuideOpen(true);
      setHasSeenGuide(true);
      localStorage.setItem('dashboard-guided', 'true');
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setIsGuideOpen(true)}
        className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        title="Open Guide"
      >
        <Book className="h-6 w-6" />
      </button>

      <GuideOverlay
        steps={dashboardSteps}
        isOpen={isGuideOpen}
        onComplete={() => setIsGuideOpen(false)}
      />
    </>
  );
};

export default DashboardGuide;