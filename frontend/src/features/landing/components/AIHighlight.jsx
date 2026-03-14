import React from 'react';
import { motion } from 'framer-motion';
import { AIHighlightContent } from '../constants/landingContent';
import { Bot, User } from 'lucide-react';

const AIHighlight = () => {
  return (
    <div id="ai-assistant" className="py-24 bg-gradient-to-b from-background to-muted/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-6 font-medium text-sm">
              <Bot className="w-4 h-4" />
              Smart Context Engine
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {AIHighlightContent.headline}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {AIHighlightContent.description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden p-6 max-w-lg mx-auto relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
              <div className="space-y-6 relative z-10">
                {AIHighlightContent.chatPreview.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIHighlight;
