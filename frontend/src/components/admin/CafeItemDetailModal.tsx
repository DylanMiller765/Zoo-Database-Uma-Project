"use client";

import { CafeItem } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';

interface CafeItemDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: CafeItem | null;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function CafeItemDetailModal({ open, onClose, item, onEdit, canEdit = true }: CafeItemDetailModalProps) {
  if (!item) return null;

  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Café Item Details"
      description={`View details for ${item.name}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Item ID: {item.item_id}</p>
          </div>
          {canEdit && onEdit && (
            <Button onClick={onEdit} variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {/* Item Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <p className="text-base text-gray-900 capitalize">{item.category}</p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
            <p className="text-base text-gray-900 font-semibold">${price.toFixed(2)}</p>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Availability</label>
            <Badge variant={item.is_available ? 'success' : 'secondary'}>
              {item.is_available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          {/* Cafe ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Café ID</label>
            <p className="text-base text-gray-900">#{item.cafe_id}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
          <p className="text-base text-gray-900 whitespace-pre-wrap">
            {item.description || 'No description available'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
