"use client";

import { useState, useEffect } from 'react';
import { Cafe, CreateCafeData } from '@/types';
import { cafeService } from '@/services/cafe.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CafeFormProps {
  cafe?: Cafe | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CafeForm({ cafe, onSuccess, onCancel }: CafeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateCafeData>({
    name: '',
    location: '',
    opening_time: '10:00',
    closing_time: '17:00',
    manager_id: undefined,
  });

  useEffect(() => {
    if (cafe) {
      setFormData({
        name: cafe.name,
        location: cafe.location || '',
        opening_time: cafe.opening_time || '10:00',
        closing_time: cafe.closing_time || '17:00',
        manager_id: cafe.manager_id,
      });
    }
  }, [cafe]);

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
      if (cafe?.cafe_id) {
        await cafeService.update(cafe.cafe_id, formData);
      } else {
        await cafeService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save cafe');
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
          <Label htmlFor="name">Cafe Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Savanna Snacks"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., African Savanna Area"
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
          {loading ? 'Saving...' : cafe ? 'Update Cafe' : 'Add Cafe'}
        </Button>
      </div>
    </form>
  );
}
