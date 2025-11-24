"use client";

import { GiftShopItem } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { SimpleImageLoader } from '@/components/ImageLoader';

interface GiftShopItemDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: GiftShopItem | null;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function GiftShopItemDetailModal({ open, onClose, item, onEdit, canEdit = true }: GiftShopItemDetailModalProps) {
  if (!item) return null;

  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
  const cost = typeof item.cost === 'string' ? parseFloat(item.cost) : item.cost;
  const margin = ((price - cost) / price * 100);
  const isDeleted = item.deleted_at !== null && item.deleted_at !== undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gift Shop Item Details"
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

        {/* Item Image */}
        {item.image_url && (
          <div className="mb-4">
            <SimpleImageLoader
              src={item.image_url}
              alt={item.name}
              className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200 mx-auto"
            />
          </div>
        )}

        {/* Item Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <p className="text-base text-gray-900 capitalize">{item.category}</p>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Supplier</label>
            <p className="text-base text-gray-900">{item.supplier}</p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
            <p className="text-base text-gray-900 font-semibold">${price.toFixed(2)}</p>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Cost</label>
            <p className="text-base text-gray-900">${cost.toFixed(2)}</p>
          </div>

          {/* Profit Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Profit Margin</label>
            <p className="text-base text-gray-900">{margin.toFixed(1)}%</p>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Stock Quantity</label>
            <div className="flex items-center gap-2">
              <p className="text-base text-gray-900">{item.quantity_in_stock} units</p>
              {item.quantity_in_stock < 10 && !isDeleted && (
                <Badge variant="warning">Low Stock</Badge>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <Badge variant={isDeleted ? 'danger' : 'success'}>
              {isDeleted ? 'Deleted' : 'Available'}
            </Badge>
          </div>

          {/* Gift Shop ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Gift Shop ID</label>
            <p className="text-base text-gray-900">#{item.gift_shop_id}</p>
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
