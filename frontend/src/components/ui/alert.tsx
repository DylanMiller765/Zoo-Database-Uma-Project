import React from 'react';
import { X } from 'lucide-react';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
  className?: string;
}

const alertStyles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  error: 'text-red-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

const closeButtonStyles = {
  error: 'text-red-400 hover:text-red-600',
  success: 'text-green-400 hover:text-green-600',
  warning: 'text-yellow-400 hover:text-yellow-600',
  info: 'text-blue-400 hover:text-blue-600',
};

export function Alert({
  type,
  title,
  message,
  onClose,
  dismissible = true,
  className = '',
}: AlertProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 flex items-start gap-3 ${alertStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex-1 pt-0.5">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 mt-0.5 ${closeButtonStyles[type]} hover:opacity-75`}
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Toast variant - for temporary notifications
interface ToastProps extends Omit<AlertProps, 'dismissible'> {
  autoClose?: number; // milliseconds
}

export function Toast({
  type,
  title,
  message,
  onClose,
  autoClose = 5000,
  className = '',
}: ToastProps) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm shadow-lg z-50 animate-in fade-in slide-in-from-top-2 ${className}`}
    >
      <Alert
        type={type}
        title={title}
        message={message}
        onClose={onClose}
        dismissible={true}
        className="rounded-lg"
      />
    </div>
  );
}
