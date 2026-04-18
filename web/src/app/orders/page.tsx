'use client';

import { useAllOrders, useDeleteOrder, useFilteredOrders } from '@/hooks/useOrders';
import Link from 'next/link';
import { Eye, Trash2, Package, Filter, ListOrdered, Hash, Calendar, Store, User, Truck, Send, Loader2, CheckCircle2, Download, Search } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/ui/pagination';
import api from '@/lib/axios';

export default function OrdersPage() {
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: result, isLoading, refetch } = useFilteredOrders({
    employeeId: filterEmployee !== 'all' ? filterEmployee : undefined,
    status: filterDeliveryStatus !== 'all' ? filterDeliveryStatus : undefined,
    search: search || undefined,
    page,
    limit
  });

  const { mutate: deleteOrder } = useDeleteOrder();
  
  const orders = result?.data || [];
  const totalPages = result?.pagination?.totalPages || 0;

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o: any) => o._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const syncToPathao = async () => {
    if (selectedOrders.length === 0) return;
    setSyncing(true);
    try {
      await api.post('/orders/sync-to-pathao', { orderIds: selectedOrders });
      alert(`Successfully synchronized ${selectedOrders.length} orders to Pathao API.`);
      setSelectedOrders([]);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Pathao Synchronization Failed. Please check API credentials.');
    } finally {
      setSyncing(false);
    }
  };

  const downloadCSV = async () => {
    if (selectedOrders.length === 0) return;
    
    try {
      const queryParams = selectedOrders.map(id => `orderIds=${id}`).join('&');
      const response = await api.get(`/orders/export-csv?${queryParams}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pathao_orders_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate CSV. Please ensure you are logged in as an administrator.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to cancel this order? Stock will NOT be restored.')) {
      deleteOrder(id, { onSuccess: () => refetch() });
    }
  };

  const uniqueEmployees = orders
    ? Array.from(new Set(orders.map(o => o.employeeId?._id)))
        .map(id => orders.find(o => o.employeeId?._id === id)?.employeeId)
        .filter(emp => !!emp)
    : [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Order Management</h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-2">
              Centralized Sales Ledger
              <Badge variant="secondary" className="h-5 px-2 font-black text-[10px] bg-primary/10 text-primary">
                {orders?.length || 0} Total
              </Badge>
            </p>
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-3 animate-in slide-in-from-right-4">
            <Button 
              variant="outline"
              onClick={downloadCSV}
              className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] gap-2 border-muted-foreground/20 hover:bg-muted/5 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
            <Button 
              onClick={syncToPathao} 
              disabled={syncing}
              className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Sync {selectedOrders.length} to Pathao
            </Button>
          </div>
        )}
      </div>

      <Card className="border-muted shadow-xl shadow-foreground/5 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-6 border-b bg-muted/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filter Records
          </CardTitle>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[240px] group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search orders..." 
                value={search} 
                onChange={e => { setSearch(e.target.value); setPage(1); }} 
                className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20 focus:ring-primary"
              />
            </div>
            <Select value={filterDeliveryStatus} onValueChange={(val) => { setFilterDeliveryStatus(val); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[180px] h-10 rounded-xl border-muted-foreground/20 bg-background font-bold">
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
            <Select value={filterEmployee} onValueChange={(val) => { setFilterEmployee(val); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px] h-10 rounded-xl border-muted-foreground/20 bg-background font-bold">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Staff Members" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl">
                <SelectItem value="all" className="rounded-xl">All Staff Members</SelectItem>
                {/* We'll use a separate query or hardcoded list if uniqueEmployees is not available from current result */}
                {/* For now, just show current if any */}
                {orders?.map((o: any) => o.employeeId).filter((v: any, i: number, a: any[]) => a.findIndex(t => t?._id === v?._id) === i).map((emp: any) => emp && (
                  <SelectItem key={emp._id} value={emp._id} className="rounded-xl">{emp.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-muted">
                <TableHead className="w-[60px] pl-6">
                  <Checkbox 
                    checked={selectedOrders.length > 0 && selectedOrders.length === orders.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[120px] font-black uppercase tracking-widest text-[10px]">Reference</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Customer</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Phone</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Agent</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Revenue</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Date & Time</TableHead>
                <TableHead className="text-right font-black uppercase tracking-widest text-[10px] pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1,2,3,4,5].map(i => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}><Skeleton className="h-12 w-full rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : orders.map((order: any) => (
                <TableRow key={order._id} className={`group border-muted hover:bg-muted/20 transition-colors ${selectedOrders.includes(order._id) ? 'bg-primary/5' : ''}`}>
                  <TableCell className="pl-6">
                    <Checkbox 
                      checked={selectedOrders.includes(order._id)}
                      onCheckedChange={() => toggleSelect(order._id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-[11px] font-black text-primary uppercase tracking-tighter">
                    #{order._id.slice(-8)}
                  </TableCell>
                  <TableCell className="font-bold text-sm">{order.customerName}</TableCell>
                  <TableCell className="text-sm">{order.customerPhone}</TableCell>
                  <TableCell className="font-bold text-sm">
                    <div className="flex flex-col">
                      <span>{order.employeeId?.email?.split('@')[0]}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">{order.employeeId?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.deliveryStatus} />
                  </TableCell>
                  <TableCell className="font-black text-sm">৳{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-primary/10 hover:text-primary">
                        <Link href={`/orders/${order._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(order._id)}
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
          
          {(!isLoading && orders.length === 0) && (
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-4 opacity-30 grayscale">
              <Package className="w-20 h-20" />
              <p className="font-black uppercase tracking-widest text-sm">No transactions found</p>
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
