import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ChevronUp } from 'lucide-react';

interface ReportEmptyStateProps {
  icon?: React.ReactNode;
}

/**
 * Empty state shown before a report is generated
 * Provides clear guidance to the user on what to do next
 */
export function ReportEmptyState({
  icon,
}: ReportEmptyStateProps) {
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 relative opacity-50">
          {icon || <FileText className="h-16 w-16 text-gray-400" />}
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Report Results
        </h3>
      </CardContent>
    </Card>
  );
}
