'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import apiClient from '@/lib/api';

type ShopItem = {
  item_id: number;
  name: string;
  price: number | string; // DECIMAL may arrive as string
  description?: string;
};

export default function GiftShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, openCart } = useCart();
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
    openCart();
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

      <section className="mt-8 rounded-2xl bg-gray-50 p-6">
        <h2 className="text-2xl font-bold mb-4">Featured Items</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading && <p className="text-sm text-gray-600">Loading items…</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="text-sm text-gray-600">No items available.</p>
          )}
          {items.map((item) => (
            <Card key={item.item_id} className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition flex flex-col">
              <CardHeader className="px-5 pt-5 pb-2">
                <CardTitle className="text-sm font-semibold text-dark_spring_green-700 truncate">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 text-sm text-gray-700 flex-1 flex flex-col">
                <div className="font-bold text-sea_green-600 mb-1">${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}</div>
                {item.description && (
                  <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                )}
                {isAuthenticated && user?.role === 'customer' && (
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full mt-auto bg-sea_green-600 hover:bg-sea_green-700 text-white"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-xs text-gray-600 text-center">More products coming soon. All purchases help fund animal care.</p>
      </section>
    </div>
  );
}
