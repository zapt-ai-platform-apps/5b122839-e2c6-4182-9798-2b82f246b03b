import { useState } from 'react';
import * as Sentry from '@sentry/react';

export default function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return [copied, handleCopy];
}