import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function HeroSection() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6">Fight Unfair Parking Tickets with AI</h1>
          <p className="text-xl mb-8">Generate professional dispute letters in minutes using our AI-powered tool</p>
          <button
            onClick={() => document.getElementById('ticket-form').scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started <ChevronRightIcon className="h-5 w-5 inline-block" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}