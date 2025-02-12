import React from 'react';
import { DocumentArrowDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export const CopyButton = ({ copied, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
  >
    <ClipboardDocumentIcon className="h-5 w-5" />
    {copied ? 'Copied!' : 'Copy Letter'}
  </button>
);

export const DownloadButton = ({ letterText }) => (
  <a
    href={`data:text/plain;charset=utf-8,${encodeURIComponent(letterText)}`}
    download="dispute-letter.txt"
    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors cursor-pointer"
  >
    <DocumentArrowDownIcon className="h-5 w-5" />
    Download Letter
  </a>
);