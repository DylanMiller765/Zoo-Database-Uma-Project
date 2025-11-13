"use client";

import { useState, useEffect } from 'react';
import { FeedingSchedule, CreateFeedingScheduleData } from '@/types';
import { feedingScheduleService } from '@/services/feedingSchedule.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FeedingScheduleFormProps {
  animalId: number;
  schedule?: FeedingSchedule | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FeedingScheduleForm({ animalId, schedule, onSuccess, onCancel }: FeedingScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateFeedingScheduleData>({
    animal_id: animalId,
    food_description: '',
    frequency: '',
    scheduled_time: '',
    notes: '',
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        animal_id: schedule.animal_id,
        food_description: schedule.food_description,
        frequency: schedule.frequency || '',
        scheduled_time: schedule.scheduled_time || '',
        notes: schedule.notes || '',
      });
    }
  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (schedule?.schedule_id) {
        await feedingScheduleService.update(schedule.schedule_id, formData);
      } else {
        await feedingScheduleService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Feeding schedule error:', err);
      setError(err.response?.data?.message || 'Failed to save feeding schedule');
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

      <div className="space-y-4">
        {/* Food Description */}
        <div className="space-y-2">
          <Label htmlFor="food_description">Food Description *</Label>
          <Input
            id="food_description"
            name="food_description"
            value={formData.food_description}
            onChange={handleChange}
            required
            placeholder="e.g., Raw beef 15kg with bone"
            maxLength={255}
          />
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            id="frequency"
            name="frequency"
            value={formData.frequency || ''}
            onChange={handleChange}
            placeholder="e.g., Daily, Twice daily, Weekly"
            maxLength={100}
          />
        </div>

        {/* Scheduled Time */}
        <div className="space-y-2">
          <Label htmlFor="scheduled_time">Scheduled Time</Label>
          <Input
            id="scheduled_time"
            name="scheduled_time"
            type="time"
            value={formData.scheduled_time || ''}
            onChange={handleChange}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            placeholder="Additional feeding instructions or requirements"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : schedule ? 'Update Schedule' : 'Add Schedule'}
        </Button>
      </div>
    </form>
  );
}
