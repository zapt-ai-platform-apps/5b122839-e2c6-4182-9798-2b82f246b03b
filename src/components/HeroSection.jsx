import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function HeroSection({ user }) {
  return (
    <section className="relative overflow-hidden bg-blue-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute right-0 top-0 w-full h-full"
        >
          <svg viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-0 h-full w-full">
            <defs>
              <linearGradient id="gggrain-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff"></stop>
                <stop offset="100%" stopColor="#3b82f6"></stop>
              </linearGradient>
              <filter id="gggrain-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="2" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence>
                <feColorMatrix type="saturate" values="0" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="colormatrix"></feColorMatrix>
                <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="colormatrix" result="componentTransfer">
                  <feFuncR type="linear" slope="3"></feFuncR>
                  <feFuncG type="linear" slope="3"></feFuncG>
                  <feFuncB type="linear" slope="3"></feFuncB>
                </feComponentTransfer>
                <feColorMatrix x="0%" y="0%" width="100%" height="100%" in="componentTransfer" result="colormatrix2" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -11"></feColorMatrix>
              </filter>
            </defs>
            <g>
              <rect width="900" height="900" fill="url(#gggrain-gradient)"></rect>
              <rect width="900" height="900" fill="transparent" filter="url(#gggrain-filter)" opacity="0.35"></rect>
            </g>
          </svg>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [20, -20, 20], opacity: 0.2 }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute -top-12 left-1/4 w-64 h-64 rounded-full bg-blue-400 mix-blend-screen blur-3xl"
        />
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [-30, 30, -30], opacity: 0.3 }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500 mix-blend-screen blur-3xl"
        />
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: [30, -30, 30], opacity: 0.2 }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 right-1/3 w-96 h-96 rounded-full bg-purple-500 mix-blend-screen blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block px-3 py-1 rounded-full bg-blue-800 bg-opacity-50 backdrop-blur-sm text-sm font-medium mb-6"
            >
              No win, no fee • Success rate: 73%
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
            >
              Fight Unfair <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-300">Parking Tickets</span> with AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Our AI generates professional dispute letters in minutes, using legal precedent to help you overturn unjust penalties. Join thousands who've already saved money.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={user ? '/form' : '/login'}
                  className="inline-flex items-center justify-center bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  {user ? 'Start My Dispute' : 'Get Started'}
                  <ChevronRightIcon className="h-6 w-6 ml-2" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center bg-transparent border border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 w-full sm:w-auto"
                >
                  See How It Works
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-10 text-blue-200 flex items-center justify-center lg:justify-start space-x-8"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>5,000+ tickets disputed</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>£325,000+ saved</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
            <div className="relative bg-blue-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-2xl border border-blue-700 border-opacity-30 shadow-2xl">
              <div className="bg-blue-900 bg-opacity-50 rounded-xl overflow-hidden">
                <img
                  src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=128&height=128"
                  alt="Parking Disputer"
                  className="w-16 h-16 mx-auto mt-6"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Dispute Letter Sample</h3>
                    <span className="text-blue-200 text-sm">Generated in 2 mins</span>
                  </div>
                  <div className="mt-4 space-y-4 text-blue-100">
                    <p className="font-light border-l-2 border-blue-600 pl-3">
                      I am writing to dispute the parking charge notice (PCN) #EC12345 issued on 15/04/2023 at High Street, London.
                    </p>
                    <p className="font-light border-l-2 border-blue-500 pl-3">
                      I believe this penalty was issued incorrectly as the signage in the area was inadequate and contradictory, failing to meet the requirements set out in the British Parking Association Code of Practice.
                    </p>
                    <p className="font-light border-l-2 border-blue-400 pl-3">
                      Furthermore, according to the Parking (Code of Practice) Act 2019, parking operators must provide clear information about parking restrictions...
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-blue-300 text-sm">Full letter: 450 words</span>
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">Ready to send</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#F9FAFB" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,176C384,160,480,96,576,90.7C672,85,768,139,864,138.7C960,139,1056,85,1152,69.3C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}