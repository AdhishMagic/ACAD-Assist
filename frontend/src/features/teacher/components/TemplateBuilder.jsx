import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Link as LinkIcon, AlertCircle, Quote } from 'lucide-react';

const TemplateBuilder = ({ onInsertTemplate }) => {
  const templates = [
    {
      id: 'definition',
      title: 'Definition Block',
      icon: Quote,
      content: '### Definition\n\n> **[Concept Name]:** [Enter standard definition here]\n\n**In simple terms:** [Explain like they are 5]\n\n'
    },
    {
      id: 'example',
      title: 'Example Set',
      icon: LinkIcon,
      content: '### Real-World Examples\n\n1. **Example 1:** [Description of example]\n   - *Why it matters:* [Impact]\n\n2. **Example 2:** [Description of example]\n   - *Why it matters:* [Impact]\n\n'
    },
    {
      id: 'alert',
      title: 'Important Note',
      icon: AlertCircle,
      content: '> ⚠️ **Important:**\n> [Enter critical information students must remember]\n\n'
    },
    {
      id: 'practice',
      title: 'Practice Question',
      icon: PlusCircle,
      content: '### Test Your Knowledge\n\n**Q:** [Enter question here]\n\n<details>\n<summary>View Answer</summary>\n\n**A:** [Enter detailed answer and explanation here]\n\n</details>\n\n'
    }
  ];

  return (
    <div className="p-3 space-y-3">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Quick Templates</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Click to insert predefined blocks into your editor.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((tpl) => (
          <Card 
            key={tpl.id} 
            className="cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors group border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            onClick={() => onInsertTemplate(tpl.content)}
          >
            <CardContent className="p-2.5 flex flex-col items-center justify-center text-center gap-1.5">
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-900 group-hover:bg-primary/10 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                <tpl.icon size={16} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                {tpl.title}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateBuilder;
