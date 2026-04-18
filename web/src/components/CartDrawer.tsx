'use client';

import { usePlaceOrder } from '@/hooks/useOrders';

interface CartItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  outletId: string;
  onClearCart: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, outletId, onClearCart }: CartDrawerProps) {
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const handleCheckout = () => {
    placeOrder(
      {
        items: items.map(({ productId, size, quantity, unitPrice }) => ({
          productId,
          size,
          quantity,
          unitPrice,
        })),
        outletId,
      },
      {
        onSuccess: () => {
          onClearCart();
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.quantity * item.unitPrice).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || isPending}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
