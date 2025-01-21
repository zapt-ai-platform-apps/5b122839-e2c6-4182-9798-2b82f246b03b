import { useState } from 'react';
import * as Sentry from '@sentry/browser';

export default function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Sentry.captureException(error);
      console.error('Copy failed:', error);
    }
  };

  return [copied, handleCopy];
}