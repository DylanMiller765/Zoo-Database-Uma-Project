"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { assignmentService, ZookeeperAssignmentWithDetails } from '@/services/assignment.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Trash2, UserCog } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { AssignmentForm } from '@/components/admin/AssignmentForm';

export default function AssignmentsPage() {
  const { isAuthenticated, hasRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<ZookeeperAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<ZookeeperAssignmentWithDetails | null>(null);

  const isManager = hasRole('manager');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isManager) {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, isManager, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && isManager) {
      loadAssignments();
    }
  }, [isAuthenticated, isManager]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    await loadAssignments();
    handleCloseModal();
  };

  const handleDeleteClick = (assignment: ZookeeperAssignmentWithDetails) => {
    setAssignmentToDelete(assignment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      await assignmentService.delete(assignmentToDelete.assignment_id);
      await loadAssignments();
      setIsDeleteModalOpen(false);
      setAssignmentToDelete(null);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      alert('Failed to delete assignment. Please try again.');
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.keeper_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.animal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.animal_species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHealthBadgeColor = (status: string | null) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'default';
      case 'good':
        return 'default';
      case 'fair':
        return 'secondary';
      case 'poor':
        return 'danger';
      case 'critical':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isManager) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCog className="h-8 w-8" />
            Animal Assignments
          </h1>
          <p className="text-gray-600 mt-1">Manage keeper and veterinarian assignments to animals</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by keeper, animal name, or species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keeper/Veterinarian</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead>Last Fed</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No assignments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map((assignment) => (
                <TableRow key={assignment.assignment_id}>
                  <TableCell className="font-medium">{assignment.keeper_name}</TableCell>
                  <TableCell>{assignment.animal_name}</TableCell>
                  <TableCell className="text-gray-600">{assignment.animal_species}</TableCell>
                  <TableCell>
                    {assignment.animal_health_status && (
                      <Badge variant={getHealthBadgeColor(assignment.animal_health_status)}>
                        {assignment.animal_health_status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {assignment.last_fed_time
                      ? new Date(assignment.last_fed_time).toLocaleString()
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-gray-600">{assignment.shift || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(assignment)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Assignment Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Add Assignment"
      >
        <AssignmentForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to remove this assignment?
          </p>
          {assignmentToDelete && (
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-medium">{assignmentToDelete.keeper_name}</p>
              <p className="text-sm text-gray-600">
                assigned to {assignmentToDelete.animal_name} ({assignmentToDelete.animal_species})
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
