"use client";

import { useState, useEffect } from 'react';
import { Animal, CreateAnimalData } from '@/types';
import { animalService } from '@/services/animal.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDateForInput } from '@/lib/utils';

interface AnimalFormProps {
  animal?: Animal | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AnimalForm({ animal, onSuccess, onCancel }: AnimalFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreateAnimalData>({
    name: '',
    species: '',
    scientific_name: '',
    date_of_birth: '',
    arrival_date: new Date().toISOString().split('T')[0],
    gender: 'unknown',
    place_of_origin: '',
    habitat_id: undefined,
    medical_notes: '',
    health_status: 'good',
    active_status: 'active',
    endangerment_status: 'least_concern',
    weight: undefined,
  });

  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.name,
        species: animal.species,
        scientific_name: animal.scientific_name || '',
        date_of_birth: formatDateForInput(animal.date_of_birth),
        arrival_date: formatDateForInput(animal.arrival_date),
        gender: animal.gender || 'unknown',
        place_of_origin: animal.place_of_origin || '',
        habitat_id: animal.habitat_id,
        medical_notes: animal.medical_notes || '',
        health_status: animal.health_status || 'good',
        active_status: animal.active_status || 'active',
        endangerment_status: animal.endangerment_status || 'least_concern',
        weight: animal.weight,
      });
    }
  }, [animal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'habitat_id' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (animal?.animal_id) {
        await animalService.update(animal.animal_id, formData);
      } else {
        await animalService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save animal');
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
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Animal name"
          />
        </div>

        {/* Species */}
        <div className="space-y-2">
          <Label htmlFor="species">Species *</Label>
          <Input
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
            placeholder="e.g., Bengal Tiger"
          />
        </div>

        {/* Scientific Name */}
        <div className="space-y-2">
          <Label htmlFor="scientific_name">Scientific Name</Label>
          <Input
            id="scientific_name"
            name="scientific_name"
            value={formData.scientific_name}
            onChange={handleChange}
            placeholder="e.g., Panthera tigris tigris"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </Select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        {/* Arrival Date */}
        <div className="space-y-2">
          <Label htmlFor="arrival_date">Arrival Date *</Label>
          <Input
            type="date"
            id="arrival_date"
            name="arrival_date"
            value={formData.arrival_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Place of Origin */}
        <div className="space-y-2">
          <Label htmlFor="place_of_origin">Place of Origin</Label>
          <Input
            id="place_of_origin"
            name="place_of_origin"
            value={formData.place_of_origin}
            onChange={handleChange}
            placeholder="e.g., India"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight || ''}
            onChange={handleChange}
            placeholder="0"
            step="0.1"
          />
        </div>

        {/* Health Status */}
        <div className="space-y-2">
          <Label htmlFor="health_status">Health Status</Label>
          <Select id="health_status" name="health_status" value={formData.health_status} onChange={handleChange}>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="critical">Critical</option>
          </Select>
        </div>

        {/* Active Status */}
        <div className="space-y-2">
          <Label htmlFor="active_status">Status</Label>
          <Select id="active_status" name="active_status" value={formData.active_status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="transferred">Transferred</option>
            <option value="deceased">Deceased</option>
          </Select>
        </div>

        {/* Endangerment Status */}
        <div className="space-y-2">
          <Label htmlFor="endangerment_status">Endangerment Status</Label>
          <Select id="endangerment_status" name="endangerment_status" value={formData.endangerment_status} onChange={handleChange}>
            <option value="least_concern">Least Concern</option>
            <option value="near_threatened">Near Threatened</option>
            <option value="vulnerable">Vulnerable</option>
            <option value="endangered">Endangered</option>
            <option value="critically_endangered">Critically Endangered</option>
            <option value="extinct_in_the_wild">Extinct in the Wild</option>
            <option value="extinct">Extinct</option>
          </Select>
        </div>

        {/* Habitat ID */}
        <div className="space-y-2">
          <Label htmlFor="habitat_id">Habitat ID</Label>
          <Input
            type="number"
            id="habitat_id"
            name="habitat_id"
            value={formData.habitat_id || ''}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Medical Notes */}
      <div className="space-y-2">
        <Label htmlFor="medical_notes">Medical Notes</Label>
        <Textarea
          id="medical_notes"
          name="medical_notes"
          value={formData.medical_notes}
          onChange={handleChange}
          placeholder="Any medical information or special care instructions..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : animal ? 'Update Animal' : 'Add Animal'}
        </Button>
      </div>
    </form>
  );
}
