import React from 'react';
import { DocumentArrowDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import CopyLetterButton from './CopyLetterButton';

export const CopyButton = ({ copied, onClick }) => (
  <CopyLetterButton copied={copied} onClick={onClick} />
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