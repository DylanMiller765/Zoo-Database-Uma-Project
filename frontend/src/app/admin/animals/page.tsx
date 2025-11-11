"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { animalService } from '@/services/animal.service';
import { Animal } from '@/types';
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
import { Plus, Search, Edit, Trash2, Leaf, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { AnimalForm } from '@/components/admin/AnimalForm';

function fmt(val?: string | number, fallback = 'N/A') {
  if (val === null || val === undefined || val === '') return fallback;
  return String(val);
}

function titleCaseUnderscore(s?: string) {
  if (!s) return 'N/A';
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(d?: string) {
  if (!d) return 'N/A';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d; // show raw if unparseable
  return dt.toLocaleDateString();
}

export default function AnimalsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);

  // NEW: read-only details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsAnimal, setDetailsAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnimals();
    }
  }, [isAuthenticated]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalService.getAll();
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
      await loadAnimals();
      setIsDeleteModalOpen(false);
      setAnimalToDelete(null);
    } catch (error) {
      console.error('Failed to delete animal:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
    await loadAnimals();
  };

  // NEW: open details by fetching fresh data
  const handleView = async (animalId: number) => {
    try {
      setDetailsLoading(true);
      setIsDetailsOpen(true);
      const full = await animalService.getById(animalId);
      setDetailsAnimal(full);
    } catch (err) {
      console.error('Failed to load animal details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
                <TableCell className="font-medium">
                  <button
                    onClick={() => animal.animal_id && handleView(animal.animal_id)}
                    className="text-dark_spring_green-700 hover:underline"
                    title="View details"
                  >
                    {animal.name}
                  </button>
                </TableCell>
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
                      onClick={() => animal.animal_id && handleView(animal.animal_id)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(animal)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(animal)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
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

      {/* NEW: Details Modal */}
      <Modal
        open={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setDetailsAnimal(null); }}
        title={detailsAnimal ? `${detailsAnimal.name} — Details` : 'Animal Details'}
        description="Read-only profile"
        size="lg"
      >
        {detailsLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dark_spring_green-600"></div>
          </div>
        ) : detailsAnimal ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Species</p>
              <p className="font-medium">{fmt(detailsAnimal.species)}</p>
              {detailsAnimal.scientific_name && (
                <p className="text-xs italic text-gray-500">{detailsAnimal.scientific_name}</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium capitalize">{fmt(detailsAnimal.gender, 'Unknown')}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">DOB</p>
              <p className="font-medium">{formatDate(detailsAnimal.date_of_birth)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Arrival Date</p>
              <p className="font-medium">{formatDate(detailsAnimal.arrival_date)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Place of Origin</p>
              <p className="font-medium">{fmt(detailsAnimal.place_of_origin)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">{fmt(detailsAnimal.weight)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Health Status</p>
              <div>
                <Badge variant={getHealthStatusBadge(detailsAnimal.health_status)} className="capitalize">
                  {fmt(detailsAnimal.health_status, 'good')}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Activity</p>
              <Badge variant={detailsAnimal.active_status === 'active' ? 'success' : 'outline'} className="capitalize">
                {fmt(detailsAnimal.active_status, 'active')}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Endangerment</p>
              <p className="font-medium">{titleCaseUnderscore(detailsAnimal.endangerment_status)}</p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-gray-500">Medical Notes</p>
              <p className="font-medium whitespace-pre-wrap">{fmt(detailsAnimal.medical_notes)}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No details found.</p>
        )}
      </Modal>
    </div>
  );
}
