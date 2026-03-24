import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExportOptions = ({ onExport, onOpen, isExporting, exportSuccess }) => {
  const options = [
    {
      id: 'pdf',
      title: 'Download PDF',
      description: 'Print-ready formatting with cover page',
      icon: FileDown,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-900/50'
    },
    {
      id: 'docx',
      title: 'Download DOCX',
      description: 'Fully editable Word document',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-900/50'
    },
    {
      id: 'online',
      title: 'Publish Online Test',
      description: 'Ready for students to take digitally',
      icon: Globe,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-900/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {options.map((option, index) => {
        const Icon = option.icon;
        const isSuccess = exportSuccess === option.id;
        
        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className={`h-full overflow-hidden transition-all duration-300 border-2 ${
              isSuccess ? 'border-green-500 bg-green-50/10' : 'hover:border-primary/50'
            }`}>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4 h-full relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${option.bgColor} ${option.borderColor}`}>
                  {isSuccess ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : (
                    <Icon className={`w-8 h-8 ${option.color}`} />
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-lg">{isSuccess ? 'Exported Successfully' : option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant={isSuccess ? 'outline' : 'default'}
                  onClick={() => {
                    if (isSuccess) {
                      onOpen?.(option.id);
                      return;
                    }
                    onExport?.(option.id);
                  }}
                  disabled={isExporting}
                >
                  {isExporting
                    ? 'Exporting...'
                    : isSuccess
                      ? (option.id === 'online' ? 'Copy Link / Open' : 'Open File')
                      : option.title}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ExportOptions;
