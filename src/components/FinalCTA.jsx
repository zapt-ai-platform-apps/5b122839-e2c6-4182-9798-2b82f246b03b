import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function FinalCTA({ user }) {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="relative px-6 py-12 md:p-12 lg:px-16 lg:py-16">
            {/* Abstract Shapes */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="white" strokeWidth="2">
                  <circle cx="400" cy="400" r="200" />
                  <circle cx="400" cy="400" r="250" />
                  <circle cx="400" cy="400" r="300" />
                  <circle cx="400" cy="400" r="350" />
                </g>
                <g fill="white" fillOpacity="0.2">
                  <circle cx="150" cy="100" r="50" />
                  <circle cx="700" cy="300" r="30" />
                  <circle cx="200" cy="600" r="40" />
                  <circle cx="650" cy="550" r="60" />
                </g>
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4"
                >
                  Ready to fight your unfair parking ticket?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-blue-100 text-lg md:text-xl max-w-2xl"
                >
                  Join thousands of drivers who've successfully disputed their tickets with our AI-powered solution. Start your dispute in minutes.
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={user ? '/form' : '/login'}
                    className="inline-flex items-center bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {user ? 'Create My Dispute Letter' : 'Get Started Now'}
                    <ChevronRightIcon className="h-6 w-6 ml-2" />
                  </Link>
                </motion.div>
                <p className="text-blue-100 text-center mt-4 text-sm">
                  Only £4 per letter • No subscription required
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}