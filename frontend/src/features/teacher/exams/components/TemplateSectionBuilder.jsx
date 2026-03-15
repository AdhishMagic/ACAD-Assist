import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TemplateSectionBuilder = ({ sections = [], onChange }) => {
  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      name: `Section ${sections.length + 1}`,
      questionType: 'MCQ',
      questionCount: 5,
      marksPerQuestion: 1,
      difficulty: 'Medium'
    };
    onChange([...sections, newSection]);
  };

  const updateSection = (id, field, value) => {
    onChange(sections.map(sec => 
      sec.id === id ? { ...sec, [field]: value } : sec
    ));
  };

  const removeSection = (id) => {
    onChange(sections.filter(sec => sec.id !== id));
  };

  const questionTypes = ['Definition', 'Explanation', 'Short Answer', 'MCQ', 'Long Answer', 'Diagram'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Exam Sections</h3>
          <p className="text-sm text-muted-foreground">Define the structure and marking scheme</p>
        </div>
        <Button onClick={addSection} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add Section
        </Button>
      </div>

      <AnimatePresence>
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="mb-4 group">
              <CardHeader className="py-3 px-4 flex flex-row items-center gap-3 bg-muted/30 border-b space-y-0">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity" />
                <Badge variant="outline" className="bg-background">Section {index + 1}</Badge>
                <div className="flex-1">
                  <Input 
                    value={section.name} 
                    onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                    className="h-8 bg-transparent border-transparent hover:border-input focus:bg-background transition-colors font-medium"
                  />
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeSection(section.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Question Type</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={section.questionType}
                    onChange={(e) => updateSection(section.id, 'questionType', e.target.value)}
                  >
                    {questionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">No. of Questions</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={section.questionCount}
                    onChange={(e) => updateSection(section.id, 'questionCount', parseInt(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Marks per Question</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={section.marksPerQuestion}
                    onChange={(e) => updateSection(section.id, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={section.difficulty}
                    onChange={(e) => updateSection(section.id, 'difficulty', e.target.value)}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {sections.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-xl bg-muted/20">
            <p className="text-muted-foreground">No sections defined yet. Click "Add Section" to begin.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateSectionBuilder;
