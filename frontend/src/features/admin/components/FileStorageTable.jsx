import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Download, Search, File, Image as ImageIcon, FileText, Video, MoreHorizontal } from 'lucide-react';
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminAPI } from '../services/adminAPI';

const FileStorageTable = ({ files, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: adminAPI.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-storage-files'] });
      queryClient.invalidateQueries({ queryKey: ['admin-storage-stats'] });
    }
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const fileTypes = ["All", ...Array.from(new Set((files || []).map(file => file.type).filter(Boolean)))];

  const filteredFiles = files?.filter(file => {
    const name = file.name || "";
    const uploader = file.uploadedBy || "";
    const type = file.type || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || uploader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  }) || [];

  const getFileIcon = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (t.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (t.includes('video')) return <Video className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleDownload = (file) => {
    if (!file.url) return;
    window.open(file.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hosted Files</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files or uploaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {fileTypes.map(type => (
              <Badge 
                key={type}
                variant={filterType === type ? "default" : "outline"}
                className={`cursor-pointer ${filterType === type ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={6} className="text-center py-8">Loading files...</TableCell></TableRow>
            ) : filteredFiles.length > 0 ? (
              <AnimatePresence>
                {filteredFiles.map((file) => (
                  <TableRow 
                    key={file.id}
                    component={motion.tr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <span className="font-medium text-gray-900 dark:text-gray-100">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {file.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">{file.size}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{file.uploadedBy}</TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">{file.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={!file.url}
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="w-4 h-4 mr-2" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                            onClick={() => handleDelete(file.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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
                  No files found matching criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FileStorageTable;
