import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CopyButton, DownloadButton } from '../components/DisputeButtons';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

export default function DisputeLetter() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [copied, handleCopy] = useCopyToClipboard();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Your Dispute Letter</h1>
            <div className="flex gap-4">
              <CopyButton
                copied={copied}
                onClick={() => handleCopy(state.letter)}
              />
              <button
                onClick={() => navigate('/form')}
                className="text-gray-600 hover:text-gray-800"
              >
                Edit Details
              </button>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h3 className="text-lg font-semibold mb-4">Key Points:</h3>
            <p className="text-gray-600 mb-8">{state.summary}</p>
            
            <h3 className="text-lg font-semibold mb-4">Full Letter:</h3>
            <div className="whitespace-pre-wrap border-t pt-4">
              {state.letter}
            </div>
          </div>

          <div className="mt-8 border-t pt-6 flex justify-end gap-4">
            <DownloadButton letterText={state.letter} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}