"use client";

import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';

interface RestoreConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  itemName: string;
  itemType: string;
}

export function RestoreConfirmationModal({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: RestoreConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Restore ${itemType}`}
      description={`Are you sure you want to restore this ${itemType.toLowerCase()}?`}
    >
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">{itemName}</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            This will make the {itemType.toLowerCase()} active and visible again.
          </p>
        </div>
        <div className="flex items-center gap-3 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Restore
          </Button>
        </div>
      </div>
    </Modal>
  );
}
