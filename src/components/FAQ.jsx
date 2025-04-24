import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const faqs = [
    {
      question: "How does the parking ticket dispute process work?",
      answer: "Our AI analyzes your ticket details and generates a professional dispute letter with relevant legal arguments. You can then download, print, or copy this letter and submit it to the issuing authority through their official appeal process."
    },
    {
      question: "What are my chances of getting my parking ticket dismissed?",
      answer: "Success rates vary depending on the specific circumstances of your ticket, but our users report a 73% success rate when using our AI-generated dispute letters. Many parking tickets contain errors or were issued incorrectly, giving solid grounds for appeal."
    },
    {
      question: "How much does it cost to use this service?",
      answer: "Our service costs just £4 per dispute letter, payable only when you're ready to generate your letter. This is a one-time fee - no subscriptions or hidden charges."
    },
    {
      question: "How long does it take to generate a dispute letter?",
      answer: "Once you've entered your ticket details and completed payment, your personalized dispute letter will be generated within minutes. You can then immediately view, copy, download, or print your letter."
    },
    {
      question: "Can I use this for any type of parking ticket?",
      answer: "Our service works for most types of parking tickets, including those issued by local councils, private parking companies, and enforcement agencies across the UK. Whether it's a PCN (Penalty Charge Notice) or a private parking charge, our AI can help."
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(null);
  
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-600">Everything you need to know about our service</p>
        </motion.div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none cursor-pointer"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`h-6 w-6 transform transition-transform duration-200 text-blue-600 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}