import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, AlertCircle } from 'lucide-react';

export const ExamPreview = ({ exam }) => {
  if (!exam) return null;

  const questions = Array.isArray(exam.questions) ? exam.questions : [];
  const grouped = questions.reduce((acc, q) => {
    const key = q?.sectionName ? String(q.sectionName) : 'Questions';
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  const groupEntries = Object.entries(grouped);
  let runningNumber = 0;

  return (
    <Card className="max-w-4xl mx-auto bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="text-center pb-6 border-b">
        <h1 className="text-3xl font-bold font-serif mb-2">{exam.title || 'Untitled Exam'}</h1>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-6 text-sm text-muted-foreground mt-4">
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

      <CardContent className="p-4 sm:p-8 space-y-8">
        {(questions.length === 0) ? (
          <div className="text-center text-muted-foreground py-12">No questions generated yet.</div>
        ) : (
          groupEntries.map(([sectionName, sectionQuestions], sectionIndex) => (
            <div key={`${sectionName}-${sectionIndex}`} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 pb-3 border-b">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{sectionName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {sectionQuestions.length} {sectionQuestions.length === 1 ? 'question' : 'questions'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {sectionQuestions[0]?.type && (
                    <Badge variant="outline" className="text-xs bg-transparent">
                      {sectionQuestions[0].type}
                    </Badge>
                  )}
                  {sectionQuestions[0]?.difficulty && (
                    <Badge
                      variant="outline"
                      className={`text-xs bg-transparent border-dashed ${
                        sectionQuestions[0].difficulty === 'Easy'
                          ? 'text-green-600 border-green-200'
                          : sectionQuestions[0].difficulty === 'Hard'
                            ? 'text-red-600 border-red-200'
                            : 'text-yellow-600 border-yellow-200'
                      }`}
                    >
                      {sectionQuestions[0].difficulty}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {sectionQuestions.map((question) => {
                  runningNumber += 1;
                  return (
                    <div key={question.id} className="relative group">
                      <div className="flex items-start gap-4">
                        <span className="font-semibold text-lg min-w-[32px]">Q{runningNumber}.</span>
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 text-base min-w-0">
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
                                  <span className="text-sm break-words min-w-0">{option}</span>
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExamPreview;
