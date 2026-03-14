import React from 'react';
import { motion } from 'framer-motion';
import { CTAContent } from '../constants/landingContent';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <div className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <Sparkles className="w-24 h-24 text-primary" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {CTAContent.headline}
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {CTAContent.description}
          </p>

          <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" asChild>
            <Link to="/signup">
              {CTAContent.buttonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CTA;
