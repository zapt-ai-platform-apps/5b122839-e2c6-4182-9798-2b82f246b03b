import React from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const CopyLetterButton = ({ copied, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600 bg-white shadow-sm hover:bg-blue-50 transition-all hover:shadow-md font-medium cursor-pointer ${copied ? 'bg-blue-50 text-blue-700' : 'text-blue-600'} ${className}`}
    aria-label="Copy letter to clipboard"
  >
    <ClipboardDocumentIcon className="h-5 w-5" />
    <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
    {copied && (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )}
  </button>
);

export default CopyLetterButton;