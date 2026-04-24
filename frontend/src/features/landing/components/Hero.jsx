import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from '../constants/landingContent';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-40 lg:pb-28">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="section-shell relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary sm:mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Discover AI-Powered Learning</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-5 max-w-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {HeroContent.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl lg:text-2xl"
        >
          {HeroContent.subheadline}
          <br className="hidden md:block" />
          <span className="mt-2 block text-sm opacity-80 sm:text-base lg:text-lg">{HeroContent.description}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
        >
          <Button size="lg" className="h-12 w-full px-6 text-base sm:h-14 sm:w-auto sm:px-8 sm:text-lg" asChild>
            <Link to="/register">
              {HeroContent.primaryCTA}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 w-full px-6 text-base sm:h-14 sm:w-auto sm:px-8 sm:text-lg" asChild>
            <a href="#features">{HeroContent.secondaryCTA}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
