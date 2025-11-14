"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { giftShopService } from '@/services/giftShop.service';
import { GiftShop, GiftShopItem, CreateGiftShopItemData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Store, Search, X, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { giftShopItemService } from '@/services/giftShopItem.service';

export default function GiftShopsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [giftShops, setGiftShops] = useState<GiftShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<GiftShopItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selectedShopId, setSelectedShopId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [itemForm, setItemForm] = useState<CreateGiftShopItemData>({
    gift_shop_id: 0,
    name: '',
    description: '',
    category: '',
    price: 0,
    cost: 0,
    quantity_in_stock: 0,
    supplier: '',
  });
  const [itemError, setItemError] = useState<string | null>(null);
  const [creatingItem, setCreatingItem] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const hasOpenedModal = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasOpenedModal.current) return;
    if (searchParams.get('autoOpen') === 'true') {
      setIsAddOpen(true);
      hasOpenedModal.current = true;
    }
  }, [searchParams]);

  // Edit removed per request

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

  useEffect(() => {
    if (giftShops.length > 0 && selectedShopId === 0) {
      setSelectedShopId(giftShops[0].gift_shop_id);
      setItemForm((f) => ({ ...f, gift_shop_id: giftShops[0].gift_shop_id }));
    }
  }, [giftShops, selectedShopId]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setItemsLoading(true);
        const all = await giftShopItemService.getAll();
        setItems(all);
      } catch (e) {
        console.error('Failed to load gift shop items:', e);
      } finally {
        setItemsLoading(false);
      }
    };
    if (isAuthenticated) loadItems();
  }, [isAuthenticated]);

  const itemsForShop = items.filter((it) => it.gift_shop_id === selectedShopId);
  const categories = Array.from(new Set(itemsForShop.map((i) => i.category))).sort();
  const suppliers = Array.from(new Set(itemsForShop.map((i) => i.supplier))).sort();

  const filteredItems = itemsForShop.filter((it) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      it.name.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q) ||
      it.supplier.toLowerCase().includes(q)
    );
  });

  // apply dropdown filters
  const fullyFiltered = filteredItems.filter((it) => {
    const catOk = categoryFilter === 'all' || it.category === categoryFilter;
    const supOk = supplierFilter === 'all' || it.supplier === supplierFilter;
    return catOk && supOk;
  });

  const refreshItems = async () => {
    try {
      const all = await giftShopItemService.getAll();
      setItems(all);
    } catch (e) {
      console.error('Failed to refresh items:', e);
    }
  };

  const handleItemField = (field: keyof CreateGiftShopItemData, value: any) => {
    setItemForm((f) => ({ ...f, [field]: value }));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.gift_shop_id) {
      setItemError('Please select a gift shop');
      return;
    }
    try {
      setCreatingItem(true);
      setItemError(null);
      const payload = {
        ...itemForm,
        price: typeof itemForm.price === 'string' ? parseFloat(itemForm.price) : itemForm.price,
        cost: typeof itemForm.cost === 'string' ? parseFloat(itemForm.cost) : itemForm.cost,
      };
      await giftShopItemService.create(payload);
      setItemForm({
        gift_shop_id: selectedShopId,
        name: '',
        description: '',
        category: '',
        price: 0,
        cost: 0,
        quantity_in_stock: 0,
        supplier: '',
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
      await giftShopItemService.delete(id);
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
            <Store className="h-8 w-8 text-purple-600" />
            Gift Shop Items
          </h1>
          {selectedShopId ? (
            <p className="text-gray-600 mt-1">Managing items for {giftShops.find(s => s.gift_shop_id === selectedShopId)?.name}</p>
          ) : (
            <p className="text-red-600 mt-1">No gift shop found. Seed at least one shop.</p>
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
                  placeholder="Search items by name, category, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Category Filter */}
              <select
                className="h-9 rounded-md border px-3 text-sm text-gray-700 bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {/* Supplier Filter */}
              <select
                className="h-9 rounded-md border px-3 text-sm text-gray-700 bg-white"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="all">All Suppliers</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
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
              <p className="text-sm text-gray-600">No items for this shop.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-gray-600 font-medium">ID</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Name</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Category</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Price</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Qty</th>
                    <th className="px-4 py-3 text-gray-600 font-medium">Supplier</th>
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
                        <td className="px-4 py-3">{it.quantity_in_stock}</td>
                        <td className="px-4 py-3">{it.supplier}</td>
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
              <h2 className="text-xl font-semibold">Add Gift Shop Item</h2>
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
                  <label className="block text-sm font-medium mb-1">Category</label>
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
                  <label className="block text-sm font-medium mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded border px-3 py-2"
                    value={itemForm.cost}
                    onChange={(e) => handleItemField('cost', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full rounded border px-3 py-2"
                    value={itemForm.quantity_in_stock}
                    onChange={(e) => handleItemField('quantity_in_stock', Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    value={itemForm.supplier}
                    onChange={(e) => handleItemField('supplier', e.target.value)}
                    required
                  />
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
