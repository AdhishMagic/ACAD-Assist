import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, BookOpen, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ClassesTable = ({ classes = [], onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const subjects = ['All', ...new Set(classes.map((c) => c?.subject).filter(Boolean))];

  const filteredClasses = classes.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || c.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <Card className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Classes Overview</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">View and manage your active classes</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px] lg:w-[250px] bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="h-10 w-[190px] bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
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
                <th className="p-4 pl-6">Class Name</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Students</th>
                <th className="p-4">Materials</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls, idx) => (
                    <motion.tr 
                      key={cls.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <td className="p-4 pl-6 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          <BookOpen size={16} />
                        </div>
                        {cls.name}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full text-xs font-medium">
                          {cls.subject}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{cls.students}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{cls.materials} items</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{cls.lastActivity}</td>
                      <td className="p-4 pr-6 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails?.(cls)}
                          className="text-primary hover:text-primary-focus hover:bg-primary/10"
                        >
                          View details
                          <ExternalLink size={14} className="ml-2" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No classes found matching the criteria.
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

export default ClassesTable;
