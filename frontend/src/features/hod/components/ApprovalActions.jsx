import React from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMaterialApprovalActions } from '../hooks/useDepartmentData';

export function ApprovalActions({ approvalId, currentStatus }) {
  const { approve, reject, requestRevision, isApproving, isRejecting, isRequestingRevision } = useMaterialApprovalActions();
  const isBusy = isApproving || isRejecting || isRequestingRevision;

  if (currentStatus !== 'Pending') {
    return <span className="text-sm text-muted-foreground mr-2">Processed</span>;
  }

  return (
    <div className="flex items-center justify-end space-x-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
        onClick={() => approve(approvalId)}
        disabled={isBusy}
        title="Approve"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        onClick={() => requestRevision(approvalId)}
        disabled={isBusy}
        title="Request Revision"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
        onClick={() => reject(approvalId)}
        disabled={isBusy}
        title="Reject"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
