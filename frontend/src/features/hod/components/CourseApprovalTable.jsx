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
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ApprovalActions } from './ApprovalActions';

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
  Approved: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
  Rejected: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
  "Revision Requested": "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
};

export function CourseApprovalTable({ approvals }) {
  if (!approvals?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs Approval</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((item, index) => (
              <TableRow 
                key={item.id}
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.teacher}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[item.status] || ""}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ApprovalActions approvalId={item.id} currentStatus={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
