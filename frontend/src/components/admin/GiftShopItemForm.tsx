"use client";

import { useState, useEffect } from 'react';
import { GiftShopItem, CreateGiftShopItemData } from '@/types';
import { giftShopItemService } from '@/services/giftShopItem.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GiftShopItemFormProps {
  item?: GiftShopItem | null;
  giftShopId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function GiftShopItemForm({ item, giftShopId, onSuccess, onCancel }: GiftShopItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateGiftShopItemData>({
    gift_shop_id: giftShopId,
    name: '',
    description: '',
    category: '',
    price: 0,
    cost: 0,
    quantity_in_stock: 0,
    supplier: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        gift_shop_id: item.gift_shop_id,
        name: item.name,
        description: item.description || '',
        category: item.category || '',
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        cost: typeof item.cost === 'string' ? parseFloat(item.cost) : item.cost,
        quantity_in_stock: item.quantity_in_stock,
        supplier: item.supplier || '',
      });
    } else {
      // Reset to defaults for new item
      setFormData({
        gift_shop_id: giftShopId,
        name: '',
        description: '',
        category: '',
        price: 0,
        cost: 0,
        quantity_in_stock: 0,
        supplier: '',
      });
    }
  }, [item, giftShopId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' ? (value ? parseFloat(value) : 0) :
              name === 'quantity_in_stock' ? (value ? parseInt(value) : 0) :
              value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (item?.item_id) {
        await giftShopItemService.update(item.item_id, formData);
      } else {
        await giftShopItemService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save gift shop item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="cost">Cost ($) *</Label>
          <Input
            id="cost"
            name="cost"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="quantity_in_stock">Quantity in Stock *</Label>
          <Input
            id="quantity_in_stock"
            name="quantity_in_stock"
            type="number"
            min="0"
            value={formData.quantity_in_stock}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="supplier">Supplier *</Label>
          <Input
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
}
