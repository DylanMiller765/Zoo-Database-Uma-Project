'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Sparkles, Heart, Package, Loader2, Check, Search } from 'lucide-react';
import apiClient from '@/lib/api';

type ShopItem = {
  item_id: number;
  name: string;
  price: number | string; // DECIMAL may arrive as string
  description?: string;
  category?: string;
};

export default function GiftShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const handleAddToCart = (item: ShopItem) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      alert('Please log in as a customer to add items to cart');
      router.push('/login');
      return;
    }

    addItem({
      item_type: 'gift_shop_item',
      item_id: item.item_id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unit_price: typeof item.price === 'number' ? item.price : Number(item.price),
      metadata: { gift_shop_id: 1 }
    });

    // Show success feedback
    setAddedItems((prev) => new Set(prev).add(item.item_id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.item_id);
        return newSet;
      });
    }, 2000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/gift-shop-items/public');
        setItems(res.data);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load gift shop items');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        cats.add(item.category);
      }
    });
    return ['All', ...Array.from(cats).sort()];
  }, [items]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div className="min-h-[calc(100vh-6rem)] py-10">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600" />
        <div className="pointer-events-none absolute -top-6 right-10 h-24 w-24 rounded-full bg-light_yellow-300/30 blur-2xl" />
        <div className="pointer-events-none absolute top-20 right-24 h-16 w-16 rounded-full bg-melon-300/30 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 25c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative z-10 px-6 py-10 text-white sm:px-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 mb-3">
            <span className="text-sm">🛍️ Gift Shop</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Bring the Zoo Home</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Ethically sourced merchandise supporting conservation & education.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Items</h2>
            <p className="text-gray-600">Discover unique souvenirs and gifts</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-sea_green-50 rounded-full border border-sea_green-200">
            <Heart className="h-4 w-4 text-sea_green-600" />
            <span className="text-sm font-medium text-sea_green-700">Supports Conservation</span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-sea_green-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>Category: {cat}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-sea_green-600" />
            <span className="ml-3 text-gray-600">Loading items...</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No items available at this time.</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for new arrivals!</p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (() => {
          // Group filtered items by category
          const groupedItems = filteredItems.reduce((acc, item) => {
            const category = item.category || 'Other';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(item);
            return acc;
          }, {} as Record<string, ShopItem[]>);

          const displayCategories = Object.keys(groupedItems).sort();

          return (
            <div className="space-y-8">
              {displayCategories.map((category) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sea_green-200 to-transparent"></div>
                    <h3 className="text-xl font-bold text-dark_spring_green-800 px-4">
                      {category}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sea_green-200 to-transparent"></div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {groupedItems[category].map((item) => {
                      const isAdded = addedItems.has(item.item_id);
                      const price = typeof item.price === 'number' ? item.price : Number(item.price);
                      
                      return (
                        <Card 
                          key={item.item_id} 
                          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-sea_green-300 transition-all duration-300 flex flex-col transform hover:-translate-y-0.5"
                        >
                          {/* Decorative gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-sea_green-50/0 to-dark_spring_green-50/0 group-hover:from-sea_green-50/40 group-hover:to-dark_spring_green-50/20 transition-all duration-300 pointer-events-none" />
                          
                          {/* Success indicator */}
                          {isAdded && (
                            <div className="absolute top-2 right-2 z-10 bg-sea_green-500 text-white rounded-full p-1.5 shadow-lg">
                              <Check className="h-3 w-3" />
                            </div>
                          )}

                          <CardHeader className="px-4 pt-4 pb-2 relative z-10">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-sm font-bold text-dark_spring_green-800 leading-tight line-clamp-2">
                                {item.name}
                              </CardTitle>
                              <Sparkles className="h-4 w-4 text-light_yellow-400 flex-shrink-0 opacity-50" />
                            </div>
                          </CardHeader>

                          <CardContent className="px-4 pb-4 flex-1 flex flex-col relative z-10">
                            {/* Price */}
                            <div className="mb-2">
                              <span className="text-xl font-extrabold text-sea_green-600">
                                ${price.toFixed(2)}
                              </span>
                            </div>

                            {/* Description */}
                            {item.description && (
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-1">
                                {item.description}
                              </p>
                            )}

                            {/* Add to Cart Button */}
                            {isAuthenticated && user?.role === 'customer' && (
                              <Button
                                onClick={() => handleAddToCart(item)}
                                disabled={isAdded}
                                className={`w-full mt-auto text-xs font-semibold transition-all duration-200 ${
                                  isAdded
                                    ? 'bg-sea_green-500 text-white cursor-default'
                                    : 'bg-gradient-to-r from-sea_green-600 to-dark_spring_green-600 hover:from-sea_green-700 hover:to-dark_spring_green-700 text-white shadow-sm hover:shadow-md'
                                }`}
                                size="sm"
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1.5" />
                                    Added!
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="h-3 w-3 mr-1.5" />
                                    Add to Cart
                                  </>
                                )}
                              </Button>
                            )}

                            {(!isAuthenticated || user?.role !== 'customer') && (
                              <div className="mt-auto pt-3 border-t border-gray-100">
                                <p className="text-xs text-center text-gray-500">
                                  <a 
                                    href="/login" 
                                    className="text-sea_green-600 hover:text-sea_green-700 font-medium underline"
                                  >
                                    Sign in
                                  </a>
                                  {' '}to purchase
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* No results message */}
        {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No items found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Footer message */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="mt-8 rounded-xl bg-gradient-to-r from-sea_green-50 to-dark_spring_green-50 border border-sea_green-200 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-sea_green-600" />
              <p className="text-sm font-semibold text-dark_spring_green-800">
                Every Purchase Supports Conservation
              </p>
            </div>
            <p className="text-xs text-gray-600">
              All proceeds help fund animal care, habitat maintenance, and education programs.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
