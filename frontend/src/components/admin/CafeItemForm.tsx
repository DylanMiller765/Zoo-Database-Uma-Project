"use client";

import { useState, useEffect } from 'react';
import { CafeItem, CreateCafeItemData } from '@/types';
import { cafeItemService } from '@/services/cafeItem.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CafeItemFormProps {
  item?: CafeItem | null;
  cafeId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CafeItemForm({ item, cafeId, onSuccess, onCancel }: CafeItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateCafeItemData>({
    cafe_id: cafeId,
    name: '',
    description: '',
    category: '',
    price: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        cafe_id: item.cafe_id,
        name: item.name,
        description: item.description || '',
        category: item.category || '',
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      });
    } else {
      // Reset to defaults for new item
      setFormData({
        cafe_id: cafeId,
        name: '',
        description: '',
        category: '',
        price: 0,
      });
    }
  }, [item, cafeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value ? parseFloat(value) : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (item?.item_id) {
        await cafeItemService.update(item.item_id, formData);
      } else {
        await cafeItemService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save café item');
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
