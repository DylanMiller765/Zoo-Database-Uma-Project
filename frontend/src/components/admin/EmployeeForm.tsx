"use client";

import { useState, useEffect } from 'react';
import { Employee, CreateEmployeeData } from '@/types';
import { employeeService } from '@/services/employee.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { formatDateForInput } from '@/lib/utils';

interface EmployeeFormProps {
  employee?: Employee | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [ssnError, setSsnError] = useState('');

  const [formData, setFormData] = useState<CreateEmployeeData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    ssn: '',
    job_role: 'other',
    employment_type: 'full_time',
    salary: undefined,
    status: 'active',
    hire_date: new Date().toISOString().split('T')[0],
    address: '',
    city: '',
    state: '',
    zip_code: '',
    gender: undefined,
    birthday: '',
    password: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email || '',
        phone: employee.phone || '',
        ssn: employee.ssn,
        job_role: employee.job_role,
        employment_type: employee.employment_type,
        salary: employee.salary,
        status: employee.status || 'active',
        hire_date: formatDateForInput(employee.hire_date),
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        zip_code: employee.zip_code || '',
        gender: employee.gender,
        birthday: formatDateForInput(employee.birthday),
        password: '', // Don't populate password when editing
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let processedValue: any;

    // Handle phone number - only allow digits, max 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        processedValue = digitsOnly;
        if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
          setPhoneError('Phone number must be exactly 10 digits');
        } else {
          setPhoneError('');
        }
      } else {
        return; // Don't update if exceeds 10 digits
      }
    } 
    // Handle SSN - only allow digits, max 9
    else if (name === 'ssn') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 9) {
        processedValue = digitsOnly;
        if (digitsOnly.length > 0 && digitsOnly.length !== 9) {
          setSsnError('SSN must be exactly 9 digits');
        } else {
          setSsnError('');
        }
      } else {
        return; // Don't update if exceeds 9 digits
      }
    }
    // Handle numeric inputs
    else if (type === 'number') {
      processedValue = value ? Number(value) : undefined;
    } else {
      processedValue = value || '';
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate phone number if provided
    if (formData.phone && formData.phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      setLoading(false);
      return;
    }

    // Validate SSN - must be exactly 9 digits
    if (!formData.ssn || formData.ssn.length !== 9) {
      setSsnError('SSN must be exactly 9 digits');
      setLoading(false);
      return;
    }

    try {
      // Clean up form data: convert empty strings to undefined for optional fields
      const cleanedData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        ssn: formData.ssn.trim(),
        job_role: formData.job_role,
        employment_type: formData.employment_type,
        status: formData.status,
        email: formData.email?.trim() || undefined,
        password: formData.password, // Include password
        phone: formData.phone?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        state: formData.state?.trim() || undefined,
        zip_code: formData.zip_code?.trim() || undefined,
        birthday: formData.birthday || undefined,
        hire_date: formData.hire_date || undefined,
        gender: formData.gender || undefined,
        // Ensure salary is a number for full-time or undefined for part-time
        salary: formData.employment_type === 'part_time'
          ? undefined
          : (typeof formData.salary === 'number' ? formData.salary : (formData.salary ? parseFloat(String(formData.salary)) : undefined)),
      };

      console.log('Submitting employee data:', cleanedData);

      if (employee?.employee_id) {
        await employeeService.update(employee.employee_id, cleanedData);
      } else {
        await employeeService.create(cleanedData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error submitting employee:', err);
      console.error('Response data:', err.response?.data);

      // Extract error message safely - only use strings
      let errorMsg = 'Failed to save employee';
      if (err.response?.data) {
        const responseData = err.response.data;
        if (typeof responseData.message === 'string') {
          errorMsg = responseData.message;
        } else if (typeof responseData.error === 'string') {
          errorMsg = responseData.error;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
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
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!employee}
            minLength={6}
            placeholder={employee ? "Leave blank to keep current password" : "Minimum 6 characters"}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="1234567890"
            maxLength={10}
            className={phoneError || (formData.phone && formData.phone.length !== 10) ? 'border-red-500' : ''}
          />
          {phoneError && (
            <p className="text-sm text-red-600">{phoneError}</p>
          )}
          {formData.phone && !phoneError && (
            <p className="text-xs text-gray-500">10 digits (optional)</p>
          )}
        </div>

        {/* SSN */}
        <div className="space-y-2">
          <Label htmlFor="ssn">SSN *</Label>
          <Input
            id="ssn"
            name="ssn"
            value={formData.ssn}
            onChange={handleChange}
            required
            placeholder="123456789"
            maxLength={9}
            className={ssnError || (formData.ssn && formData.ssn.length !== 9) ? 'border-red-500' : ''}
          />
          {ssnError && (
            <p className="text-sm text-red-600">{ssnError}</p>
          )}
          {formData.ssn && !ssnError && (
            <p className="text-xs text-gray-500">9 digits</p>
          )}
        </div>

        {/* Job Role */}
        <div className="space-y-2">
          <Label htmlFor="job_role">Job Role *</Label>
          <Select id="job_role" name="job_role" value={formData.job_role} onChange={handleChange} required>
            <option value="keeper">Keeper</option>
            <option value="manager">Manager</option>
            <option value="coordinator">Coordinator</option>
            <option value="cashier">Cashier</option>
            <option value="guide">Guide</option>
            <option value="veterinarian">Veterinarian</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label htmlFor="employment_type">Employment Type *</Label>
          <Select id="employment_type" name="employment_type" value={formData.employment_type} onChange={handleChange} required>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
          </Select>
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <Label htmlFor="salary">Salary {formData.employment_type === 'full_time' && '*'}</Label>
          <Input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary || ''}
            onChange={handleChange}
            placeholder="50000.00"
            step="0.01"
            min="0"
            max="999999.99"
            required={formData.employment_type === 'full_time'}
            disabled={formData.employment_type === 'part_time'}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        {/* Hire Date */}
        <div className="space-y-2">
          <Label htmlFor="hire_date">Hire Date</Label>
          <Input
            type="date"
            id="hire_date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select id="gender" name="gender" value={formData.gender || ''} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </Select>
        </div>

        {/* Birthday */}
        <div className="space-y-2">
          <Label htmlFor="birthday">Birthday</Label>
          <Input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        {/* Zip Code */}
        <div className="space-y-2">
          <Label htmlFor="zip_code">Zip Code</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="12345"
            pattern="^\d{5}(-\d{4})?$"
            title="5-digit zip code (e.g., 12345 or 12345-6789)"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
}
