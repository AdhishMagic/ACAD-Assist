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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function TeacherContributionTable({ contributions }) {
  if (!contributions?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher Name</TableHead>
              <TableHead>Courses Handled</TableHead>
              <TableHead>Notes Uploaded</TableHead>
              <TableHead>AI Materials</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((teacher, index) => (
              <TableRow 
                key={teacher.id}
                as={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>{teacher.coursesHandled}</TableCell>
                <TableCell>{teacher.notesUploaded}</TableCell>
                <TableCell>{teacher.aiMaterialsGenerated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
