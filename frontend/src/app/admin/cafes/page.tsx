"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cafeService } from '@/services/cafe.service';
import { Cafe, CafeItem, CreateCafeItemData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Coffee, Search, X, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cafeItemService } from '@/services/cafeItem.service';

export default function CafesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  // Item management state
  const [menuItems, setMenuItems] = useState<CafeItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selectedCafeId, setSelectedCafeId] = useState<number>(0);
  const [itemForm, setItemForm] = useState<CreateCafeItemData>({
    cafe_id: 0,
    name: '',
    description: '',
    category: '',
    price: 0,
    is_available: true,
  });
  const [itemError, setItemError] = useState<string | null>(null);
  const [creatingItem, setCreatingItem] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  // Edit removed per request



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

  useEffect(() => {
    if (cafes.length > 0 && selectedCafeId === 0) {
      setSelectedCafeId(cafes[0].cafe_id);
      setItemForm((f) => ({ ...f, cafe_id: cafes[0].cafe_id }));
    }
  }, [cafes, selectedCafeId]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setItemsLoading(true);
        const all = await cafeItemService.getAll();
        setMenuItems(all);
      } catch (e) {
        console.error('Failed to load cafe items:', e);
      } finally {
        setItemsLoading(false);
      }
    };
    if (isAuthenticated) loadItems();
  }, [isAuthenticated]);

  const itemsForCafe = menuItems.filter((it) => it.cafe_id === selectedCafeId);
  const categories = Array.from(new Set(itemsForCafe.map(i => i.category))).sort();
  const filteredItems = itemsForCafe.filter((it) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      it.name.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q)
    );
  });
  const fullyFiltered = filteredItems.filter(it => {
    const catOk = categoryFilter === 'all' || it.category === categoryFilter;
    const availOk = availabilityFilter === 'all' || (availabilityFilter === 'available' ? it.is_available : !it.is_available);
    return catOk && availOk;
  });

  const refreshItems = async () => {
    try {
      const all = await cafeItemService.getAll();
      setMenuItems(all);
    } catch (e) {
      console.error('Failed to refresh items:', e);
    }
  };

  // No cafe create/edit/delete in this simplified view

  // Cafe item handlers
  const handleItemField = (field: keyof CreateCafeItemData, value: any) => {
    setItemForm((f) => ({ ...f, [field]: value }));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.cafe_id) {
      setItemError('Please select a café');
      return;
    }
    try {
      setCreatingItem(true);
      setItemError(null);
      const payload = {
        ...itemForm,
        price: typeof itemForm.price === 'string' ? parseFloat(itemForm.price) : itemForm.price,
      };
      await cafeItemService.create(payload);
      setItemForm({
        cafe_id: selectedCafeId,
        name: '',
        description: '',
        category: '',
        price: 0,
        is_available: true,
      });
      await refreshItems();
      setIsAddOpen(false);
    } catch (e: any) {
      setItemError(e.response?.data?.message || 'Failed to create item');
    } finally {
      setCreatingItem(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try {
      await cafeItemService.delete(id);
      await refreshItems();
    } catch (e: any) {
      setItemError(e.response?.data?.message || 'Failed to delete item');
    }
  };

  // Edit removed per request

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
            Café Menu Items
          </h1>
          {selectedCafeId ? (
            <p className="text-gray-600 mt-1">Managing menu for {cafes.find(c => c.cafe_id === selectedCafeId)?.name}</p>
          ) : (
            <p className="text-red-600 mt-1">No café found. Seed at least one café.</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search items by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="h-9 rounded-md border px-3 text-sm text-gray-700 bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="h-9 rounded-md border px-3 text-sm text-gray-700 bg-white"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <Badge variant="outline" className="text-sm whitespace-nowrap">
                {fullyFiltered.length} item{fullyFiltered.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <Button onClick={() => setIsAddOpen(true)} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {itemsLoading ? (
              <p className="text-sm text-gray-600">Loading items...</p>
            ) : fullyFiltered.length === 0 ? (
              <p className="text-sm text-gray-600">No items for this café.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-gray-600 font-medium">ID</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Name</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Category</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Price</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Available</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fullyFiltered.map((it) => {
                    const priceNum = typeof it.price === 'string' ? parseFloat(it.price) : it.price;
                    return (
                      <tr key={it.item_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{it.item_id}</td>
                        <td className="px-4 py-3">{it.name}</td>
                        <td className="px-4 py-3">{it.category}</td>
                        <td className="px-4 py-3">${priceNum.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          {it.is_available ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Available</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">Unavailable</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteItem(it.item_id)}
                            className="p-2 rounded hover:bg-red-50 text-red-600"
                            aria-label="Delete item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Café Item</h2>
              <button aria-label="Close" className="p-2 text-gray-500 hover:text-gray-700" onClick={() => setIsAddOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateItem}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={itemForm.name}
                    onChange={(e) => handleItemField('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text sm font-medium mb-1">Category</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={itemForm.category}
                    onChange={(e) => handleItemField('category', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded border px-3 py-2"
                    value={itemForm.price}
                    onChange={(e) => handleItemField('price', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Available</label>
                  <select
                    className="w-full rounded border px-3 py-2"
                    value={itemForm.is_available ? 'true' : 'false'}
                    onChange={(e) => handleItemField('is_available', e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full rounded border px-3 py-2"
                    rows={3}
                    value={itemForm.description}
                    onChange={(e) => handleItemField('description', e.target.value)}
                    required
                  />
                </div>
                {itemError && <p className="text-sm text-red-600 md:col-span-2">{itemError}</p>}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={creatingItem}>{creatingItem ? 'Creating...' : 'Add Item'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit removed per request */}
    </div>
  );
}
