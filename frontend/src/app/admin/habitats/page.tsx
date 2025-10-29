"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { habitatService } from '@/services/habitat.service';
import { Habitat } from '@/types';
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
import { Plus, Search, Edit, Trash2, Home } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { HabitatForm } from '@/components/admin/HabitatForm';

export default function HabitatsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitatToDelete, setHabitatToDelete] = useState<Habitat | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadHabitats();
    }
  }, [isAuthenticated]);

  const loadHabitats = async () => {
    try {
      setLoading(true);
      const data = await habitatService.getAll();
      setHabitats(data);
    } catch (error) {
      console.error('Failed to load habitats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedHabitat(null);
    setIsModalOpen(true);
  };

  const handleEdit = (habitat: Habitat) => {
    setSelectedHabitat(habitat);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (habitat: Habitat) => {
    setHabitatToDelete(habitat);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!habitatToDelete?.habitat_id) return;

    try {
      await habitatService.delete(habitatToDelete.habitat_id);
      await loadHabitats();
      setIsDeleteModalOpen(false);
      setHabitatToDelete(null);
    } catch (error) {
      console.error('Failed to delete habitat:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedHabitat(null);
    await loadHabitats();
  };

  const filteredHabitats = habitats.filter(habitat =>
    habitat.habitat_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    habitat.environment_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "secondary" | "warning" | "danger" | "default"> = {
      active: 'success',
      maintenance: 'warning',
      renovation: 'warning',
      closed: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark_spring_green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading habitats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="h-8 w-8 text-dark_spring_green-600" />
            Habitat Management
          </h1>
          <p className="text-gray-600 mt-1">Manage zoo habitats and environments</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-dark_spring_green-600 hover:bg-dark_spring_green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Habitat
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search habitats by name or environment type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habitat Name</TableHead>
              <TableHead>Environment Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Maintenance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHabitats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No habitats found
                </TableCell>
              </TableRow>
            ) : (
              filteredHabitats.map((habitat) => (
                <TableRow key={habitat.habitat_id}>
                  <TableCell className="font-medium">{habitat.habitat_name}</TableCell>
                  <TableCell>{habitat.environment_type}</TableCell>
                  <TableCell>{habitat.size}</TableCell>
                  <TableCell>{habitat.animal_capacity} animals</TableCell>
                  <TableCell>{getStatusBadge(habitat.status)}</TableCell>
                  <TableCell>
                    {new Date(habitat.last_maintenance).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(habitat)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(habitat)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedHabitat ? 'Edit Habitat' : 'Add New Habitat'}
      >
        <HabitatForm
          habitat={selectedHabitat}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the habitat{' '}
            <span className="font-semibold">{habitatToDelete?.habitat_name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Habitat
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
