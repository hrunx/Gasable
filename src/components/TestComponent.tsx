import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-gray-800">Test Component</h1>
      <p className="mt-2 text-gray-600">
        This is a test component to verify that the project setup is working correctly.
      </p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestComponent; 