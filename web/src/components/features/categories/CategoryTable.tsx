'use client';

import { Category } from '@/types';
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
import { Edit, Trash2 } from 'lucide-react';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function CategoryTable({ categories, onEdit, onDelete, isLoading }: CategoryTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Subcategories</TableHead>
            <TableHead>Sizes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-[300px]">
                <div className="flex flex-wrap gap-1">
                  {category.subcategories.map((sub, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {sub}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <div className="flex flex-wrap gap-1">
                  {category.sizes.map((size, i) => (
                    <Badge key={i} variant="outline" className="font-normal">
                      {size}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
