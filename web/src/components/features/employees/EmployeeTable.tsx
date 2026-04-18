'use client';

import { Employee } from '@/hooks/useEmployees';
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
import { Edit, Trash2, UserCog, ShieldCheck, User } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function EmployeeTable({ employees, onEdit, onDelete, isLoading }: EmployeeTableProps) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading workforce data...</div>;
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Staff Member</TableHead>
            <TableHead>System Role</TableHead>
            <TableHead className="text-right">Management</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp._id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{emp.email}</span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">ID: {emp._id.slice(-6)}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {emp.role === 'admin' ? (
                  <Badge className="gap-1 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 border-blue-600/20 shadow-none">
                    <ShieldCheck className="h-3 w-3" />
                    Administrator
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1 shadow-none">
                    <UserCog className="h-3 w-3" />
                    Staff Member
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(emp)}
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(emp._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                No employees registered in the system.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
