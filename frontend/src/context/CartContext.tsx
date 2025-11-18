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
   * If the same item already exists, increase its quantity instead of adding a duplicate
   */
  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prevItems) => {
      // Check if an identical item already exists
      // For tickets: match on item_type, item_id, visit_date, and ticket_type
      // For events: match on item_type and item_id
      // For other items: match on item_type and item_id
      // For donations/membership: match on item_type and name (since they might not have item_id)
      const existingItemIndex = prevItems.findIndex((item) => {
        // Basic type match
        if (item.item_type !== newItem.item_type) return false;
        
        // For tickets, match ONLY on visit_date and ticket_type (ignore item_id)
        if (newItem.item_type === 'ticket') {
          const sameVisitDate = 
            (item.metadata?.visit_date || null) === (newItem.metadata?.visit_date || null);
          const sameTicketType = 
            (item.metadata?.ticket_type || null) === (newItem.metadata?.ticket_type || null);
          return sameVisitDate && sameTicketType;
        }
        
        // For items with item_id, match on that
        if (newItem.item_id !== undefined && item.item_id !== undefined) {
          if (item.item_id !== newItem.item_id) return false;
          
          // For events, just match on item_id
          if (newItem.item_type === 'event') {
            return true;
          }
          
          // For gift shop and cafe items, match on item_id
          if (newItem.item_type === 'gift_shop_item' || newItem.item_type === 'cafe_item') {
            return true;
          }
        }
        
        // For items without item_id (donations, membership), match on name and unit_price
        if (newItem.item_id === undefined && item.item_id === undefined) {
          // For membership, only allow one
          if (newItem.item_type === 'membership') {
            return item.item_type === 'membership';
          }
          // For donations, match on name and price (same donation amount)
          if (newItem.item_type === 'donation') {
            return item.item_type === 'donation' && 
                   item.name === newItem.name && 
                   item.unit_price === newItem.unit_price;
          }
        }
        
        return false;
      });

      if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // New item, add it
        const id = `${newItem.item_type}_${newItem.item_id || 'donation'}_${Date.now()}`;
        const item: CartItem = { ...newItem, id };
        return [...prevItems, item];
      }
    });
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
