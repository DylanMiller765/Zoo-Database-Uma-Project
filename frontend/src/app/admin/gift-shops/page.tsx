"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { giftShopService } from '@/services/giftShop.service';
import { GiftShop } from '@/types';
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
import { Plus, Search, Edit, Trash2, Store } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { GiftShopForm } from '@/components/admin/GiftShopForm';

export default function GiftShopsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [giftShops, setGiftShops] = useState<GiftShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<GiftShop | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<GiftShop | null>(null);



  useEffect(() => {
    if (isAuthenticated) {
      loadGiftShops();
    }
  }, [isAuthenticated]);

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

  const handleAdd = () => {
    setSelectedShop(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shop: GiftShop) => {
    setSelectedShop(shop);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (shop: GiftShop) => {
    setShopToDelete(shop);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!shopToDelete?.gift_shop_id) return;

    try {
      await giftShopService.delete(shopToDelete.gift_shop_id);
      await loadGiftShops();
      setIsDeleteModalOpen(false);
      setShopToDelete(null);
    } catch (error) {
      console.error('Failed to delete gift shop:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setSelectedShop(null);
    await loadGiftShops();
  };

  const filteredShops = giftShops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Store className="h-8 w-8 text-purple-600" />
            Gift Shops Management
          </h1>
          <p className="text-gray-600 mt-1">Manage zoo gift shops and retail locations</p>
        </div>
        <Button onClick={handleAdd} variant="secondary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Gift Shop
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
          {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''}
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
            {filteredShops.map((shop) => (
              <TableRow key={shop.gift_shop_id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell>{shop.location || 'N/A'}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {shop.opening_time} - {shop.closing_time}
                </TableCell>
                <TableCell>{shop.manager_id || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(shop)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(shop)}
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

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No gift shops found</p>
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedShop ? 'Edit Gift Shop' : 'Add New Gift Shop'}
        description={selectedShop ? `Update information for ${selectedShop.name}` : 'Add a new gift shop to the zoo'}
        size="xl"
      >
        <GiftShopForm giftShop={selectedShop} onSuccess={handleFormSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Gift Shop"
        description="Are you sure you want to delete this gift shop? This action cannot be undone."
      >
        <div className="space-y-4">
          {shopToDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{shopToDelete.name}</span> at {shopToDelete.location || 'Unknown location'}
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
