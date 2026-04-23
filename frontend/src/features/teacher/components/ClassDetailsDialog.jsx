import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ClassDetailsDialog = ({ open, onOpenChange, cls }) => {
  if (!cls) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cls.name}</DialogTitle>
          <DialogDescription>Cohort details</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground">Subject</div>
            <div className="font-medium">{cls.subject}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground">Students</div>
            <div className="font-medium">{cls.students}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground">Materials</div>
            <div className="font-medium">{cls.materials} items</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-muted-foreground">Last activity</div>
            <div className="font-medium">{cls.lastActivity}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailsDialog;
