'use client';

import { useState, useEffect } from 'react';
import { useProducts, useFilteredProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/features/pos/ProductCard';
import { Pagination } from '@/components/ui/pagination';
import { Product } from '@/types';
import { Search, FilterX, Box, Loader2 } from 'lucide-react';

interface ProductSearchFilterProps {
  outletId: string;
  onAddToCart?: (product: Product) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductSearchFilter({ 
  outletId, 
  onAddToCart,
  isAdmin,
  onEdit,
  onDelete 
}: ProductSearchFilterProps) {
  const [categoryId, setCategoryId] = useState<string>('all');
  const [subcategory, setSubcategory] = useState<string>('all');
  const [size, setSize] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data: categories } = useCategories();
  const selectedCategory = categories?.find(c => c._id === categoryId);

  const { data: result, isLoading } = useFilteredProducts({
    categoryId: categoryId !== 'all' ? categoryId : undefined,
    subcategory: subcategory !== 'all' ? subcategory : undefined,
    size: size !== 'all' ? size : undefined,
    search: search || undefined,
    page,
    limit
  });

  const products = result?.data || [];
  const totalPages = result?.pagination?.totalPages || 0;

  // Reset filters when category changes
  useEffect(() => {
    setSubcategory('all');
    setSize('all');
  }, [categoryId]);

  const resetFilters = () => {
    setCategoryId('all');
    setSubcategory('all');
    setSize('all');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 p-4 md:p-6 bg-card/50 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-muted shadow-xl shadow-foreground/5">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by product name..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(1); }} 
            className="pl-12 h-12 md:h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary shadow-inner"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap overflow-x-auto pb-2 md:pb-0 gap-3 no-scrollbar">
          <Select value={categoryId} onValueChange={val => { setCategoryId(val); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 md:h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary font-bold shadow-none">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-muted shadow-2xl">
              <SelectItem value="all" className="rounded-xl">All Categories</SelectItem>
              {categories?.map(c => <SelectItem key={c._id} value={c._id} className="rounded-xl">{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          {selectedCategory && (
            <Select value={subcategory} onValueChange={val => { setSubcategory(val); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 md:h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary font-bold shadow-none">
                <SelectValue placeholder="Subcategory" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-muted shadow-2xl">
                <SelectItem value="all" className="rounded-xl">All Subcategories</SelectItem>
                {selectedCategory.subcategories.map(s => <SelectItem key={s} value={s} className="rounded-xl">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          {selectedCategory && (
            <Select value={size} onValueChange={val => { setSize(val); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[130px] h-12 md:h-14 rounded-2xl bg-muted/30 border-none focus:ring-primary font-bold shadow-none">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-muted shadow-2xl">
                <SelectItem value="all" className="rounded-xl">All Sizes</SelectItem>
                {selectedCategory.sizes.map(s => <SelectItem key={s} value={s} className="rounded-xl">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetFilters}
            className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl hover:bg-destructive/10 hover:text-destructive active:scale-90 transition-all"
            title="Reset Filters"
          >
            <FilterX className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Grid Area */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-muted h-72 rounded-[2rem]" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-30 grayscale space-y-4">
          <Box className="h-20 w-20" />
          <p className="font-black uppercase tracking-[0.2em] text-sm">No products matched</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAdd={onAddToCart ? () => onAddToCart(product) : undefined} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8 border-t border-muted/50">
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </div>
  );
}
