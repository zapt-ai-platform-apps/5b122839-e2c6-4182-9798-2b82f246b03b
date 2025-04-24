import React from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

export default function LandingPage({ user }) {
  return (
    <div className="landing-page">
      <HeroSection user={user} />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-70 z-0"></div>
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA user={user} />
      </div>
    </div>
  );
}