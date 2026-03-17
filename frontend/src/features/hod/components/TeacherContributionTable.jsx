import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, ChevronDown, Calendar } from 'lucide-react';

export function TeacherContributionTable({
  contributions,
  courses = [],
  selectedCourse = 'all',
  onCourseFilter,
  selectedDate = 'all',
  onDateFilter,
}) {
  const dateOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Teacher Contributions</CardTitle>
            <CardDescription>Evaluate teacher productivity and contributions</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Course Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{selectedCourse === 'all' ? 'All Courses' : selectedCourse}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCourseFilter?.('all')}>
                  All Courses
                </DropdownMenuItem>
                {courses.map((course) => (
                  <DropdownMenuItem key={course} onClick={() => onCourseFilter?.(course)}>
                    {course}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{dateOptions.find(d => d.value === selectedDate)?.label || 'All Time'}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {dateOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => onDateFilter?.(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!contributions?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No teacher contributions found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher Name</TableHead>
                  <TableHead>Courses Handled</TableHead>
                  <TableHead>Notes Uploaded</TableHead>
                  <TableHead>AI Materials</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((teacher, index) => (
                  <motion.tr
                    key={teacher.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-semibold text-primary">
                          {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.course}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">{teacher.coursesHandled}</Badge>
                    </TableCell>
                    <TableCell>{teacher.notesUploaded}</TableCell>
                    <TableCell>
                      <span className="text-violet-600 dark:text-violet-400 font-medium">{teacher.aiMaterialsGenerated}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{teacher.lastActivity}</span>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
