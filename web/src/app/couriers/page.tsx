'use client';

import { useCouriers, useDeleteCourier } from '@/hooks/useCouriers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Plus, Truck, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CouriersPage() {
  const { data: couriers, isLoading } = useCouriers();
  const { mutate: deleteCourier } = useDeleteCourier();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this courier service?')) {
      deleteCourier(id);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Courier Partners</h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-2">
              Shipping & Logistics Management
            </p>
          </div>
        </div>
        <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all px-6">
          <Link href="/couriers/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Courier
          </Link>
        </Button>
      </div>

      <Card className="border-muted shadow-xl shadow-foreground/5 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-6 border-b bg-muted/20">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Authorized Delivery Services
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-muted">
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Service Name</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Base Charge (৳)</TableHead>
                <TableHead className="text-right font-black uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1,2,3].map(i => (
                  <TableRow key={i}>
                    <TableCell colSpan={3}><Skeleton className="h-12 w-full rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : couriers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30 grayscale">
                      <Truck className="w-20 h-20" />
                      <p className="font-black uppercase tracking-widest text-sm">No couriers configured</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : couriers?.map(courier => (
                <TableRow key={courier._id} className="group border-muted hover:bg-muted/20 transition-colors">
                  <TableCell className="font-bold text-sm">
                    {courier.name}
                  </TableCell>
                  <TableCell className="font-black text-sm">
                    ৳{courier.charge.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-primary/10 hover:text-primary">
                        <Link href={`/couriers/edit/${courier._id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(courier._id)}
                        className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
