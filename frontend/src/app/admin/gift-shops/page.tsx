"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { giftShopService } from '@/services/giftShop.service';
import { giftShopItemService } from '@/services/giftShopItem.service';
import { GiftShop, GiftShopItem } from '@/types';
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
import { Plus, Search, Edit, Trash2, Store, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { GiftShopItemForm } from '@/components/admin/GiftShopItemForm';
import { GiftShopItemDetailModal } from '@/components/admin/GiftShopItemDetailModal';
import { ShowDeletedToggle } from '@/components/admin/ShowDeletedToggle';
import { RestoreConfirmationModal } from '@/components/admin/RestoreConfirmationModal';

export default function GiftShopsPage() {
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth();
  const [giftShops, setGiftShops] = useState<GiftShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<GiftShopItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selectedShopId, setSelectedShopId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GiftShopItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GiftShopItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<GiftShopItem | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [itemToRestore, setItemToRestore] = useState<GiftShopItem | null>(null);

  const isManager = hasRole('manager');

  useEffect(() => {
    if (isAuthenticated) {
      loadGiftShops();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (giftShops.length > 0 && selectedShopId === 0) {
      setSelectedShopId(giftShops[0].gift_shop_id);
    }
  }, [giftShops, selectedShopId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated, showDeleted]);

  const loadGiftShops = async () => {
    try {
      setLoading(true);
      const data = await giftShopService.getAll();
      setGiftShops(data);
    } catch (error) {
      console.error('Failed to load gift shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      setItemsLoading(true);
      const data = await giftShopItemService.getAll(showDeleted);
      setItems(data);
    } catch (error) {
      console.error('Failed to load gift shop items:', error);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: GiftShopItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleRowClick = (item: GiftShopItem) => {
    setDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (item: GiftShopItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete?.item_id) return;

    try {
      await giftShopItemService.delete(itemToDelete.item_id);
      await loadItems();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete gift shop item:', error);
    }
  };

  const handleRestoreClick = (item: GiftShopItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToRestore(item);
    setIsRestoreModalOpen(true);
  };

  const handleRestore = async () => {
    if (!itemToRestore?.item_id) return;

    try {
      await giftShopItemService.restore(itemToRestore.item_id);
      await loadItems();
      setItemToRestore(null);
      setIsRestoreModalOpen(false);
    } catch (error) {
      console.error('Failed to restore gift shop item:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    await loadItems();
  };

  const itemsForShop = items.filter((it) => it.gift_shop_id === selectedShopId);
  const categories = Array.from(new Set(itemsForShop.map((i) => i.category))).sort();
  const suppliers = Array.from(new Set(itemsForShop.map((i) => i.supplier))).sort();

  const isDeleted = (item: GiftShopItem) => item.deleted_at !== null && item.deleted_at !== undefined;

  const filteredItems = itemsForShop
    .filter((it) => {
      const matchesSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || it.category === categoryFilter;
      const matchesSupplier = supplierFilter === 'all' || it.supplier === supplierFilter;
      return matchesSearch && matchesCategory && matchesSupplier;
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
            <Store className="h-8 w-8 text-purple-600" />
            Gift Shop Items
          </h1>
          {selectedShopId ? (
            <p className="text-gray-600 mt-1">
              Managing items for {giftShops.find(s => s.gift_shop_id === selectedShopId)?.name}
            </p>
          ) : (
            <p className="text-red-600 mt-1">No gift shop found. Seed at least one shop.</p>
          )}
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, category, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-auto">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <div className="w-auto">
          <Select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
            <option value="all">All Suppliers</option>
            {suppliers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
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
              <TableHead>Stock</TableHead>
              <TableHead>Supplier</TableHead>
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
                    <div className="flex items-center gap-2">
                      {item.quantity_in_stock} units
                      {item.quantity_in_stock < 10 && !isDeleted(item) && (
                        <Badge variant="warning" className="text-xs">Low</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.supplier}</TableCell>
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
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Gift Shop Item' : 'Add New Gift Shop Item'}
        description={selectedItem ? `Update information for ${selectedItem.name}` : 'Add a new item to the gift shop'}
        size="lg"
      >
        <GiftShopItemForm
          item={selectedItem}
          giftShopId={selectedShopId}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Gift Shop Item"
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
      <GiftShopItemDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={detailItem}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setSelectedItem(detailItem);
          setIsModalOpen(true);
        }}
        canEdit={detailItem ? !isDeleted(detailItem) : false}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmationModal
        open={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        itemName={itemToRestore?.name || ''}
        itemType="Gift Shop Item"
      />
    </div>
  );
}
