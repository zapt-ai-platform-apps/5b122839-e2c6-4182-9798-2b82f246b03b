import React from 'react';
import { motion } from 'framer-motion';
import PricingBox from './ui/PricingBox';

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="how-it-works" className="py-20 relative z-10 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            How <span className="text-blue-600">Parking Disputer</span> Works
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform helps you fight unfair parking tickets in just a few simple steps.
            With a 73% success rate, you can challenge your penalty with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="col-span-1 lg:col-span-7 space-y-16"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold z-10">
                    1
                  </div>
                  <div className="absolute top-16 bottom-0 left-1/2 w-1 -ml-0.5 bg-blue-200 z-0"></div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex-1 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Enter Your Ticket Details</h3>
                  <p className="text-gray-600 text-lg mb-4">
                    Fill out our simple form with information about your ticket and vehicle. The more details you provide, the better we can tailor your dispute letter.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 text-blue-700">
                    <p className="font-medium">Key information we'll need:</p>
                    <ul className="mt-2 space-y-1 text-blue-800">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Your vehicle information
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Ticket details (number, date, reason)
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        The circumstances of the incident
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold z-10">
                    2
                  </div>
                  <div className="absolute top-16 bottom-0 left-1/2 w-1 -ml-0.5 bg-blue-200 z-0"></div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex-1 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete One-Time Payment</h3>
                  <p className="text-gray-600 text-lg mb-4">
                    Make a secure one-time payment of just £4. No subscription, no hidden fees, no recurring charges.
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-blue-50 rounded-lg px-4 py-3 text-blue-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure payment
                    </div>
                    <div className="bg-blue-50 rounded-lg px-4 py-3 text-blue-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      All major cards accepted
                    </div>
                    <div className="bg-blue-50 rounded-lg px-4 py-3 text-blue-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Instant processing
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold z-10">
                    3
                  </div>
                  <div className="absolute top-16 bottom-0 left-1/2 w-1 -ml-0.5 bg-blue-200 z-0"></div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex-1 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Professional Letter</h3>
                  <p className="text-gray-600 text-lg mb-4">
                    Our advanced AI creates a professionally formatted dispute letter with legal arguments tailored to your specific situation.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                      <h4 className="font-semibold text-blue-900 mb-2">Your letter includes:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mt-0.5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>Professional formatting and structure</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mt-0.5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>Relevant legal arguments</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mt-0.5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>Case precedents where applicable</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                      <h4 className="font-semibold text-blue-900 mb-2">You can immediately:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mt-0.5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>Download as PDF</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mt-0.5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>Copy text for email disputes</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 mt-0.5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>Print directly</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold z-10">
                    4
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex-1 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Your Appeal</h3>
                  <p className="text-gray-600 text-lg mb-4">
                    Send your professionally crafted dispute letter to the issuing authority and await their response. With our 73% success rate, you'll have the best chance of getting your penalty reduced or cancelled.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 text-green-800 border border-green-200">
                    <h4 className="font-semibold text-green-900 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Success Rate: 73%
                    </h4>
                    <p className="mt-2">Our customers have saved over £325,000 in unjust parking penalties by using our AI-generated dispute letters.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="col-span-1 lg:col-span-5 sticky top-20 self-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <PricingBox />
            
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                Why fight your ticket?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Many parking tickets are issued incorrectly or unfairly</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Issuers often count on people not appealing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">A proper legal challenge can save you £50-£100+</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Our AI makes the process quick and easy</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}