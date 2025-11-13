"use client";

import { useState, useEffect } from 'react';
import { FeedingLogWithKeeper, CreateFeedingLogData, FeedingSchedule } from '@/types';
import { feedingLogService } from '@/services/feedingLog.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

interface FeedingLogFormProps {
  animalId: number;
  log?: FeedingLogWithKeeper | null;
  schedules?: FeedingSchedule[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function FeedingLogForm({ animalId, log, schedules = [], onSuccess, onCancel }: FeedingLogFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateFeedingLogData>({
    animal_id: animalId,
    keeper_id: user?.employee_id || undefined,
    feeding_time: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
    food_given: '',
    quantity_given: '',
    notes: '',
  });

  useEffect(() => {
    if (log) {
      setFormData({
        animal_id: log.animal_id,
        keeper_id: log.keeper_id || undefined,
        feeding_time: log.feeding_time ? new Date(log.feeding_time).toISOString().slice(0, 16) : '',
        food_given: log.food_given,
        quantity_given: log.quantity_given || '',
        notes: log.notes || '',
      });
    }
  }, [log]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // Convert datetime-local format to MySQL datetime format
      // Use current time as fallback if feeding_time is not set
      const feedingTime = formData.feeding_time || new Date().toISOString().slice(0, 16);
      const submitData = {
        ...formData,
        feeding_time: new Date(feedingTime).toISOString().slice(0, 19).replace('T', ' '),
      };

      if (log?.log_id) {
        await feedingLogService.update(log.log_id, submitData);
      } else {
        await feedingLogService.create(submitData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Feeding log error:', err);
      setError(err.response?.data?.message || 'Failed to save feeding log');
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
        {/* Feeding Time */}
        <div className="space-y-2">
          <Label htmlFor="feeding_time">Feeding Time *</Label>
          <Input
            id="feeding_time"
            name="feeding_time"
            type="datetime-local"
            value={formData.feeding_time}
            onChange={handleChange}
            required
          />
        </div>

        {/* Food Given */}
        <div className="space-y-2">
          <Label htmlFor="food_given">Food Given *</Label>
          {schedules.length > 0 ? (
            <Select
              id="food_given"
              name="food_given"
              value={formData.food_given}
              onChange={handleChange}
              required
            >
              <option value="">Select from schedule or type below</option>
              {schedules.map((schedule) => (
                <option key={schedule.schedule_id} value={schedule.food_description}>
                  {schedule.food_description}
                </option>
              ))}
            </Select>
          ) : null}
          <Input
            id="food_given_custom"
            name="food_given"
            value={formData.food_given}
            onChange={handleChange}
            required
            placeholder="e.g., Raw beef 15kg"
            maxLength={255}
            className={schedules.length > 0 ? "mt-2" : ""}
          />
          {schedules.length > 0 && (
            <p className="text-xs text-gray-500">Select from dropdown or type custom food</p>
          )}
        </div>

        {/* Quantity Given */}
        <div className="space-y-2">
          <Label htmlFor="quantity_given">Quantity Given</Label>
          <Input
            id="quantity_given"
            name="quantity_given"
            value={formData.quantity_given}
            onChange={handleChange}
            placeholder="e.g., 15kg, 2.5 lbs"
            maxLength={50}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Observations about appetite, behavior, etc."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : log ? 'Update Log' : 'Log Feeding'}
        </Button>
      </div>
    </form>
  );
}
