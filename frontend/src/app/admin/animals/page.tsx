"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { animalService } from '@/services/animal.service';
import { zookeeperAssignmentService } from '@/services/zookeeperAssignment.service';
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
import { Plus, Search, Edit, Trash2, Leaf, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { AnimalForm } from '@/components/admin/AnimalForm';
import { AnimalDetailModal } from '@/components/admin/AnimalDetailModal';
import { ShowDeletedToggle } from '@/components/admin/ShowDeletedToggle';
import { RestoreConfirmationModal } from '@/components/admin/RestoreConfirmationModal';

export default function AnimalsPage() {
  const { isAuthenticated, user, loading: authLoading, hasRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [deleteActiveStatus, setDeleteActiveStatus] = useState<'transferred' | 'deceased'>('deceased');
  const [deletionNotes, setDeletionNotes] = useState('');
  const [deletionError, setDeletionError] = useState('');

  // New state for soft delete features
  const [showDeleted, setShowDeleted] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailAnimal, setDetailAnimal] = useState<Animal | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [animalToRestore, setAnimalToRestore] = useState<Animal | null>(null);

  // Keeper assignments state
  const [myAnimalIds, setMyAnimalIds] = useState<number[]>([]);

  const isManager = hasRole('manager');
  const isKeeper = hasRole('keeper');
  const isVet = hasRole('veterinarian');

  useEffect(() => {
    if (isAuthenticated) {
      loadAnimals();
      if (isKeeper && user?.employee_id) {
        loadKeeperAssignments();
      }
    }
  }, [isAuthenticated, showDeleted, isKeeper, user?.employee_id]);

  const hasOpenedModal = useRef(false);

  // Handle URL parameters to auto-open animal
  useEffect(() => {
    if (hasOpenedModal.current) return;

    const animalIdParam = searchParams?.get('animalId');
    const autoOpenParam = searchParams?.get('autoOpen');

    if (autoOpenParam === 'true') {
      if (animalIdParam && animals.length > 0) {
        const animalId = parseInt(animalIdParam);
        const animal = animals.find(a => a.animal_id === animalId);
        if (animal) {
          setDetailAnimal(animal);
          setIsDetailModalOpen(true);
          hasOpenedModal.current = true;
        }
      } else if (!animalIdParam) {
        handleAdd();
        hasOpenedModal.current = true;
      }
    }
  }, [searchParams, animals]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalService.getAll(showDeleted);
      setAnimals(data);
    } catch (error) {
      console.error('Failed to load animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadKeeperAssignments = async () => {
    if (!user?.employee_id) return;
    try {
      const assignments = await zookeeperAssignmentService.getByKeeperId(user.employee_id);
      setMyAnimalIds(assignments.map(a => a.animal_id));
    } catch (error) {
      console.error('Failed to load keeper assignments:', error);
    }
  };

  const handleAdd = () => {
    setSelectedAnimal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (animal: Animal, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };

  const handleRowClick = (animal: Animal) => {
    setDetailAnimal(animal);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (animal: Animal, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimalToDelete(animal);
    setDeleteActiveStatus('deceased'); // Reset to default
    setDeletionNotes(''); // Reset deletion notes
    setDeletionError(''); // Clear any previous error
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!animalToDelete?.animal_id) return;

    // Validate that deletion notes are provided
    if (!deletionNotes.trim()) {
      setDeletionError('Please provide a reason for deleting this animal.');
      return;
    }

    try {
      await animalService.delete(animalToDelete.animal_id, deleteActiveStatus, deletionNotes);
      await loadAnimals();
      setIsDeleteModalOpen(false);
      setAnimalToDelete(null);
      setDeleteActiveStatus('deceased');
      setDeletionNotes('');
      setDeletionError('');
    } catch (error) {
      console.error('Failed to delete animal:', error);
    }
  };

  const handleRestoreClick = (animal: Animal, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimalToRestore(animal);
    setIsRestoreModalOpen(true);
  };

  const handleRestore = async () => {
    if (!animalToRestore?.animal_id) return;

    try {
      // First restore the animal (set deleted_at = NULL), then update active_status
      // Must restore first because update's findById filters out deleted animals
      await animalService.restore(animalToRestore.animal_id);
      await animalService.update(animalToRestore.animal_id, { active_status: 'active' });
      await loadAnimals();
      setAnimalToRestore(null);
      setIsRestoreModalOpen(false);
    } catch (error) {
      console.error('Failed to restore animal:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
    await loadAnimals();
  };

  const filteredAnimals = animals
    .filter(animal => animal) // Add this line to filter out null or undefined animals
    .filter(animal => {
      const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHealth = healthFilter === 'all' || animal.health_status === healthFilter;
      return matchesSearch && matchesHealth;
    })
    .sort((a, b) => {
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

  const isDeleted = (animal: Animal) => animal.deleted_at !== null && animal.deleted_at !== undefined;

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

        {isManager && (
          <ShowDeletedToggle checked={showDeleted} onChange={setShowDeleted} />
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
              <TableRow
                key={animal.animal_id}
                onClick={() => handleRowClick(animal)}
                className={`cursor-pointer hover:bg-gray-50 ${
                  isDeleted(animal) ? 'opacity-60 bg-red-50' :
                  myAnimalIds.includes(animal.animal_id) ? 'bg-sea_green-50 border-l-4 border-sea_green-600' : ''
                }`}
              >
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
                    variant={
                      animal.active_status === 'active' ? 'success' :
                      animal.active_status === 'transferred' ? 'secondary' :
                      animal.active_status === 'deceased' ? 'danger' :
                      'default'
                    }
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
                    {!isDeleted(animal) ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEdit(animal, e)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(animal, e)}
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
                          onClick={(e) => handleRestoreClick(animal, e)}
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
        description="Please indicate the reason for deleting this animal."
      >
        <div className="space-y-4">
          {animalToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{animalToDelete.name}</span> ({animalToDelete.species})
              </p>
            </div>
          )}

          {/* Radio buttons for status selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">What happened to this animal?</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="animalStatus"
                  value="transferred"
                  checked={deleteActiveStatus === 'transferred'}
                  onChange={(e) => setDeleteActiveStatus(e.target.value as 'transferred' | 'deceased')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium text-gray-900">Transferred</p>
                  <p className="text-xs text-gray-600">Animal was transferred to another facility</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="animalStatus"
                  value="deceased"
                  checked={deleteActiveStatus === 'deceased'}
                  onChange={(e) => setDeleteActiveStatus(e.target.value as 'transferred' | 'deceased')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium text-gray-900">Deceased</p>
                  <p className="text-xs text-gray-600">Animal has passed away</p>
                </div>
              </label>
            </div>
          </div>

          {/* Deletion Notes */}
          <div className="space-y-2">
            <label htmlFor="deletionNotes" className="text-sm font-medium text-gray-700">
              Reason for deletion <span className="text-red-600">*</span>
            </label>
            <textarea
              id="deletionNotes"
              value={deletionNotes}
              onChange={(e) => {
                setDeletionNotes(e.target.value);
                if (deletionError) setDeletionError(''); // Clear error when user starts typing
              }}
              placeholder="Please provide details about why this animal is being removed from the system..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sea_green-500 focus:border-sea_green-500 ${
                deletionError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              rows={4}
              required
            />
            {deletionError && (
              <p className="text-sm text-red-600 font-medium">{deletionError}</p>
            )}
            {!deletionError && deletionNotes.trim() === '' && (
              <p className="text-xs text-gray-500">This field is required</p>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Animal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <AnimalDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        animal={detailAnimal}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setSelectedAnimal(detailAnimal);
          setIsModalOpen(true);
        }}
        canEdit={detailAnimal ? !isDeleted(detailAnimal) : false}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmationModal
        open={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        itemName={animalToRestore?.name || ''}
        itemType="Animal"
      />
    </div>
  );
}
