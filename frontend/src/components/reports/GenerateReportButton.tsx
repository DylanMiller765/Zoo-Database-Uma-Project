import React from 'react';
import { Button } from '@/components/ui/button';
import { FileBarChart, Loader2, RotateCcw } from 'lucide-react';

interface GenerateReportButtonProps {
  onGenerate: () => void;
  onClear?: () => void;
  loading?: boolean;
  disabled?: boolean;
  hasGenerated?: boolean;
  generateLabel?: string;
  regenerateLabel?: string;
}

/**
 * Standardized button for generating reports
 * Handles loading states and provides clear visual feedback
 */
export function GenerateReportButton({
  onGenerate,
  onClear,
  loading = false,
  disabled = false,
  hasGenerated = false,
  generateLabel = 'Generate Report',
  regenerateLabel = 'Regenerate Report'
}: GenerateReportButtonProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Button
        onClick={onGenerate}
        disabled={disabled || loading}
        className="bg-sea_green-600 hover:bg-sea_green-700 text-white flex items-center gap-2 px-6"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <FileBarChart className="h-5 w-5" />
            <span>{hasGenerated ? regenerateLabel : generateLabel}</span>
          </>
        )}
      </Button>

      {onClear && (
        <Button
          onClick={onClear}
          disabled={loading}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          size="lg"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Clear</span>
        </Button>
      )}
    </div>
  );
}
