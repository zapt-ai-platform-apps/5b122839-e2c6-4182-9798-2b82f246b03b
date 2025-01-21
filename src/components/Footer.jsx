import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} Parking Disputer</p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Made on ZAPT
            </a>
            <a 
              href="/privacy" 
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-sm hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}