'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';

interface VariantDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (size: string) => void;
}

export function VariantDialog({ product, isOpen, onClose, onConfirm }: VariantDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    if (isOpen) setSelectedSize('');
  }, [isOpen]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-muted/30 p-6 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black">
              <Package className="h-5 w-5 text-primary" />
              Select Variation
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 mt-6">
            <div className="w-20 h-20 rounded-2xl border bg-background overflow-hidden shadow-sm">
              <img src={product.visuals[0]} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg leading-tight truncate">{product.name}</h4>
              <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">
                {product.subcategory}
              </p>
              <Badge variant="secondary" className="mt-2 font-black text-[10px] tracking-tighter bg-primary/10 text-primary hover:bg-primary/20">
                ৳{product.price?.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-background">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
              Available Sizes
            </label>
            <div className="grid grid-cols-3 gap-3">
              {product.activatedSizes.map((size: string) => {
                const stockQty = product.stock?.find(
                  (s: any) => s.size === size
                )?.quantity || 0;
                const isSelected = selectedSize === size;
                const isOutOfStock = stockQty === 0;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock}
                    className={`relative h-14 rounded-2xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 border-2 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10'
                        : !isOutOfStock
                        ? 'bg-card text-foreground border-muted hover:border-primary/50'
                        : 'bg-muted/50 text-muted-foreground border-dashed border-muted cursor-not-allowed grayscale'
                    }`}
                  >
                    <span>{size}</span>
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {isOutOfStock ? 'Sold Out' : `${stockQty} Left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={() => onConfirm(selectedSize)}
            disabled={!selectedSize}
            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/10 active:scale-95 transition-all gap-3"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
