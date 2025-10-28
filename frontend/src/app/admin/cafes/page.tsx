"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cafeService } from '@/services/cafe.service';
import { Cafe } from '@/types';
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
import { Plus, Search, Edit, Trash2, Coffee } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { CafeForm } from '@/components/admin/CafeForm';

export default function CafesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cafeToDelete, setCafeToDelete] = useState<Cafe | null>(null);



  useEffect(() => {
    if (isAuthenticated) {
      loadCafes();
    }
  }, [isAuthenticated]);

  const loadCafes = async () => {
    try {
      setLoading(true);
      const data = await cafeService.getAll();
      setCafes(data);
    } catch (error) {
      console.error('Failed to load cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCafe(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cafe: Cafe) => {
    setCafeToDelete(cafe);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!cafeToDelete?.cafe_id) return;

    try {
      await cafeService.delete(cafeToDelete.cafe_id);
      await loadCafes();
      setIsDeleteModalOpen(false);
      setCafeToDelete(null);
    } catch (error) {
      console.error('Failed to delete cafe:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedCafe(null);
    await loadCafes();
  };

  const filteredCafes = cafes.filter(cafe =>
    cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cafe.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Coffee className="h-8 w-8 text-amber-600" />
            Cafes Management
          </h1>
          <p className="text-gray-600 mt-1">Manage zoo cafes and food service locations</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Cafe
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredCafes.length} cafe{filteredCafes.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Manager ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCafes.map((cafe) => (
              <TableRow key={cafe.cafe_id}>
                <TableCell className="font-medium">{cafe.name}</TableCell>
                <TableCell>{cafe.location || 'N/A'}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {cafe.opening_time} - {cafe.closing_time}
                </TableCell>
                <TableCell>{cafe.manager_id || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(cafe)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(cafe)}
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

        {filteredCafes.length === 0 && (
          <div className="text-center py-12">
            <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No cafes found</p>
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCafe ? 'Edit Cafe' : 'Add New Cafe'}
        description={selectedCafe ? `Update information for ${selectedCafe.name}` : 'Add a new cafe to the zoo'}
        size="xl"
      >
        <CafeForm cafe={selectedCafe} onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Cafe"
        description="Are you sure you want to delete this cafe? This action cannot be undone."
      >
        <div className="space-y-4">
          {cafeToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{cafeToDelete.name}</span> at {cafeToDelete.location || 'Unknown location'}
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
