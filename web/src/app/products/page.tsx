'use client';

import { useDeleteProduct } from '@/hooks/useProducts';
import { ProductSearchFilter } from '@/components/features/products/ProductSearchFilter';
import { Button } from '@/components/ui/button';
import { Plus, Package, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleEdit = (product: Product) => {
    router.push(`/products/add?id=${product._id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently remove this product from the global catalog?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Global Catalog</h1>
            <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Master Inventory Management
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => router.push('/products/add')} 
          className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all gap-3 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>
      {/* Integrated Search, Filter & Grid */}
      <ProductSearchFilter
        outletId=""
        isAdmin={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
