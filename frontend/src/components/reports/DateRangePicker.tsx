import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onRangeChange: (startDate: string, endDate: string) => void;
  label?: string;
  required?: boolean;
  showQuickSelect?: boolean;
}

/**
 * Reusable date range picker with quick select options
 */
export function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
  label = 'Date Range',
  required = false,
  showQuickSelect = true
}: DateRangePickerProps) {

  const handleQuickSelect = (e: React.MouseEvent, days: number) => {
    e.preventDefault();
    e.stopPropagation();
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

    onRangeChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  const handleQuickSelectFuture = (e: React.MouseEvent, days: number) => {
    e.preventDefault();
    e.stopPropagation();
    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    onRangeChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  const handleThisMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    onRangeChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  const handleThisYear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);

    onRangeChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-xs text-gray-600">
            Start Date
          </Label>
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => onRangeChange(e.target.value, endDate)}
            required={required}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="endDate" className="text-xs text-gray-600">
            End Date
          </Label>
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => onRangeChange(startDate, e.target.value)}
            required={required}
            className="mt-1"
          />
        </div>
      </div>

      {showQuickSelect && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 self-center">Quick select:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => handleQuickSelect(e, 7)}
            className="text-xs"
          >
            Last 7 Days
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => handleQuickSelect(e, 30)}
            className="text-xs"
          >
            Last 30 Days
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleThisMonth}
            className="text-xs"
          >
            This Month
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleThisYear}
            className="text-xs"
          >
            This Year
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => handleQuickSelectFuture(e, 30)}
            className="text-xs"
          >
            Next 30 Days
          </Button>
        </div>
      )}
    </div>
  );
}
