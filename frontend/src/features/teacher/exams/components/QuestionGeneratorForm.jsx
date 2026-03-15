import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, BookType, Sparkles, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const QuestionGeneratorForm = ({ onGenerate, isGenerating }) => {
  const [config, setConfig] = useState({
    prompt: '',
    difficulty: 'Medium',
    questionCount: 10,
    duration: 60,
    useMaterials: true,
    useTemplate: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGenerate) onGenerate(config);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
      <CardHeader className="border-b space-y-1 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl">AI Generation Settings</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground ml-11">Configure the AI engine before generating your exam paper.</p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Additional Prompt (Optional)
            </label>
            <textarea 
              className="w-full min-h-[100px] rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
              placeholder="E.g., Focus specifically on the Krebs Cycle and cellular respiration. Include one practical application question."
              value={config.prompt}
              onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <BookType className="w-4 h-4 text-blue-500" />
                Overall Difficulty
              </label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={config.difficulty === level ? 'default' : 'outline'}
                    className={`flex-1 ${config.difficulty === level ? 'shadow-md shadow-primary/20' : ''}`}
                    onClick={() => setConfig({ ...config, difficulty: level })}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Exam Duration (Minutes)
              </label>
              <Input 
                type="number" 
                min="10" 
                step="5"
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) || 60 })}
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl space-y-3 border">
            <h4 className="text-sm font-semibold mb-2">Data Sources</h4>
            
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={config.useMaterials}
                  onChange={(e) => setConfig({ ...config, useMaterials: e.target.checked })}
                />
                <div className="h-5 w-5 rounded border border-primary bg-background peer-checked:bg-primary transition-colors"></div>
                <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-medium">Uploaded Materials</span>
                <p className="text-xs text-muted-foreground">Extract knowledge directly from your uploaded PDFs and notes.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={config.useTemplate}
                  onChange={(e) => setConfig({ ...config, useTemplate: e.target.checked })}
                />
                <div className="h-5 w-5 rounded border border-primary bg-background peer-checked:bg-primary transition-colors"></div>
                <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-medium">Exam Template</span>
                <p className="text-xs text-muted-foreground">Follow the structure and marking scheme defined in the template builder.</p>
              </div>
            </label>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 bg-transparent border-t mt-6 flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Estimated generation time: ~30s
          </div>
          <Button 
            type="submit" 
            size="lg" 
            className="gap-2 relative overflow-hidden group w-full md:w-auto"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin mr-2"></div>
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                Generate Exam Paper
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuestionGeneratorForm;
