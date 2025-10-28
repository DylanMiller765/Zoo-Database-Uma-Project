"use client";

import { useState, useEffect } from 'react';
import { GiftShop, CreateGiftShopData } from '@/types';
import { giftShopService } from '@/services/giftShop.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GiftShopFormProps {
  giftShop?: GiftShop | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function GiftShopForm({ giftShop, onSuccess, onCancel }: GiftShopFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateGiftShopData>({
    name: '',
    location: '',
    opening_time: '09:00',
    closing_time: '18:00',
    manager_id: undefined,
  });

  useEffect(() => {
    if (giftShop) {
      setFormData({
        name: giftShop.name,
        location: giftShop.location || '',
        opening_time: giftShop.opening_time || '09:00',
        closing_time: giftShop.closing_time || '18:00',
        manager_id: giftShop.manager_id,
      });
    }
  }, [giftShop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'manager_id' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (giftShop?.gift_shop_id) {
        await giftShopService.update(giftShop.gift_shop_id, formData);
      } else {
        await giftShopService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save gift shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Gift Shop Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Safari Shop"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Main Entrance"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager_id">Manager ID</Label>
          <Input
            type="number"
            id="manager_id"
            name="manager_id"
            value={formData.manager_id || ''}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="opening_time">Opening Time</Label>
          <Input
            type="time"
            id="opening_time"
            name="opening_time"
            value={formData.opening_time}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closing_time">Closing Time</Label>
          <Input
            type="time"
            id="closing_time"
            name="closing_time"
            value={formData.closing_time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : giftShop ? 'Update Gift Shop' : 'Add Gift Shop'}
        </Button>
      </div>
    </form>
  );
}
