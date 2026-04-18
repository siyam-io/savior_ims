'use client';

import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';

import { ProductCard } from '@/components/features/pos/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { PackageX } from 'lucide-react';

interface ProductGalleryProps {
  outletId: string;
  categoryId: string;
  subcategory: string;
  size: string;
  onAddToCart: (product: Product) => void;
}

export default function ProductGallery({
  outletId,
  categoryId,
  subcategory,
  size,
  onAddToCart,
}: ProductGalleryProps) {
  const { data: products, isLoading } = useProducts({
    outletId,
    categoryId,
    subcategory,
    size,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 p-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-[2rem]" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-40 grayscale">
        <PackageX className="w-16 h-16 mb-4" />
        <p className="font-black uppercase tracking-widest text-sm">No items in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 p-4">
      {products.map((product: any) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onAdd={onAddToCart} 
        />
      ))}
    </div>
  );
}
