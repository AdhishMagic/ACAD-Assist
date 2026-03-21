import React from 'react';
import { motion } from 'framer-motion';
import { FeaturesData } from '../constants/landingContent';
import * as Icons from 'lucide-react';

const Features = () => {
  return (
    <div id="features" className="scroll-mt-24 py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Studies</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to digest information faster, retain knowledge longer, and collaborate effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
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
    </div>
  );
};

export default Features;
