"use client";

import { Eye, EyeOff } from 'lucide-react';

interface ShowDeletedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ShowDeletedToggle({ checked, onChange }: ShowDeletedToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
        ${checked
          ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }
      `}
      type="button"
    >
      {checked ? (
        <>
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">Showing Deleted</span>
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4" />
          <span className="text-sm font-medium">Show Deleted</span>
        </>
      )}
    </button>
  );
}
