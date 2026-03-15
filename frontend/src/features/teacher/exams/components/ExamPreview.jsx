import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, AlertCircle } from 'lucide-react';

export const ExamPreview = ({ exam }) => {
  if (!exam) return null;

  return (
    <Card className="max-w-4xl mx-auto bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="text-center pb-6 border-b">
        <h1 className="text-3xl font-bold font-serif mb-2">{exam.title || 'Untitled Exam'}</h1>
        <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground mt-4">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Duration: {exam.duration || 60} mins</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Total Marks: {exam.totalMarks || 0}</span>
        </div>
        
        {exam.instructions && (
          <div className="mt-6 bg-muted/30 p-4 rounded-xl text-left flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Instructions to Candidates</h4>
              <p className="text-sm text-muted-foreground">{exam.instructions}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {(!exam.questions || exam.questions.length === 0) ? (
          <div className="text-center text-muted-foreground py-12">No questions generated yet.</div>
        ) : (
          exam.questions.map((question, index) => (
            <div key={question.id} className="relative group">
              <div className="flex items-start gap-4">
                <span className="font-semibold text-lg min-w-[32px]">Q{index + 1}.</span>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4 text-base">
                    <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {question.text}
                    </p>
                    <span className="font-semibold shrink-0">[{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]</span>
                  </div>

                  {question.type === 'MCQ' && question.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {question.options.map((option, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                          <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center text-xs font-medium">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Badge variant="outline" className="text-xs bg-transparent">
                      {question.type}
                    </Badge>
                    <Badge variant="outline" className={`text-xs bg-transparent border-dashed ${
                      question.difficulty === 'Easy' ? 'text-green-600 border-green-200' :
                      question.difficulty === 'Hard' ? 'text-red-600 border-red-200' :
                      'text-yellow-600 border-yellow-200'
                    }`}>
                      {question.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {index < exam.questions.length - 1 && (
                <hr className="my-8 opacity-50 border-border" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExamPreview;
