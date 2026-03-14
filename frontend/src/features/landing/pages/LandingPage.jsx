import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/HeroSection';
import FeatureSection from '../sections/FeatureSection';
import CTASection from '../sections/CTASection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
