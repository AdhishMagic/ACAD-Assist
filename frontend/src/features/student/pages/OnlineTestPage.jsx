import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { useExamPreview } from '@/features/teacher/exams/hooks/useExamGenerator';
import { selectCurrentUser } from '@/features/auth/store/authSlice';
import { hasTeacherAccess } from '@/features/auth/utils/role';
import { upsertOnlineTestSubmission } from '@/features/teacher/exams/utils/onlineTestStorage';

const ATTEMPT_STORAGE_PREFIX = 'acadassist.student.onlineTestAttempt.v1.';

const loadAttempt = (examId) => {
  try {
    const raw = localStorage.getItem(`${ATTEMPT_STORAGE_PREFIX}${examId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveAttempt = (examId, attempt) => {
  try {
    localStorage.setItem(`${ATTEMPT_STORAGE_PREFIX}${examId}`, JSON.stringify(attempt));
  } catch {
    // ignore
  }
};

const groupBySection = (questions) => {
  return (Array.isArray(questions) ? questions : []).reduce((acc, q) => {
    const key = q?.sectionName ? String(q.sectionName) : 'Questions';
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});
};

const getResponseForQuestion = (question, rawValue) => {
  const type = String(question?.type ?? '');

  if (type === 'Diagram') {
    const drawing = typeof rawValue?.drawing === 'string' ? rawValue.drawing : '';
    const note = typeof rawValue?.note === 'string' ? rawValue.note : '';
    return { drawing, note };
  }

  if (typeof rawValue === 'string') return rawValue;
  return '';
};

const normalizeResponsesForExam = (questions, rawResponses) => {
  const base = rawResponses && typeof rawResponses === 'object' ? rawResponses : {};
  const qs = Array.isArray(questions) ? questions : [];
  if (qs.length === 0) return base;

  let changed = false;
  const next = { ...base };

  for (const q of qs) {
    const id = q?.id;
    if (!id) continue;
    const normalized = getResponseForQuestion(q, base[id]);

    if (q?.type === 'Diagram') {
      const prev = base[id];
      const prevDrawing = typeof prev?.drawing === 'string' ? prev.drawing : '';
      const prevNote = typeof prev?.note === 'string' ? prev.note : '';
      if (prevDrawing !== normalized.drawing || prevNote !== normalized.note) {
        changed = true;
        next[id] = normalized;
      }
      continue;
    }

    if (base[id] !== normalized) {
      changed = true;
      next[id] = normalized;
    }
  }

  return changed ? next : base;
};

const formatMarks = (marks) => {
  const m = Number.isFinite(marks) ? marks : Number.parseInt(marks, 10);
  const safe = Number.isFinite(m) ? m : 0;
  return `${safe} ${safe === 1 ? 'Mark' : 'Marks'}`;
};

const safeMarksNumber = (marks) => {
  const m = Number.isFinite(marks) ? marks : Number.parseInt(marks, 10);
  return Number.isFinite(m) ? m : 0;
};

const textareaSizeClassFor = (question) => {
  const marks = safeMarksNumber(question?.marks);
  const type = String(question?.type ?? '');

  if (type === 'Long Answer') {
    if (marks <= 2) return 'min-h-[120px]';
    return 'min-h-[180px]';
  }

  if (type === 'Explanation') {
    if (marks <= 2) return 'min-h-[110px]';
    return 'min-h-[150px]';
  }

  if (type === 'Short Answer' || type === 'Definition') {
    if (marks <= 1) return 'min-h-[90px]';
    if (marks <= 3) return 'min-h-[110px]';
    return 'min-h-[140px]';
  }

  // default
  if (marks <= 1) return 'min-h-[90px]';
  if (marks <= 3) return 'min-h-[120px]';
  return 'min-h-[160px]';
};

const DiagramCanvas = ({
  value,
  onChange,
  disabled,
  height = 240,
}) => {
  const canvasRef = React.useRef(null);
  const isDrawingRef = React.useRef(false);
  const lastPointRef = React.useRef({ x: 0, y: 0 });

  const drawLine = (ctx, from, to) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const getPoint = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    return {
      x: (clientX ?? 0) - rect.left,
      y: (clientY ?? 0) - rect.top,
    };
  };

  const persist = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      onChange?.(canvas.toDataURL('image/png'));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI crispness
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    ctx.scale(dpr, dpr);

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';

    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
      };
      img.src = value;
    }
  }, [value]);

  const handleStart = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    lastPointRef.current = getPoint(e, canvas);
  };

  const handleMove = (e) => {
    if (disabled) return;
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.preventDefault?.();
    const next = getPoint(e, canvas);
    drawLine(ctx, lastPointRef.current, next);
    lastPointRef.current = next;
  };

  const handleEnd = () => {
    if (disabled) return;
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    persist();
  };

  const handleClear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    onChange?.('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Draw here (mouse/touch). Your drawing autosaves.</p>
        <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={disabled}>
          Clear
        </Button>
      </div>
      <div className="rounded-lg border bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`w-full ${disabled ? 'opacity-80' : ''}`}
          style={{ height }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
};

const OnlineTestPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const activeRole = useSelector((state) => state.auth?.activeRole);

  const { data: examData, isLoading, isError } = useExamPreview(examId);

  const persisted = useMemo(() => (examId ? loadAttempt(examId) : null), [examId]);
  const [responses, setResponses] = useState(() => persisted?.responses ?? {});
  const [submitted, setSubmitted] = useState(() => Boolean(persisted?.submittedAt));
  const [submittedAt, setSubmittedAt] = useState(() => persisted?.submittedAt ?? null);
  const [autoGrade, setAutoGrade] = useState(() => persisted?.autoGrade ?? null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  useEffect(() => {
    if (!examId) return;
    saveAttempt(examId, {
      responses,
      submittedAt,
      autoGrade,
      updatedAt: new Date().toISOString(),
    });
  }, [examId, responses, submittedAt, autoGrade]);

  useEffect(() => {
    if (!examId) return;
    const fromStorage = loadAttempt(examId);
    if (!fromStorage) return;
    setResponses(fromStorage.responses ?? {});
    setSubmitted(Boolean(fromStorage.submittedAt));
    setSubmittedAt(fromStorage.submittedAt ?? null);
    setAutoGrade(fromStorage.autoGrade ?? null);
    // only on examId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  useEffect(() => {
    if (!examData) return;
    const questions = Array.isArray(examData.questions) ? examData.questions : [];
    setResponses((prev) => normalizeResponsesForExam(questions, prev));
  }, [examData]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Loading online test...</p>
      </div>
    );
  }

  if (isError || !examData) {
    return (
      <div className="container mx-auto py-24 text-center space-y-4">
        <p className="text-destructive">Unable to load this online test.</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const questions = Array.isArray(examData.questions) ? examData.questions : [];
  const grouped = groupBySection(questions);
  const groupEntries = Object.entries(grouped);

  const answeredCount = questions.reduce((count, q) => {
    const value = getResponseForQuestion(q, responses?.[q.id]);
    if (q.type === 'MCQ') return value ? count + 1 : count;
    if (q.type === 'Diagram') {
      const hasDrawing = typeof value?.drawing === 'string' && value.drawing.trim();
      const hasNote = typeof value?.note === 'string' && value.note.trim();
      return hasDrawing || hasNote ? count + 1 : count;
    }
    return typeof value === 'string' && value.trim() ? count + 1 : count;
  }, 0);

  const isComplete = questions.length > 0 && answeredCount === questions.length;

  const handleResetAttempt = () => {
    if (!examId) return;
    const ok = window.confirm('Start a new attempt? This will clear your current answers for this test on this device.');
    if (!ok) return;
    try {
      localStorage.removeItem(`${ATTEMPT_STORAGE_PREFIX}${examId}`);
    } catch {
      // ignore
    }
    setResponses({});
    setSubmitted(false);
    setSubmittedAt(null);
    setAutoGrade(null);
    setIsResultOpen(false);
  };

  const handleSubmit = () => {
    if (submitted) {
      setIsResultOpen(true);
      return;
    }

    if (!isComplete) {
      return;
    }

    const mcqs = questions.filter((q) => q.type === 'MCQ');
    const autoTotal = mcqs.reduce((sum, q) => sum + (Number.parseInt(q.marks, 10) || 0), 0);
    const autoScore = mcqs.reduce((sum, q) => {
      const selected = responses?.[q.id];
      if (!selected) return sum;
      if (q.correctAnswer && String(selected) === String(q.correctAnswer)) {
        return sum + (Number.parseInt(q.marks, 10) || 0);
      }
      return sum;
    }, 0);

    const submittedAtIso = new Date().toISOString();
    setSubmitted(true);
    setSubmittedAt(submittedAtIso);
    const grade = { autoScore, autoTotal };
    setAutoGrade(grade);

    const pct = autoTotal > 0 ? Math.round((autoScore / autoTotal) * 100) : null;
    const pass = pct == null ? null : pct >= 50;

    const studentName = [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ').trim()
      || currentUser?.username
      || currentUser?.email
      || 'Student';
    const studentEmail = currentUser?.email || null;
    const studentId = currentUser?.id != null ? String(currentUser.id) : null;
    const studentKey = studentId || studentEmail || studentName;

    if (examId) {
      upsertOnlineTestSubmission(examId, {
        examId,
        studentKey,
        studentId,
        studentEmail,
        studentName,
        submittedAt: submittedAtIso,
        answeredCount,
        totalQuestions: questions.length,
        autoScore,
        autoTotal,
        percentage: pct,
        pass,
      });
    }

    setIsResultOpen(true);
  };

  const passLabel = (() => {
    if (!autoGrade || !autoGrade.autoTotal) return null;
    const pct = Math.round((autoGrade.autoScore / autoGrade.autoTotal) * 100);
    return pct >= 50 ? 'Pass' : 'Fail';
  })();

  const canViewTeacherResults = hasTeacherAccess(activeRole);

  return (
    <div className="container mx-auto py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-background z-30 py-4 border-b shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Online Test</h1>
          <p className="text-sm text-muted-foreground">Attempt the test and submit when finished.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Result</DialogTitle>
              <DialogDescription>
                {submittedAt ? `Submitted on ${new Date(submittedAt).toLocaleString()}` : 'Your result summary.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Answered</span>
                <span className="text-sm font-medium">{answeredCount} / {questions.length}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Auto-graded (MCQ)</span>
                <span className="text-sm font-medium">
                  {autoGrade ? `${autoGrade.autoScore} / ${autoGrade.autoTotal}` : '—'}
                </span>
              </div>

              {autoGrade?.autoTotal ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={passLabel === 'Pass' ? 'default' : 'destructive'}>
                    {passLabel}
                  </Badge>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Pass/Fail is calculated only from MCQs. Other answers need teacher evaluation.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResultOpen(false)}>
                Close
              </Button>
              {canViewTeacherResults && examId ? (
                <Button onClick={() => navigate(`/teacher/online-test-results/${examId}`)}>
                  View Teacher Results
                </Button>
              ) : null}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {submitted && (
          <Alert className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Submitted</AlertTitle>
            <AlertDescription>
              {autoGrade
                ? `Auto-graded (MCQ): ${autoGrade.autoScore}/${autoGrade.autoTotal}. Other questions require evaluation.`
                : 'Your responses have been saved.'}
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm border">
          <CardHeader className="border-b">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-serif text-center">{examData.title || 'Online Test'}</h2>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Duration: {examData.duration || 60} mins</span>
                <span className="flex items-center gap-1.5">Total Marks: {examData.totalMarks || 0}</span>
              </div>
              {examData.instructions && (
                <div className="mt-3 bg-muted/30 p-4 rounded-xl text-left">
                  <p className="text-sm font-semibold mb-1">Instructions</p>
                  <p className="text-sm text-muted-foreground">{examData.instructions}</p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8 space-y-10">
            {groupEntries.map(([sectionName, sectionQuestions], sectionIndex) => (
              <div key={`${sectionName}-${sectionIndex}`} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 pb-3 border-b">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{sectionName}</h3>
                    <p className="text-xs text-muted-foreground">{sectionQuestions.length} questions</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {sectionQuestions[0]?.type && (
                      <Badge variant="outline" className="text-xs bg-transparent">{sectionQuestions[0].type}</Badge>
                    )}
                    {sectionQuestions[0]?.difficulty && (
                      <Badge variant="outline" className="text-xs bg-transparent border-dashed">{sectionQuestions[0].difficulty}</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {sectionQuestions.map((question, idx) => {
                    const qIndex = questions.findIndex((q) => q.id === question.id) + 1;
                    const value = getResponseForQuestion(question, responses?.[question.id]);

                    return (
                      <div key={question.id} className="space-y-3">
                        <div className="flex items-start gap-4">
                          <span className="font-semibold text-lg min-w-[32px]">Q{qIndex || idx + 1}.</span>
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                              <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                {question.text}
                              </p>
                              <span className="font-semibold shrink-0">[{formatMarks(question.marks)}]</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-xs bg-transparent">{question.type}</Badge>
                              {question.difficulty && (
                                <Badge variant="outline" className="text-xs bg-transparent border-dashed">{question.difficulty}</Badge>
                              )}
                            </div>

                            {question.type === 'MCQ' ? (
                              <fieldset className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3" disabled={submitted}>
                                {Array.isArray(question.options) && question.options.map((opt, optIdx) => {
                                  const id = `${question.id}-opt-${optIdx}`;
                                  const selected = String(value) === String(opt);
                                  return (
                                    <label
                                      key={id}
                                      htmlFor={id}
                                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                        selected
                                          ? 'border-primary bg-primary/5'
                                          : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                                      } ${submitted ? 'opacity-80 cursor-not-allowed' : ''}`}
                                    >
                                      <input
                                        id={id}
                                        type="radio"
                                        name={question.id}
                                        className="h-4 w-4"
                                        checked={selected}
                                        onChange={() => setResponses((prev) => ({ ...prev, [question.id]: opt }))}
                                      />
                                      <span className="text-sm break-words min-w-0">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-800 border text-xs font-medium mr-2">
                                          {String.fromCharCode(65 + optIdx)}
                                        </span>
                                        {opt}
                                      </span>
                                    </label>
                                  );
                                })}
                              </fieldset>
                            ) : question.type === 'Diagram' ? (
                              <div className="mt-3 space-y-3">
                                <DiagramCanvas
                                  value={typeof value?.drawing === 'string' ? value.drawing : ''}
                                  disabled={submitted}
                                  onChange={(drawing) =>
                                    setResponses((prev) => ({
                                      ...prev,
                                      [question.id]: {
                                        drawing,
                                        note: typeof prev?.[question.id]?.note === 'string' ? prev[question.id].note : (typeof value?.note === 'string' ? value.note : ''),
                                      },
                                    }))
                                  }
                                  height={260}
                                />

                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Notes (optional)</p>
                                  <Textarea
                                    value={typeof value?.note === 'string' ? value.note : ''}
                                    onChange={(e) =>
                                      setResponses((prev) => ({
                                        ...prev,
                                        [question.id]: {
                                          drawing: typeof prev?.[question.id]?.drawing === 'string' ? prev[question.id].drawing : (typeof value?.drawing === 'string' ? value.drawing : ''),
                                          note: e.target.value,
                                        },
                                      }))
                                    }
                                    placeholder="Write short labels/details for your diagram..."
                                    disabled={submitted}
                                    className="min-h-[80px]"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3">
                                <Textarea
                                  value={typeof value === 'string' ? value : ''}
                                  onChange={(e) => setResponses((prev) => ({ ...prev, [question.id]: e.target.value }))}
                                  placeholder="Type your answer here..."
                                  disabled={submitted}
                                  className={textareaSizeClassFor(question)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="max-w-4xl mx-auto sticky bottom-4">
          <Card className="border shadow-md">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Answered: <span className="font-medium text-foreground">{answeredCount}</span> / {questions.length}
                {submittedAt ? <span className="ml-2">• Submitted: {new Date(submittedAt).toLocaleString()}</span> : null}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                {submitted ? (
                  <>
                    <Button type="button" variant="outline" onClick={handleResetAttempt} className="sm:w-auto w-full">
                      Start New Attempt
                    </Button>
                    <Button onClick={handleSubmit} className="sm:w-auto w-full">
                      View Result
                    </Button>
                  </>
                ) : isComplete ? (
                  <Button onClick={handleSubmit} className="sm:w-auto w-full">
                    Submit Test
                  </Button>
                ) : (
                  <div className="text-xs text-muted-foreground sm:text-right w-full sm:w-auto">
                    Complete all questions to submit.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnlineTestPage;
