import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export const TemplatePreview = ({ template }) => {
  if (!template || !template.sections || template.sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
        <p>No template data available to preview.</p>
      </div>
    );
  }

  const totalQuestions = template.sections.reduce((acc, curr) => acc + (curr.questionCount || 0), 0);
  const totalMarks = template.sections.reduce((acc, curr) => acc + ((curr.questionCount || 0) * (curr.marksPerQuestion || 0)), 0);
  const difficultyCounts = template.sections.reduce(
    (acc, curr) => {
      const diff = curr.difficulty || 'Medium';
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    },
    { Easy: 0, Medium: 0, Hard: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Sections</span>
            <span className="text-3xl font-bold text-primary">{template.sections.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Questions</span>
            <span className="text-3xl font-bold text-primary">{totalQuestions}</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Marks</span>
            <span className="text-3xl font-bold text-primary">{totalMarks}</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Difficulty Mix</span>
            <div className="flex gap-1 mt-1">
              {difficultyCounts.Easy > 0 ? (
                <Badge variant="outline" className="text-[10px] px-1 bg-green-50 text-green-700 border-green-200">E {difficultyCounts.Easy}</Badge>
              ) : null}
              {difficultyCounts.Medium > 0 ? (
                <Badge variant="outline" className="text-[10px] px-1 bg-yellow-50 text-yellow-700 border-yellow-200">M {difficultyCounts.Medium}</Badge>
              ) : null}
              {difficultyCounts.Hard > 0 ? (
                <Badge variant="outline" className="text-[10px] px-1 bg-red-50 text-red-700 border-red-200">H {difficultyCounts.Hard}</Badge>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {template.sections.map((section, index) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              <span className="font-semibold text-sm">{index + 1}</span>
            </div>
            
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-semibold">{section.name}</CardTitle>
                <Badge variant="secondary">{section.questionType}</Badge>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-3 gap-2 text-center divide-x">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Questions</span>
                  <span className="font-medium mt-1">{section.questionCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Marks/Q</span>
                  <span className="font-medium mt-1">{section.marksPerQuestion}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Difficulty</span>
                  <span className="font-medium mt-1 text-xs px-1 flex items-center justify-center">
                    <span className={`px-2 py-0.5 rounded-full ${
                      section.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      section.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {section.difficulty}
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplatePreview;
