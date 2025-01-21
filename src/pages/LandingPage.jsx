import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import HowItWorks from '../components/HowItWorks';

export default function LandingPage({ user }) {
  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Fight Unfair Parking Tickets<br />with AI Assistance
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Transform your parking ticket dispute process with our intelligent system that crafts legally sound arguments
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href={user ? '/form' : '/login'}
                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                {user ? 'Continue to Dispute Form' : 'Get Started'}
                <ChevronRightIcon className="h-6 w-6 ml-2" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <HowItWorks />
    </>
  );
}