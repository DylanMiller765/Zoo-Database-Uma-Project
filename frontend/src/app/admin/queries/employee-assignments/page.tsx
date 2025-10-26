"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { queryService } from '@/services/query.service';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Leaf } from 'lucide-react';

export default function EmployeeAssignmentsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await queryService.getEmployeeAssignments();
      setData(result);
    } catch (error) {
      console.error('Failed to load employee assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Group by employee
  const employeeGroups = data.reduce((groups: any, item) => {
    const employeeId = item.employee_id;
    if (!groups[employeeId]) {
      groups[employeeId] = {
        employee_id: item.employee_id,
        first_name: item.first_name,
        last_name: item.last_name,
        job_role: item.job_role,
        email: item.email,
        animals: [],
      };
    }
    groups[employeeId].animals.push({
      animal_id: item.animal_id,
      animal_name: item.animal_name,
      species: item.species,
      shift: item.shift,
    });
    return groups;
  }, {});

  const employees = Object.values(employeeGroups);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-8 w-8 text-dark_spring_green-600" />
          Employee Assignments
        </h1>
        <p className="text-gray-600 mt-1">View which keepers are assigned to which animals</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned Animals</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee: any) => (
              <TableRow key={employee.employee_id}>
                <TableCell className="font-medium">
                  {employee.first_name} {employee.last_name}
                </TableCell>
                <TableCell className="text-sm text-gray-600">{employee.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {employee.job_role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {employee.animals.map((animal: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Leaf className="h-3 w-3 text-sea_green-600" />
                        <span className="text-sm">
                          {animal.animal_name} ({animal.species})
                        </span>
                        {animal.shift && (
                          <Badge variant="outline" className="text-xs">
                            {animal.shift}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{employee.animals.length}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {employees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No employee assignments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
