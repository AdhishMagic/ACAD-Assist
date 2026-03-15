import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, Clock, FileText, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentActivityTable = ({ activityData = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('7days'); // 'today', '7days', '30days'

  const classes = ['All', ...new Set(activityData.map(a => a.class))];

  const filteredActivity = activityData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <Card className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm animate-in fade-in duration-500">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Student Activity Monitor</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Track engagement and study patters across all your classes</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[200px] lg:w-[250px] bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c} value={c}>{c === 'All' ? 'All Classes' : c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Student Name</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-center">Notes Viewed</th>
                <th className="p-4 text-center">AI Questions</th>
                <th className="p-4 text-right pr-6">Study Hours</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredActivity.length > 0 ? (
                  filteredActivity.map((student, idx) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <td className="p-4 pl-6 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-2 rounded-full">
                          <User size={16} />
                        </div>
                        <div>
                          {student.name}
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">{student.class}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {student.lastLogin}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full text-xs font-medium min-w-[3rem]">
                          <FileText className="w-3 h-3 mr-1" />
                          {student.notesViewed}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-full text-xs font-medium min-w-[3rem]">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {student.aiQuestions}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right font-medium text-gray-900 dark:text-white">
                        {student.studyHours}h
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No activity found matching the criteria.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentActivityTable;
