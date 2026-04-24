import React from 'react';
import { motion } from 'framer-motion';
import { CTAContent } from '../constants/landingContent';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="section-shell relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card p-6 text-center shadow-2xl sm:p-8 md:p-12 lg:p-16"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <Sparkles className="w-24 h-24 text-primary" />
          </div>

          <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {CTAContent.headline}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            {CTAContent.description}
          </p>

          <Button size="lg" className="h-12 rounded-full px-6 text-base shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl sm:h-14 sm:px-10 sm:text-lg" asChild>
              <Link to="/register">
              {CTAContent.buttonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
