'use client';

import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ShoppingCart, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, onAdd, onEdit, onDelete }: ProductCardProps) {
  const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
  return (
    <div className="group bg-card rounded-[2rem] border border-muted/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.visuals[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-background/80 backdrop-blur-md text-primary border-none font-black px-3 py-1 rounded-full shadow-lg">
            ৳{product.price?.toLocaleString()}
          </Badge>
        </div>

        {/* Stock per size - bottom left corner */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1.5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          {product.stock?.map((s) => (
            s.quantity > 0 && (
              <Badge key={s.size} variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-0 font-black text-[9px] px-1.5 py-0.5 shadow-sm">
                {s.size}: {s.quantity}
              </Badge>
            )
          ))}
          {totalStock === 0 && (
            <Badge variant="destructive" className="text-[9px] font-black px-2 py-0.5">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Admin Quick Actions */}
        {(onEdit || onDelete) && (
          <div className="absolute top-4 left-4 flex gap-2 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 z-10">
            {onEdit && (
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                className="rounded-full bg-white/90 hover:bg-white text-primary shadow-xl"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); onDelete(product._id); }}
                className="rounded-full bg-white/90 hover:bg-destructive text-destructive shadow-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div>
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
            {product.subcategory}
          </p>
          <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
            {product.name}
          </h3>
        </div>
        {onAdd && (
          <Button 
            onClick={() => onAdd(product)}
            className="w-full h-11 gap-2 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Bucket
          </Button>
        )}
      </div>
    </div>
  );
}
