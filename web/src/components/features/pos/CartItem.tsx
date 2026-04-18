'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CartItemProps {
  item: any;
  onUpdateQty: (delta: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 group bg-accent/30 p-3 rounded-2xl border border-transparent hover:border-border hover:bg-accent/50 transition-all">
      <div className="w-16 h-16 rounded-xl overflow-hidden border bg-background flex-shrink-0">
        <img 
          src={item.image || 'https://via.placeholder.com/64?text=No+Img'} 
          alt={item.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate">{item.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-mono border-muted-foreground/30">
                {item.size}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-semibold">
                ৳{item.unitPrice}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 bg-background border rounded-lg p-0.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQty(-1)}
              className="h-6 w-6 hover:bg-accent"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQty(1)}
              className="h-6 w-6 hover:bg-accent"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-xs font-black text-primary">
            ৳{(item.quantity * item.unitPrice).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
