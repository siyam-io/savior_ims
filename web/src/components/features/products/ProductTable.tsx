'use client';

import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ImageIcon } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function ProductTable({ products, onEdit, onDelete, isLoading }: ProductTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading products...</div>;
  }

  const getTotalStock = (product: Product) => {
    return product.stock?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category / Sub</TableHead>
            <TableHead>Total Stock</TableHead>
            <TableHead>Active Sizes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <div className="w-12 h-12 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                  {product.visuals[0] ? (
                    <img src={product.visuals[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground opacity-20" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-gray-800">{product.categoryId?.name}</span>
                  <span className="text-xs text-muted-foreground">{product.subcategory}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getTotalStock(product) > 0 ? 'secondary' : 'destructive'} className="font-bold">
                  {getTotalStock(product)} Units
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {product.activatedSizes.map((size, i) => {
                    const stockEntry = product.stock?.find(s => s.size === size);
                    const qty = stockEntry?.quantity || 0;
                    return (
                      <Badge key={i} variant="outline" className="text-[10px] px-1.5 h-5 font-normal flex items-center gap-1">
                        {size}: {qty}
                      </Badge>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
