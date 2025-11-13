import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ChevronUp } from 'lucide-react';

interface ReportEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

/**
 * Empty state shown before a report is generated
 * Provides clear guidance to the user on what to do next
 */
export function ReportEmptyState({
  icon,
  title = 'No Report Generated',
  description = 'Configure the parameters above and click "Generate Report" to view your data.'
}: ReportEmptyStateProps) {
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 relative">
          {icon || <FileText className="h-16 w-16 text-gray-400" />}
          <ChevronUp className="h-8 w-8 text-sea_green-500 absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce" />
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {title}
        </h3>

        <p className="text-gray-500 max-w-md">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
          <div className="h-px w-12 bg-gray-300"></div>
          <span>Configure • Generate • Export</span>
          <div className="h-px w-12 bg-gray-300"></div>
        </div>
      </CardContent>
    </Card>
  );
}
