'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-xl border-muted-foreground/20"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-1">
        {getPages().map((p, i) => (
          p === '...' ? (
            <div key={`dots-${i}`} className="w-9 flex justify-center text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={`page-${p}`}
              variant={page === p ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(p as number)}
              className={`w-9 h-9 rounded-xl font-bold transition-all ${
                page === p ? 'shadow-lg shadow-primary/20' : 'text-muted-foreground'
              }`}
            >
              {p}
            </Button>
          )
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-xl border-muted-foreground/20"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
