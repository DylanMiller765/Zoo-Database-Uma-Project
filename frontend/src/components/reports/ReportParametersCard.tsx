import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface ReportParametersCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Reusable wrapper card for report parameters
 * Provides consistent styling and layout for all report parameter forms
 */
export function ReportParametersCard({
  title = 'Report Parameters',
  description = 'Configure the parameters below and click Generate Report',
  children
}: ReportParametersCardProps) {
  return (
    <Card className="border-sea_green-200 bg-gradient-to-br from-white to-sea_green-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-sea_green-600" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}
