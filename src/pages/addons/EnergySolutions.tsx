import React, { useEffect } from 'react';

function EnergySolutions() {
  useEffect(() => {
    // Redirect to external Solar platform
    window.location.href = 'https://Solar.gasable.net/';
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Energy Solutions</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Redirecting to Solar Energy platform...</p>
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    </div>
  );
}

export default EnergySolutions;