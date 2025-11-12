"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { animalService } from '@/services/animal.service';
import { Animal } from '@/types';
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
import { Plus, Search, Edit, Trash2, Leaf } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { AnimalForm } from '@/components/admin/AnimalForm';
import { Label } from '@/components/ui/label'; 

export default function AnimalsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const { user } = useAuth();
  const canViewDeleted = user?.job_role === 'manager' || user?.job_role === 'vet';
  

  useEffect(() => {
    if (isAuthenticated) {
      loadAnimals(showDeleted);
    }
  }, [isAuthenticated, showDeleted]);

  const loadAnimals = async (includeDeleted: boolean) => {
    try {
      setLoading(true);
      const data = await animalService.getAll(includeDeleted);
      setAnimals(data);
    } catch (error) {
      console.error('Failed to load animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedAnimal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (animal: Animal) => {
    setAnimalToDelete(animal);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!animalToDelete?.animal_id) return;

    try {
      await animalService.delete(animalToDelete.animal_id);
      await loadAnimals(showDeleted);
      setIsDeleteModalOpen(false);
      setAnimalToDelete(null);
    } catch (error) {
      console.error('Failed to delete animal:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
    await loadAnimals(showDeleted);
  };

  const filteredAnimals = animals
    .filter(animal => {
      // Search filter
      const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase());

      // Health status filter
      const matchesHealth = healthFilter === 'all' || animal.health_status === healthFilter;

      return matchesSearch && matchesHealth;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'species') {
        return a.species.localeCompare(b.species);
      }
      return 0;
    });

  const getHealthStatusBadge = (status?: string) => {
    const variants: Record<string, "success" | "secondary" | "warning" | "danger" | "default"> = {
      excellent: 'success',
      good: 'secondary',
      fair: 'warning',
      poor: 'danger',
      critical: 'danger',
    };
    return variants[status || 'good'] || 'default';
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
            <Leaf className="h-8 w-8 text-sea_green-600" />
            Animals Management
          </h1>
          <p className="text-gray-600 mt-1">Manage zoo animals and their information</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Animal
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-auto">
          <Select value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)}>
            <option value="all">All Health Status</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="critical">Critical</option>
          </Select>
        </div>

        <div className="w-auto">
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="species">Sort by Species</option>
          </Select>
        </div>

        {/* --- ADDED: "Show Deleted" Checkbox for Managers/Vets --- */}
        {canViewDeleted && (
          <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-300 bg-white">
            <input
              type="checkbox"
              id="showDeleted"
              className="h-4 w-4 rounded border-gray-300 text-dark_spring_green-600 focus:ring-dark_spring_green-500"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            <Label htmlFor="showDeleted" className="text-sm font-medium text-gray-700">
              Show Deleted
            </Label>
          </div>
        )}

        <Badge variant="outline" className="text-sm">
          {filteredAnimals.length} animal{filteredAnimals.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Endangerment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimals.map((animal) => (
              <TableRow key={animal.animal_id}>
                <TableCell className="font-medium">{animal.name}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{animal.species}</div>
                    {animal.scientific_name && (
                      <div className="text-xs text-gray-500 italic">{animal.scientific_name}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{animal.gender || 'Unknown'}</TableCell>
                <TableCell>
                  <Badge variant={getHealthStatusBadge(animal.health_status)} className="capitalize">
                    {animal.health_status || 'Good'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={animal.active_status === 'active' ? 'success' : 'outline'}
                    className="capitalize"
                  >
                    {animal.active_status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs capitalize">
                  {animal.endangerment_status?.replace('_', ' ') || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(animal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(animal)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAnimals.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No animals found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAnimal ? 'Edit Animal' : 'Add New Animal'}
        description={selectedAnimal ? `Update information for ${selectedAnimal.name}` : 'Add a new animal to the zoo'}
        size="xl"
      >
        <AnimalForm animal={selectedAnimal} onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Animal"
        description="Are you sure you want to delete this animal? This action cannot be undone."
      >
        <div className="space-y-4">
          {animalToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{animalToDelete.name}</span> ({animalToDelete.species})
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
    </div>
  );
}
