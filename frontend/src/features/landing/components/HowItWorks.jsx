import React from 'react';
import { motion } from 'framer-motion';
import { HowItWorksSteps } from '../constants/landingContent';

const HowItWorks = () => {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">How It Works</h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            A seamless workflow designed to transform your raw study materials into actionable insights.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
            {HowItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary sm:h-16 sm:w-16 sm:text-xl">
                  {step.step}
                </div>
                <h3 className="mb-3 text-lg font-semibold sm:text-xl">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
