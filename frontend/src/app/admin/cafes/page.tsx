"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cafeService } from '@/services/cafe.service';
import { cafeItemService } from '@/services/cafeItem.service';
import { Cafe, CafeItem } from '@/types';
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
import { Plus, Search, Edit, Trash2, Coffee, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { CafeItemForm } from '@/components/admin/CafeItemForm';
import { CafeItemDetailModal } from '@/components/admin/CafeItemDetailModal';
import { ShowDeletedToggle } from '@/components/admin/ShowDeletedToggle';
import { RestoreConfirmationModal } from '@/components/admin/RestoreConfirmationModal';

export default function CafesPage() {
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<CafeItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selectedCafeId, setSelectedCafeId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CafeItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CafeItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<CafeItem | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState<CafeItem | null>(null);

  const isManager = hasRole('manager');
  const isCashier = hasRole('cashier');

  useEffect(() => {
    if (isAuthenticated) {
      loadCafes();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (cafes.length > 0 && selectedCafeId === 0) {
      setSelectedCafeId(cafes[0].cafe_id);
    }
  }, [cafes, selectedCafeId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated, showDeleted]);

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

  const loadItems = async () => {
    try {
      setItemsLoading(true);
      const data = await cafeItemService.getAll(showDeleted);
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to load café items:', error);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: CafeItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleRowClick = (item: CafeItem) => {
    setDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (item: CafeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete?.item_id) return;

    try {
      await cafeItemService.delete(itemToDelete.item_id);
      await loadItems();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete café item:', error);
    }
  };

  const handleRestoreClick = (item: CafeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToRestore(item);
    setIsRestoreModalOpen(true);
  };

  const handleRestore = async () => {
    if (!itemToRestore?.item_id) return;

    try {
      await cafeItemService.restore(itemToRestore.item_id);
      await loadItems();
      setItemToRestore(null);
      setIsRestoreModalOpen(false);
    } catch (error) {
      console.error('Failed to restore café item:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    await loadItems();
  };

  const isDeleted = (item: CafeItem) => item.deleted_at !== null && item.deleted_at !== undefined;

  const itemsForCafe = menuItems.filter((it) => it.cafe_id === selectedCafeId);
  const categories = Array.from(new Set(itemsForCafe.map(i => i.category))).sort();

  const filteredItems = itemsForCafe
    .filter((it) => {
      const matchesSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || it.category === categoryFilter;
      const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' ? !isDeleted(it) : isDeleted(it));
      return matchesSearch && matchesCategory && matchesAvailability;
    });

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
            <Coffee className="h-8 w-8 text-amber-600" />
            Café Menu Items
          </h1>
          {selectedCafeId ? (
            <p className="text-gray-600 mt-1">
              Managing menu for {cafes.find(c => c.cafe_id === selectedCafeId)?.name}
            </p>
          ) : (
            <p className="text-red-600 mt-1">No café found. Seed at least one café.</p>
          )}
        </div>
        {isManager && (
          <Button onClick={handleAdd} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-auto">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <div className="w-auto">
          <Select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </Select>
        </div>

        {isManager && (
          <ShowDeletedToggle checked={showDeleted} onChange={setShowDeleted} />
        )}

        <Badge variant="outline" className="text-sm">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              const priceNum = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
              return (
                <TableRow
                  key={item.item_id}
                  onClick={() => handleRowClick(item)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    isDeleted(item) ? 'opacity-60 bg-red-50' : ''
                  }`}
                >
                  <TableCell className="font-medium">#{item.item_id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell className="font-semibold">${priceNum.toFixed(2)}</TableCell>
                  <TableCell>
                    {isDeleted(item) ? (
                      <Badge variant="danger">Deleted</Badge>
                    ) : (
                      <Badge variant="success">Available</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!isDeleted(item) ? (
                        <>
                          {isManager && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleEdit(item, e)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteClick(item, e)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        isManager && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleRestoreClick(item, e)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Café Item' : 'Add New Café Item'}
        description={selectedItem ? `Update information for ${selectedItem.name}` : 'Add a new item to the café menu'}
        size="lg"
      >
        <CafeItemForm
          item={selectedItem}
          cafeId={selectedCafeId}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Café Item"
        description="Are you sure you want to delete this item? This action can be undone by a manager."
      >
        <div className="space-y-4">
          {itemToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{itemToDelete.name}</span> - ${typeof itemToDelete.price === 'string' ? parseFloat(itemToDelete.price).toFixed(2) : itemToDelete.price.toFixed(2)}
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
      <CafeItemDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={detailItem}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setSelectedItem(detailItem);
          setIsModalOpen(true);
        }}
        canEdit={detailItem ? (!isDeleted(detailItem) && isManager) : false}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmationModal
        open={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        itemName={itemToRestore?.name || ''}
        itemType="Café Item"
      />
    </div>
  );
}
