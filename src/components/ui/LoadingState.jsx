import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <LoadingSpinner className="h-12 w-12 mx-auto mb-4 text-blue-600" />
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}