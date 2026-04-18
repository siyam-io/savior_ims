'use client';

import { useEmployeeOrders, useFilteredOrders } from '@/hooks/useOrders';
import Link from 'next/link';
import { Eye, Package, ShoppingBag, ListOrdered, Calendar, History, TrendingUp, Search, Truck, FilterX } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { Pagination } from '@/components/ui/pagination';

export default function MyOrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: result, isLoading } = useFilteredOrders({
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    page,
    limit
  });

  const orders = result?.data || [];
  const totalPages = result?.pagination?.totalPages || 0;
  const totalItems = result?.pagination?.total || 0;

  // We still use useEmployeeOrders for the header stats (or we could calculate from a separate query)
  const { data: allEmployeeOrders } = useEmployeeOrders();
  const totalSales = allEmployeeOrders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0;
  const totalUnits = allEmployeeOrders?.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0) || 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Sales</h1>
            <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">Performance Ledger</p>
          </div>
        </div>

        <Card className="bg-card border-muted shadow-lg shadow-foreground/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-black">৳{totalSales.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-muted shadow-lg shadow-foreground/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Units Processed</p>
              <p className="text-xl font-black">{totalUnits.toLocaleString()} Items</p>
            </div>
          </CardContent>
        </Card>
      </div>      {/* Table Section */}
      <Card className="border-muted shadow-xl shadow-foreground/5 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-6 border-b bg-muted/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-primary" />
            Transaction History
            <Badge variant="secondary" className="h-5 px-2 font-black text-[10px] bg-primary/10 text-primary">
              {totalItems} Records
            </Badge>
          </CardTitle>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[240px] group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search my orders..." 
                value={search} 
                onChange={e => { setSearch(e.target.value); setPage(1); }} 
                className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20 focus:ring-primary shadow-none"
              />
            </div>
            <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[180px] h-10 rounded-xl border-muted-foreground/20 bg-background font-bold shadow-none">
                <Truck className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl">
                <SelectItem value="all" className="rounded-xl">All Statuses</SelectItem>
                <SelectItem value="pending" className="rounded-xl">Pending</SelectItem>
                <SelectItem value="processing" className="rounded-xl">Processing</SelectItem>
                <SelectItem value="shipped" className="rounded-xl">Shipped</SelectItem>
                <SelectItem value="delivered" className="rounded-xl">Delivered</SelectItem>
                <SelectItem value="returned" className="rounded-xl">Returned</SelectItem>
                <SelectItem value="cancelled" className="rounded-xl">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {(search || status !== 'all') && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}
                className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-muted">
                <TableHead className="w-[120px] font-black uppercase tracking-widest text-[10px]">Reference</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Customer</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Phone</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Outlet</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Revenue</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Date & Time</TableHead>
                <TableHead className="text-right font-black uppercase tracking-widest text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <TableRow key={i}>
                    <TableCell colSpan={8}><Skeleton className="h-12 w-full rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : orders.map((order: any) => (
                <TableRow key={order._id} className="group border-muted hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono text-[11px] font-black text-primary uppercase tracking-tighter">
                    #{order._id.slice(-8)}
                  </TableCell>
                  <TableCell className="font-bold text-sm">{order.customerName}</TableCell>
                  <TableCell className="text-sm">{order.customerPhone}</TableCell>
                  <TableCell className="font-bold text-sm">{order.outletId?.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.deliveryStatus} />
                  </TableCell>
                  <TableCell className="font-black text-sm">৳{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold gap-2 text-primary hover:bg-primary/10 transition-all active:scale-95">
                      <Link href={`/orders/${order._id}`}>
                        <Eye className="w-4 h-4" />
                        Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {(!isLoading && orders.length === 0) && (
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-4 opacity-30 grayscale">
              <ShoppingBag className="w-20 h-20" />
              <p className="font-black uppercase tracking-widest text-sm text-muted-foreground">No records matched</p>
              <Button asChild variant="outline" className="rounded-xl border-muted-foreground/20 font-black uppercase tracking-widest text-[10px]" onClick={() => { setSearch(''); setStatus('all'); }}>
                <span>Clear Filters</span>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t bg-muted/10 flex justify-center">
              <Pagination 
                page={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
