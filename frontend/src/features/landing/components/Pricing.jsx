import React from 'react';
import { motion } from 'framer-motion';
import { PricingPlans } from '../constants/landingContent';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <section id="pricing" className="scroll-mt-24 py-24 bg-background">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">Simple pricing that scales with you</h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Start free, upgrade when you need more storage, faster processing, and collaboration features.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {PricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={
                "relative flex flex-col rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:p-8 " +
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

        <div className="mt-10 text-center text-sm text-muted-foreground">
          Need institution-wide access? Contact us for department and campus plans.
        </div>
      </div>
    </section>
  );
};

export default Pricing;
