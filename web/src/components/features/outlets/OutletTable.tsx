'use client';

import { Outlet } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface OutletTableProps {
  outlets: Outlet[];
  onEdit: (outlet: Outlet) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function OutletTable({ outlets, onEdit, onDelete, isLoading }: OutletTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading outlets...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Outlet Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outlets.map((outlet) => (
            <TableRow key={outlet._id}>
              <TableCell className="font-medium">{outlet.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(outlet)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(outlet._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {outlets.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                No outlets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
