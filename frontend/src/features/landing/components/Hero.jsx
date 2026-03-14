import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from '../constants/landingContent';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Discover AI-Powered Learning</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
        >
          {HeroContent.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          {HeroContent.subheadline}
          <br className="hidden md:block" />
          <span className="text-lg mt-2 block opacity-80">{HeroContent.description}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14" asChild>
            <Link to="/signup">
              {HeroContent.primaryCTA}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14" asChild>
            <a href="#features">{HeroContent.secondaryCTA}</a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
