'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, isCartOpen, closeCart, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    closeCart();
    router.push('/');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] transition-opacity backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto flex flex-col pointer-events-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-sea_green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm mt-2">Add items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Item Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}

                    {/* Metadata */}
                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                      {item.metadata?.visit_date && (
                        <p>Visit: {new Date(item.metadata.visit_date).toLocaleDateString()}</p>
                      )}
                      {item.metadata?.event_date && (
                        <p>Event: {new Date(item.metadata.event_date).toLocaleDateString()}</p>
                      )}
                      {item.metadata?.participants && (
                        <p>Participants: {item.metadata.participants}</p>
                      )}
                    </div>

                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-sea_green-700">
                        ${item.unit_price.toFixed(2)}
                      </span>

                      {/* Quantity Controls for all items */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            updateQuantity(item.id, val);
                          }}
                          className="w-16 text-center text-sm font-semibold border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sea_green-500"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors self-start"
                    title="Remove from cart"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-gray-700">Subtotal:</span>
              <span className="font-bold text-sea_green-700 text-2xl">
                ${cart.total.toFixed(2)}
              </span>
            </div>

            {/* Item Count */}
            <p className="text-sm text-gray-600 text-center">
              {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in cart
            </p>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-sea_green-600 hover:bg-sea_green-700 text-white py-6 text-lg font-semibold"
            >
              Proceed to Checkout
            </Button>

            {/* Continue Shopping */}
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Continue Shopping
            </Button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
