'use client';

import { useState } from 'react';
import FilterBar from './FilterBar';
import ProductGallery from './ProductGallery';
import CartDrawer from './CartDrawer';
import EmployeeChart from './EmployeeChart';
import { Product } from '@/types';

interface CartItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export default function Dashboard() {
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, size: string) => {
    const unitPrice = 29.99; // TODO: fetch from product or API
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product._id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          size,
          quantity: 1,
          unitPrice,
        },
      ];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Savior Systems</h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <FilterBar
          selectedOutlet={selectedOutlet}
          setSelectedOutlet={setSelectedOutlet}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />

        {selectedOutlet ? (
          <ProductGallery
            outletId={selectedOutlet}
            categoryId={selectedCategory}
            subcategory={selectedSubcategory}
            size={selectedSize}
            onAddToCart={addToCart}
          />
        ) : (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm">
            Please select an outlet to view products.
          </div>
        )}

        <EmployeeChart />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        outletId={selectedOutlet}
        onClearCart={clearCart}
      />
    </div>
  );
}
