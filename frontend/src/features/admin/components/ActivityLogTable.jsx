import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  Download, 
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Activity,
  User,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActivityLogTable = ({ logs, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("All");

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === "All" || log.module === filterModule;
    
    return matchesSearch && matchesModule;
  }) || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Success</Badge>;
      case 'Failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case 'Warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><ShieldAlert className="w-3 h-3 mr-1" /> Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getModuleColor = (module) => {
    switch (module) {
      case 'Authentication': return 'text-purple-600 bg-purple-50';
      case 'Knowledge Repo': return 'text-blue-600 bg-blue-50';
      case 'AI Assistant': return 'text-indigo-600 bg-indigo-50';
      case 'User Management': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            System Activities
          </h2>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by user or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Authentication', 'Knowledge Repo', 'AI Assistant', 'User Management'].map(module => (
              <Badge 
                key={module}
                variant={filterModule === module ? "default" : "outline"}
                className={`cursor-pointer ${filterModule === module ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setFilterModule(module)}
              >
                {module}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div></TableCell>
                  <TableCell><div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div></TableCell>
                  <TableCell><div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div></TableCell>
                  <TableCell className="text-right"><div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredLogs.length > 0 ? (
              <AnimatePresence>
                {filteredLogs.map((log) => (
                  <TableRow 
                    key={log.id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-default"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium text-xs">
                          {log.user.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 font-medium">
                      {log.action}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getModuleColor(log.module)} border-current/20`}>
                        {log.module}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                        {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <User className="w-4 h-4 mr-2" /> View User Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <FileText className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Activity className="h-8 w-8 text-gray-300 mb-2" />
                    <p>No activity logs found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityLogTable;
