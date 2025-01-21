import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Provide Ticket Details',
    description: 'Fill out our simple form with your parking ticket information',
    icon: DocumentTextIcon,
  },
  {
    title: 'AI Analysis',
    description: 'Our AI reviews local parking laws and your circumstances',
    icon: ClockIcon,
  },
  {
    title: 'Get Your Letter',
    description: 'Receive a professionally crafted dispute letter ready to submit',
    icon: CheckCircleIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <step.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}