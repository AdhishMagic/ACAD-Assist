import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowRight, RefreshCw } from 'lucide-react';
import { loadOnlineTestSubmissions } from '../utils/onlineTestStorage';

const SUBMISSIONS_PREFIX = 'acadassist.teacher.onlineTestSubmissions.v1.';

const listExamIdsWithSubmissions = () => {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter((k) => k.startsWith(SUBMISSIONS_PREFIX))
      .map((k) => k.slice(SUBMISSIONS_PREFIX.length))
      .filter(Boolean);
  } catch {
    return [];
  }
};

const OnlineTestsPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const rows = useMemo(() => {
    const examIds = listExamIdsWithSubmissions();
    return examIds.map((examId) => {
      const submissions = loadOnlineTestSubmissions(examId);
      const total = submissions.length;
      const passed = submissions.filter((s) => s?.pass === true).length;
      const failed = submissions.filter((s) => s?.pass === false).length;
      const pending = submissions.filter((s) => s?.pass == null).length;

      const lastSubmittedAt = submissions
        .map((s) => s?.submittedAt)
        .filter(Boolean)
        .sort()
        .slice(-1)[0];

      return {
        examId,
        total,
        passed,
        failed,
        pending,
        lastSubmittedAt,
      };
    }).sort((a, b) => {
      const av = a.lastSubmittedAt ? String(a.lastSubmittedAt) : '';
      const bv = b.lastSubmittedAt ? String(b.lastSubmittedAt) : '';
      if (av === bv) return String(a.examId).localeCompare(String(b.examId));
      return bv.localeCompare(av);
    });
  }, [refreshKey]);

  return (
    <div className="container mx-auto max-w-6xl py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Online Tests</h1>
          <p className="text-sm text-muted-foreground">All published tests with student submissions.</p>
        </div>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setRefreshKey((v) => v + 1)}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Tests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam ID</TableHead>
                  <TableHead>Attended</TableHead>
                  <TableHead>Pass</TableHead>
                  <TableHead>Fail</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Last Submit</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                      No online test submissions found yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.examId}>
                      <TableCell className="font-medium">{r.examId}</TableCell>
                      <TableCell>{r.total}</TableCell>
                      <TableCell><Badge>{r.passed}</Badge></TableCell>
                      <TableCell><Badge variant="destructive">{r.failed}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{r.pending}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.lastSubmittedAt ? new Date(r.lastSubmittedAt).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => navigate(`/teacher/online-test-results/${r.examId}`)}
                        >
                          View Results <ArrowRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 text-xs text-muted-foreground border-t">
            Note: This list is built from localStorage submissions (mock backend).
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineTestsPage;
