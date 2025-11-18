"use client";

import { useState, useEffect } from 'react';
import { assignmentService, CreateAssignmentData } from '@/services/assignment.service';
import { employeeService } from '@/services/employee.service';
import { animalService } from '@/services/animal.service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Employee, Animal } from '@/types';

interface AssignmentFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function AssignmentForm({ onSubmit, onCancel }: AssignmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateAssignmentData>({
    keeper_id: 0,
    animal_id: 0,
    shift: '',
  });

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      const [employeeData, animalData] = await Promise.all([
        employeeService.getAll(),
        animalService.getAll(),
      ]);

      // Filter to only keepers and veterinarians
      const keepersAndVets = employeeData.filter(
        (emp) => emp.job_role === 'keeper' || emp.job_role === 'veterinarian'
      );
      setEmployees(keepersAndVets);
      setAnimals(animalData);
    } catch (err) {
      console.error('Failed to load form data:', err);
      setError('Failed to load employees and animals');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'keeper_id' || name === 'animal_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.keeper_id || !formData.animal_id) {
      setError('Please select both a keeper/vet and an animal');
      return;
    }

    setLoading(true);

    try {
      await assignmentService.create({
        keeper_id: formData.keeper_id,
        animal_id: formData.animal_id,
        shift: formData.shift || undefined,
      });
      onSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="keeper_id">Keeper / Veterinarian *</Label>
        <Select
          id="keeper_id"
          name="keeper_id"
          value={formData.keeper_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a keeper or veterinarian...</option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.first_name} {employee.last_name} ({employee.job_role})
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="animal_id">Animal *</Label>
        <Select
          id="animal_id"
          name="animal_id"
          value={formData.animal_id}
          onChange={handleChange}
          required
        >
          <option value="">Select an animal...</option>
          {animals.map((animal) => (
            <option key={animal.animal_id} value={animal.animal_id}>
              {animal.name} ({animal.species})
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="shift">Shift (Optional)</Label>
        <Select
          id="shift"
          name="shift"
          value={formData.shift}
          onChange={handleChange}
        >
          <option value="">No specific shift</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Assignment'}
        </Button>
      </div>
    </form>
  );
}
