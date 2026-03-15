import React from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApprovalActions } from '../hooks/useDepartmentData';

export function ApprovalActions({ approvalId, currentStatus }) {
  const { approve, reject, requestRevision, isApproving, isRejecting, isRequestingRevision } = useApprovalActions();

  if (currentStatus !== 'Pending') {
    return <span className="text-sm text-muted-foreground mr-2">Processed</span>;
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => approve(approvalId)}
        disabled={isApproving || isRejecting || isRequestingRevision}
        title="Approve"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={() => requestRevision(approvalId)}
        disabled={isApproving || isRejecting || isRequestingRevision}
        title="Request Revision"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => reject(approvalId)}
        disabled={isApproving || isRejecting || isRequestingRevision}
        title="Reject"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
