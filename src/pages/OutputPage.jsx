import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function OutputPage() {
  const { state } = useLocation();
  const [letterData, setLetterData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate('/form');
    } else {
      setLetterData(state);
    }
  }, [state, navigate]);

  if (!letterData) return <LoadingSpinner className="h-12 w-12 mx-auto mt-16" />;

  return (
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

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print Letter
            </button>
            <button
              onClick={() => navigate('/form')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit Information
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}