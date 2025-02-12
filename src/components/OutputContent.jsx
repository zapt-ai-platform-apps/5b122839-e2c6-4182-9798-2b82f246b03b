import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CopyButton, DownloadButton } from '../components/DisputeButtons';

const OutputContent = ({ letterData, copied, handleCopy, navigate }) => (
  <section className="py-16">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-sm p-8"
      >
        <div className="mb-8 text-center">
          <DocumentTextIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Your Dispute Letter is Ready</h2>
          <p className="text-gray-600 mb-6">Review and download your customized dispute letter below</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Key Points Summary</h3>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            {letterData.summary}
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <h3 className="text-xl font-semibold mb-4">Full Dispute Letter</h3>
          <pre className="whitespace-pre-wrap font-sans">
            {letterData.letter}
          </pre>
        </div>

        <div className="flex justify-between items-center mt-8 border-t pt-6">
          <div className="flex gap-4">
            <CopyButton
              copied={copied}
              onClick={() => handleCopy(letterData.letter)}
            />
            <DownloadButton letterText={letterData.letter} />
          </div>
          <button
            onClick={() => navigate('/form')}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Edit Details
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default OutputContent;