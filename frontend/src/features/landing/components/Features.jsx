import React from 'react';
import { motion } from 'framer-motion';
import { FeaturesData } from '../constants/landingContent';
import * as Icons from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="scroll-mt-24 bg-muted/30 py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">Supercharge Your Studies</h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Everything you need to digest information faster, retain knowledge longer, and collaborate effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {FeaturesData.map((feature, index) => {
            const Icon = Icons[feature.icon] || Icons.Code;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:p-6 lg:p-8"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {Array.isArray(feature.highlights) && feature.highlights.length > 0 ? (
                  <ul className="mt-5 space-y-2 text-sm">
                    {feature.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
