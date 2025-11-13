"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { employeeService } from '@/services/employee.service';
import { Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Users, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { EmployeeForm } from '@/components/admin/EmployeeForm';
import { EntityDetailModal } from '@/components/ui/EntityDetailModal';
import { ShowDeletedToggle } from '@/components/admin/ShowDeletedToggle';
import { RestoreConfirmationModal } from '@/components/admin/RestoreConfirmationModal';

export default function EmployeesPage() {
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [employeeToRestore, setEmployeeToRestore] = useState<Employee | null>(null);
  const isManager = hasRole('manager');

  useEffect(() => {

  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadEmployees();
    }
  }, [isAuthenticated]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll(showDeleted);
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEmployees();
    }
  }, [showDeleted]);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleRowClick = (employee: Employee) => {
    setDetailEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const handleRestoreClick = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmployeeToRestore(employee);
    setIsRestoreModalOpen(true);
  };

  const handleRestore = async () => {
    if (!employeeToRestore?.employee_id) return;

    try {
      await employeeService.restore(employeeToRestore.employee_id);
      await loadEmployees();
      setIsRestoreModalOpen(false);
      setEmployeeToRestore(null);
    } catch (error) {
      console.error('Failed to restore employee:', error);
    }
  };

  const handleDeleteClick = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const isDeleted = (employee: Employee) => employee.deleted_at !== null && employee.deleted_at !== undefined;

  const handleDelete = async () => {
    if (!employeeToDelete?.employee_id) return;

    try {
      await employeeService.delete(employeeToDelete.employee_id);
      await loadEmployees();
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    await loadEmployees();
  };

  const filteredEmployees = employees
    .filter(emp => emp) // Add this line to filter out null or undefined employees
    .filter(emp => {
      // Search filter
      const matchesSearch = emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.job_role.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'all' || emp.job_role === roleFilter;

      // Employment type filter
      const matchesEmploymentType = employmentTypeFilter === 'all' || emp.employment_type === employmentTypeFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesRole && matchesEmploymentType && matchesStatus;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'name') {
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      } else if (sortBy === 'hire_date') {
        const dateA = a.hire_date ? new Date(a.hire_date).getTime() : 0;
        const dateB = b.hire_date ? new Date(b.hire_date).getTime() : 0;
        return dateB - dateA; // Newest first
      } else if (sortBy === 'salary') {
        const salaryA = a.salary || 0;
        const salaryB = b.salary || 0;
        return salaryB - salaryA; // Highest first
      }
      return 0;
    });

  const getRoleBadgeColor = (role: string): "default" | "secondary" | "warning" => {
    if (role === 'manager') return 'warning';
    if (role === 'keeper' || role === 'veterinarian') return 'secondary';
    return 'default';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-dark_spring_green-600" />
            Employees Management
          </h1>
          <p className="text-gray-600 mt-1">Manage zoo staff and personnel</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isManager && (
          <ShowDeletedToggle
            checked={showDeleted}
            onChange={setShowDeleted}
          />
        )}

        <div className="w-auto">
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="keeper">Keeper</option>
            <option value="manager">Manager</option>
            <option value="veterinarian">Veterinarian</option>
            <option value="coordinator">Coordinator</option>
            <option value="maintenance">Maintenance</option>
            <option value="cashier">Cashier</option>
          </Select>
        </div>

        <div className="w-auto">
          <Select value={employmentTypeFilter} onChange={(e) => setEmploymentTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
          </Select>
        </div>

        <div className="w-auto">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <div className="w-auto">
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="hire_date">Sort by Hire Date</option>
            <option value="salary">Sort by Salary</option>
          </Select>
        </div>

        <Badge variant="outline" className="text-sm">
          {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Employment Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow
                key={employee.employee_id}
                onClick={() => handleRowClick(employee)}
                className={`cursor-pointer hover:bg-gray-50 ${isDeleted(employee) ? 'opacity-60 bg-red-50' : ''}`}
              >
                <TableCell className="font-medium">
                  {employee.first_name} {employee.last_name}
                </TableCell>
                <TableCell>{employee.email || 'N/A'}</TableCell>
                <TableCell>{employee.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeColor(employee.job_role)} className="capitalize">
                    {employee.job_role}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {employee.employment_type.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  {isDeleted(employee) ? (
                    <Badge variant="danger">Deleted</Badge>
                  ) : (
                    <Badge variant={employee.status === 'active' ? 'success' : 'outline'} className="capitalize">
                      {employee.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!isDeleted(employee) ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEdit(employee, e)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(employee, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      isManager && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleRestoreClick(employee, e)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No employees found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        description={selectedEmployee ? `Update information for ${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 'Add a new employee to the zoo'}
        size="lg"
      >
        <EmployeeForm employee={selectedEmployee} onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
      >
        <div className="space-y-4">
          {employeeToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{employeeToDelete.first_name} {employeeToDelete.last_name}</span> ({employeeToDelete.job_role})
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <EntityDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Employee Details"
        entity={detailEmployee}
        sections={[
          {
            title: 'Basic Information',
            fields: [
              { label: 'First Name', key: 'first_name' },
              { label: 'Last Name', key: 'last_name' },
              { label: 'Email', key: 'email' },
              { label: 'Phone', key: 'phone' },
              { label: 'SSN', key: 'ssn' },
              { label: 'Gender', key: 'gender', type: 'enum' as const },
              { label: 'Birthday', key: 'birthday', type: 'date' as const },
            ],
          },
          {
            title: 'Employment Details',
            fields: [
              { label: 'Job Role', key: 'job_role', type: 'enum' as const },
              { label: 'Employment Type', key: 'employment_type', type: 'enum' as const },
              { label: 'Salary', key: 'salary', type: 'currency' as const },
              { label: 'Status', key: 'status', type: 'enum' as const },
              { label: 'Hire Date', key: 'hire_date', type: 'date' as const },
            ],
          },
          {
            title: 'Address',
            fields: [
              { label: 'Street Address', key: 'address' },
              { label: 'City', key: 'city' },
              { label: 'State', key: 'state' },
              { label: 'Zip Code', key: 'zip_code' },
            ],
          },
        ]}
        onEdit={detailEmployee && !isDeleted(detailEmployee) ? () => {
          setIsDetailModalOpen(false);
          setSelectedEmployee(detailEmployee);
          setIsModalOpen(true);
        } : undefined}
        canEdit={detailEmployee ? !isDeleted(detailEmployee) : false}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmationModal
        open={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        itemName={employeeToRestore ? `${employeeToRestore.first_name} ${employeeToRestore.last_name}` : ''}
        itemType="employee"
      />
    </div>
  );
}
