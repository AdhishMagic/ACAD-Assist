import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const todayISODate = () => new Date().toISOString().slice(0, 10);

const AddClassDialog = ({ open, onOpenChange, onSubmit }) => {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [students, setStudents] = useState('');

  const canSubmit = useMemo(() => {
    const studentsNumber = Number(students);
    return Boolean(className.trim()) && Boolean(subject.trim()) && Number.isFinite(studentsNumber) && studentsNumber >= 0;
  }, [className, subject, students]);

  const reset = () => {
    setClassName('');
    setSubject('');
    setStudents('');
  };

  const handleOpenChange = (nextOpen) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit?.({
      name: className.trim(),
      subject: subject.trim(),
      students: Number(students),
      lastActivity: todayISODate(),
    });

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Cohort</DialogTitle>
          <DialogDescription>Create a new cohort to track students and materials.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="className">Cohort name</Label>
            <Input
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., CS101"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="students">Students</Label>
            <Input
              id="students"
              type="number"
              min={0}
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              placeholder="0"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassDialog;
