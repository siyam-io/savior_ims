'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Checkbox({ checked, onCheckedChange, className = '' }: { checked: boolean; onCheckedChange: (val: boolean) => void; className?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center active:scale-90",
        checked 
          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "bg-background border-muted-foreground/30 hover:border-primary/50",
        className
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      {checked && <Check className="w-3.5 h-3.5 stroke-[4px] animate-in zoom-in-50 duration-200" />}
    </button>
  );
}
