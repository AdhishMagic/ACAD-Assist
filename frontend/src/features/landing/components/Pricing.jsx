import React from 'react';
import { motion } from 'framer-motion';
import { PricingPlans } from '../constants/landingContent';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <section id="pricing" className="scroll-mt-24 py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing that scales with you</h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more storage, faster processing, and collaboration features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={
                "relative bg-card border rounded-2xl p-8 shadow-sm flex flex-col " +
                (plan.popular ? 'border-primary/50 shadow-md' : 'border-border')
              }
            >
              {plan.badge ? (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow">
                    {plan.badge}
                  </span>
                </div>
              ) : null}

              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                  {plan.note ? <div className="text-xs text-muted-foreground mt-2">{plan.note}</div> : null}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  className={plan.popular ? 'w-full h-12' : 'w-full h-12'}
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  {plan.ctaHref.startsWith('/') ? (
                    <Link to={plan.ctaHref}>{plan.ctaText}</Link>
                  ) : (
                    <a href={plan.ctaHref}>{plan.ctaText}</a>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 text-sm text-muted-foreground">
          Need institution-wide access? Contact us for department and campus plans.
        </div>
      </div>
    </section>
  );
};

export default Pricing;
