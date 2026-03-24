import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { loadOnlineTestSubmissions } from '../utils/onlineTestStorage';

const formatPct = (value) => {
  if (value == null) return '—';
  return `${value}%`;
};

const OnlineTestResultsPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams();

  const submissions = useMemo(() => {
    if (!examId) return [];
    return loadOnlineTestSubmissions(examId);
  }, [examId]);

  const summary = useMemo(() => {
    const total = submissions.length;
    const passed = submissions.filter((s) => s?.pass === true).length;
    const failed = submissions.filter((s) => s?.pass === false).length;
    const pending = submissions.filter((s) => s?.pass == null).length;
    return { total, passed, failed, pending };
  }, [submissions]);

  return (
    <div className="container mx-auto max-w-6xl py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Online Test Results</h1>
          <p className="text-sm text-muted-foreground">Exam ID: {examId}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={() => navigate('/teacher/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Students Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pass</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.passed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Fail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pending}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Answered</TableHead>
                  <TableHead>MCQ Score</TableHead>
                  <TableHead>Percent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                      No students have submitted this test yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((s) => (
                    <TableRow key={s.studentKey}>
                      <TableCell className="font-medium">{s.studentName || 'Student'}</TableCell>
                      <TableCell className="text-muted-foreground">{s.studentEmail || s.studentId || '—'}</TableCell>
                      <TableCell>{s.answeredCount ?? '—'} / {s.totalQuestions ?? '—'}</TableCell>
                      <TableCell>{s.autoScore ?? '—'} / {s.autoTotal ?? '—'}</TableCell>
                      <TableCell>{formatPct(s.percentage)}</TableCell>
                      <TableCell>
                        {s.pass === true ? (
                          <Badge>Pass</Badge>
                        ) : s.pass === false ? (
                          <Badge variant="destructive">Fail</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 text-xs text-muted-foreground border-t">
            Note: Score/Pass/Fail is auto-calculated from MCQs only. Other question types require evaluation.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineTestResultsPage;
