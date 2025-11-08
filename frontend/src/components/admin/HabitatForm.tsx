"use client";

import { useState, useEffect } from 'react';
import { Habitat, CreateHabitatData } from '@/types';
import { habitatService } from '@/services/habitat.service';
import { attractionService } from '@/services/attractions.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Attraction } from '@/types';
import { formatDateForInput } from '@/lib/utils';

interface HabitatFormProps {
  habitat?: Habitat | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function HabitatForm({ habitat, onSuccess, onCancel }: HabitatFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  const [formData, setFormData] = useState<CreateHabitatData>({
    habitat_name: '',
    attraction_id: 1,
    size: '',
    environment_type: '',
    animal_capacity: 10,
    cleaning_schedule: '',
    last_maintenance: new Date().toISOString().split('T')[0],
    status: 'active',
  });

  useEffect(() => {
    loadAttractions();
  }, []);

  useEffect(() => {
    if (habitat) {
      setFormData({
        habitat_name: habitat.habitat_name,
        attraction_id: habitat.attraction_id,
        size: habitat.size,
        environment_type: habitat.environment_type,
        animal_capacity: habitat.animal_capacity,
        cleaning_schedule: habitat.cleaning_schedule,
        last_maintenance: formatDateForInput(habitat.last_maintenance) || new Date().toISOString().split('T')[0],
        status: habitat.status,
      });
    }
  }, [habitat]);

  const loadAttractions = async () => {
    try {
      const data = await attractionService.getAll();
      setAttractions(data);
    } catch (error) {
      console.error('Failed to load attractions:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'animal_capacity' || name === 'attraction_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Submitting habitat data:', formData);
    console.log('Attraction ID type:', typeof formData.attraction_id, formData.attraction_id);

    try {
      if (habitat?.habitat_id) {
        await habitatService.update(habitat.habitat_id, formData);
      } else {
        await habitatService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Habitat creation error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save habitat');
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
        {/* Habitat Name */}
        <div className="space-y-2">
          <Label htmlFor="habitat_name">Habitat Name *</Label>
          <Input
            id="habitat_name"
            name="habitat_name"
            value={formData.habitat_name}
            onChange={handleChange}
            required
            placeholder="e.g., African Savanna"
          />
        </div>

        {/* Environment Type */}
        <div className="space-y-2">
          <Label htmlFor="environment_type">Environment Type *</Label>
          <Input
            id="environment_type"
            name="environment_type"
            value={formData.environment_type}
            onChange={handleChange}
            required
            placeholder="e.g., Savanna, Rainforest, Desert"
          />
        </div>

        {/* Attraction */}
        <div className="space-y-2">
          <Label htmlFor="attraction_id">Attraction *</Label>
          <Select
            id="attraction_id"
            name="attraction_id"
            value={formData.attraction_id}
            onChange={handleChange}
            required
          >
            {attractions.length === 0 ? (
              <option value="">Loading attractions...</option>
            ) : (
              attractions.map((attraction) => (
                <option key={attraction.attraction_id} value={attraction.attraction_id}>
                  {attraction.name}
                </option>
              ))
            )}
          </Select>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label htmlFor="size">Size *</Label>
          <Input
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            placeholder="e.g., 2500 sq ft, 1 acre"
          />
        </div>

        {/* Animal Capacity */}
        <div className="space-y-2">
          <Label htmlFor="animal_capacity">Animal Capacity *</Label>
          <Input
            type="number"
            id="animal_capacity"
            name="animal_capacity"
            value={formData.animal_capacity}
            onChange={handleChange}
            required
            min="1"
            placeholder="Maximum number of animals"
          />
        </div>

        {/* Cleaning Schedule */}
        <div className="space-y-2">
          <Label htmlFor="cleaning_schedule">Cleaning Schedule *</Label>
          <Input
            id="cleaning_schedule"
            name="cleaning_schedule"
            value={formData.cleaning_schedule}
            onChange={handleChange}
            required
            placeholder="e.g., Daily at 6 AM"
          />
        </div>

        {/* Last Maintenance */}
        <div className="space-y-2">
          <Label htmlFor="last_maintenance">Last Maintenance Date *</Label>
          <Input
            type="date"
            id="last_maintenance"
            name="last_maintenance"
            value={formData.last_maintenance}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="renovation">Renovation</option>
            <option value="closed">Closed</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-dark_spring_green-600 hover:bg-dark_spring_green-700"
        >
          {loading ? 'Saving...' : habitat ? 'Update Habitat' : 'Create Habitat'}
        </Button>
      </div>
    </form>
  );
}
