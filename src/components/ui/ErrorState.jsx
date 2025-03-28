import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center my-8">
      <p className="mb-4">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}