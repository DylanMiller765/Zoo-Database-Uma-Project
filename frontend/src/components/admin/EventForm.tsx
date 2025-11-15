"use client";

import { useState, useEffect } from 'react';
import { Event, CreateEventData } from '@/types';
import { eventService } from '@/services/event.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDateForInput } from '@/lib/utils';

interface EventFormProps {
  event?: Event | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateEventData>({
    event_name: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_capacity: undefined,
    ticket_price: undefined,
    created_by: undefined,
    status: 'scheduled',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        event_name: event.event_name,
        description: event.description || '',
        event_date: formatDateForInput(event.event_date),
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location || '',
        max_capacity: event.max_capacity,
        ticket_price: event.ticket_price,
        created_by: event.created_by,
        status: event.status || 'scheduled',
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'max_capacity' || name === 'ticket_price') ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (event?.event_id) {
        await eventService.update(event.event_id, formData);
      } else {
        await eventService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
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
          <Label htmlFor="event_name">Event Name *</Label>
          <Input
            id="event_name"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            required
            placeholder="e.g., Dolphin Performance"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Event details..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date *</Label>
          <Input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Main Amphitheater"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time *</Label>
          <Input
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time *</Label>
          <Input
            type="time"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_capacity">Max Capacity</Label>
          <Input
            type="number"
            id="max_capacity"
            name="max_capacity"
            value={formData.max_capacity || ''}
            onChange={handleChange}
            placeholder="Leave blank for unlimited"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket_price">Ticket Price ($)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            id="ticket_price"
            name="ticket_price"
            value={formData.ticket_price || ''}
            onChange={handleChange}
            placeholder="e.g., 25.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" disabled={loading}>
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
