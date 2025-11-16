'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Cart } from '@/types/cart.types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zoo_shopping_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setItems(parsed.items || []);
        } catch (error) {
          console.error('Failed to parse stored cart:', error);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } else {
      // Clear cart if not authenticated or not a customer
      setItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
    }
  }, [items, isAuthenticated, user]);

  // Calculate cart totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const cart: Cart = {
    items,
    itemCount,
    total,
  };

  /**
   * Add item to cart
   */
  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.item_type}_${newItem.item_id || 'donation'}_${Date.now()}`;
    const item: CartItem = { ...newItem, id };

    setItems((prevItems) => [...prevItems, item]);
  };

  /**
   * Remove item from cart
   */
  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear cart
   */
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  /**
   * Open cart sidebar
   */
  const openCart = () => setIsCartOpen(true);

  /**
   * Close cart sidebar
   */
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
