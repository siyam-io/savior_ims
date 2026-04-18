'use client';

import { useOrder, useUpdateOrderItems } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useCouriers } from '@/hooks/useCouriers';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  ArrowLeft, Package, User, Store, Calendar, CreditCard, Hash, ReceiptText, 
  MapPin, BadgeCheck, Edit, Save, X, Phone, Plus, Minus, Trash2, Home, Contact2, ShieldAlert, Loader2, Search, Truck, History, UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditableItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: order, isLoading, refetch } = useOrder(id as string);
  const { mutate: updateOrderItems, isPending } = useUpdateOrderItems();
  const { data: couriers } = useCouriers();
  const { data: products } = useProducts({});
  
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [discount, setDiscount] = useState(0);
  const [courierId, setCourierId] = useState('');
  const [verificationCall, setVerificationCall] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled'>('pending');
  
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    if (order) {
      setItems(order.items.map((item: any) => ({
        productId: item.productId?._id || '',
        productName: item.productId?.name || 'Unavailable',
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })));
      setCustomerName(order.customerName);
      setCustomerPhone(order.customerPhone);
      setCustomerAddress(order.customerAddress);
      setOrderNote(order.orderNote || '');
      setRiderNote(order.riderNote || '');
      setDiscount(order.discount || 0);
      setCourierId(typeof order.courierId === 'object' ? order.courierId?._id : (order.courierId || ''));
      setVerificationCall(order.verificationCall || false);
      setDeliveryStatus(order.deliveryStatus || 'pending');
    }
  }, [order]);

  const updateItemQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: newQty } : item));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItemToOrder = () => {
    if (!selectedProduct || !selectedSize) return;
    const existingIndex = items.findIndex(i => i.productId === selectedProduct._id && i.size === selectedSize);
    if (existingIndex !== -1) {
      updateItemQuantity(existingIndex, items[existingIndex].quantity + addQuantity);
    } else {
      setItems(prev => [...prev, {
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        size: selectedSize,
        quantity: addQuantity,
        unitPrice: selectedProduct.price,
      }]);
    }
    setAddProductOpen(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setAddQuantity(1);
    setProductSearch('');
  };

  const handleSave = () => {
    if (items.length === 0) {
      alert('Order must have at least one item');
      return;
    }
    const orderItems = items.map(item => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
    updateOrderItems({
      id: id as string,
      items: orderItems,
      discount,
      customerName,
      customerPhone,
      customerAddress,
      orderNote,
      riderNote,
      courierId: courierId || undefined,
      verificationCall,
      deliveryStatus,
    }, {
      onSuccess: () => {
        setIsEditing(false);
        refetch();
      },
      onError: (err: any) => alert(err.response?.data?.error || 'Update failed'),
    });
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const finalTotal = subtotal - discount;

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (isLoading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Fetching detailed invoice...</div>;
  if (!order) return <div className="p-12 text-center text-destructive font-black">Error: Order record not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground font-bold active:scale-95 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Ledger
        </Button>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/10 active:scale-95 transition-all px-6 bg-primary hover:bg-primary/90">
            <Edit className="h-4 w-4" />
            Full Order Management
          </Button>
        )}
      </div>

      <Card className="border-muted shadow-2xl shadow-foreground/5 bg-card/80 backdrop-blur-md overflow-hidden rounded-[2rem]">
        {/* Invoice Header */}
        <CardHeader className="p-8 md:p-12 border-b bg-muted/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                <ReceiptText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Tax Invoice</h1>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-[0.2em] bg-background/50 px-3 py-1.5 rounded-full border border-muted w-fit">
              <Hash className="w-3 h-3" />
              <span>Reference: {order._id}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="bg-background/80 p-5 px-8 rounded-3xl border border-muted shadow-sm flex flex-col items-center gap-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Delivery Status</p>
              <StatusBadge status={order.deliveryStatus} />
            </div>
          </div>
        </CardHeader>

        {/* Editable Info Grid */}
        <div className="p-8 md:p-12 border-b bg-card">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Contact2 className="w-3 h-3" /> Customer Profile
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name *</Label>
                    <Input value={customerName} onChange={e => setCustomerName(e.target.value)} className="h-12 rounded-xl bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Phone Number *</Label>
                    <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="h-12 rounded-xl bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Delivery Address *</Label>
                    <Textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} rows={3} className="rounded-2xl bg-muted/30 border-none pt-3" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Package className="w-3 h-3" /> Logistics & Preferences
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Delivery Status</Label>
                      <Select value={deliveryStatus} onValueChange={(val: any) => setDeliveryStatus(val)}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none shadow-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-2xl border-muted shadow-2xl">
                          <SelectItem value="pending" className="rounded-xl">Pending</SelectItem>
                          <SelectItem value="processing" className="rounded-xl">Processing</SelectItem>
                          <SelectItem value="shipped" className="rounded-xl">Shipped</SelectItem>
                          <SelectItem value="delivered" className="rounded-xl">Delivered</SelectItem>
                          <SelectItem value="returned" className="rounded-xl">Returned</SelectItem>
                          <SelectItem value="cancelled" className="rounded-xl">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Courier</Label>
                      <Select value={courierId} onValueChange={setCourierId}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none shadow-none"><SelectValue placeholder="Select courier" /></SelectTrigger>
                        <SelectContent className="rounded-2xl border-muted shadow-2xl">
                          <SelectItem value="" className="rounded-xl">None</SelectItem>
                          {couriers?.map(c => <SelectItem key={c._id} value={c._id} className="rounded-xl">{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Discount (৳)</Label>
                      <Input type="number" min="0" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="h-12 rounded-xl bg-muted/30 border-none" />
                    </div>
                    <div className="space-y-2 flex flex-col justify-end">
                      <div className="space-y-2 bg-muted/30 p-3 rounded-xl border border-muted-foreground/10">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Verification Call?</Label>
                        <div className="flex gap-4 mt-1 ml-1">
                          <label className="flex items-center gap-2 cursor-pointer group"><input type="radio" checked={verificationCall} onChange={() => setVerificationCall(true)} className="w-3 h-3 accent-primary cursor-pointer" /><span className="text-[10px] font-bold group-hover:text-primary transition-colors">Yes</span></label>
                          <label className="flex items-center gap-2 cursor-pointer group"><input type="radio" checked={!verificationCall} onChange={() => setVerificationCall(false)} className="w-3 h-3 accent-primary cursor-pointer" /><span className="text-[10px] font-bold group-hover:text-primary transition-colors">No</span></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Internal Note</Label>
                    <Textarea value={orderNote} onChange={e => setOrderNote(e.target.value)} rows={2} className="rounded-xl bg-muted/30 border-none pt-3" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Rider Instruction</Label>
                    <Textarea value={riderNote} onChange={e => setRiderNote(e.target.value)} rows={2} className="rounded-xl bg-muted/30 border-none pt-3" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><UserCheck className="w-3 h-3 text-primary" /> Originator</h3>
                  <p className="text-lg font-black leading-tight">{order.createdBy?.name || order.employeeId?.name || 'System'}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{order.createdBy?.role || 'Agent'}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> Service Point</h3>
                  <p className="text-lg font-black leading-tight">{order.outletId?.name}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><Calendar className="w-3 h-3 text-primary" /> Timestamp</h3>
                  <p className="text-lg font-black leading-tight">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <Separator className="bg-muted/50" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-3"><h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><Contact2 className="w-3 h-3 text-primary" /> Customer Name</h3><p className="text-lg font-black">{order.customerName}</p></div>
                <div className="space-y-3"><h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><Phone className="w-3 h-3 text-primary" /> Contact Number</h3><p className="text-lg font-black">{order.customerPhone}</p></div>
                <div className="space-y-3"><h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-primary" /> Verification Call</h3><Badge variant={order.verificationCall ? 'default' : 'outline'} className={`px-3 py-1 font-black text-[10px] uppercase tracking-widest ${order.verificationCall ? 'bg-orange-500' : 'text-muted-foreground'}`}>{order.verificationCall ? 'Required' : 'Not Required'}</Badge></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-3 md:col-span-2"><h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><Home className="w-3 h-3 text-primary" /> Delivery Address</h3><p className="text-sm font-bold text-muted-foreground leading-relaxed">{order.customerAddress}</p></div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2"><History className="w-3 h-3 text-primary" /> Audit Trail</h3>
                  <div className="space-y-2">
                    <p className="text-xs font-bold flex items-center gap-2">
                      <span className="text-[10px] uppercase text-muted-foreground">Last Edit:</span> 
                      {order.updatedBy?.name || 'Original state'}
                    </p>
                    {order.deliveryStatus === 'delivered' && order.deliveredAt && (
                      <p className="text-xs font-bold text-green-600 flex items-center gap-2">
                        <Truck className="w-3 h-3" /> 
                        {new Date(order.deliveredAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items Table Section */}
        <div className="p-8 md:p-12 bg-background/30">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <CreditCard className="w-3 h-3 text-primary" /> Manifest
            </h3>
            {isEditing && (
              <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 border-primary/20 text-primary hover:bg-primary/5">
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[2rem]">
                  <DialogHeader><DialogTitle className="text-2xl font-black tracking-tighter">Extend Manifest</DialogTitle></DialogHeader>
                  <div className="space-y-6 pt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search product name..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-10 h-12 rounded-xl bg-muted/30 border-none" />
                    </div>
                    <ScrollArea className="h-[300px] border rounded-2xl p-2 bg-muted/10">
                      <div className="space-y-1">
                        {filteredProducts?.map(p => (
                          <button key={p._id} onClick={() => setSelectedProduct(p)} className={`w-full text-left p-4 rounded-xl transition-all ${selectedProduct?._id === p._id ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-card'}`}>
                            <p className="font-black text-sm">{p.name}</p>
                            <p className="text-[10px] opacity-70">৳{p.price}</p>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                    {selectedProduct && (
                      <div className="space-y-4 animate-in slide-in-from-top-2">
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none shadow-none"><SelectValue placeholder="Select available size" /></SelectTrigger>
                          <SelectContent className="rounded-2xl border-muted shadow-2xl">
                            {selectedProduct.activatedSizes.map((s: string) => <SelectItem key={s} value={s} className="rounded-xl">{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center justify-between bg-muted/30 p-4 rounded-2xl">
                          <span className="text-sm font-black uppercase tracking-widest">Quantity</span>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => setAddQuantity(Math.max(1, addQuantity - 1))} className="rounded-full h-8 w-8"><Minus className="h-4 w-4" /></Button>
                            <span className="font-black text-lg w-6 text-center">{addQuantity}</span>
                            <Button variant="ghost" size="icon" onClick={() => setAddQuantity(addQuantity + 1)} className="rounded-full h-8 w-8"><Plus className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <Button onClick={addItemToOrder} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Add to Manifest</Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="border border-muted rounded-[1.5rem] overflow-hidden bg-card">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-muted">
                  <TableHead className="p-6 font-black uppercase tracking-widest text-[10px]">Specification</TableHead>
                  <TableHead className="p-6 text-center font-black uppercase tracking-widest text-[10px]">Size</TableHead>
                  <TableHead className="p-6 text-center font-black uppercase tracking-widest text-[10px]">Quantity</TableHead>
                  <TableHead className="p-6 text-right font-black uppercase tracking-widest text-[10px]">Unit Price</TableHead>
                  <TableHead className="p-6 text-right font-black uppercase tracking-widest text-[10px]">Net Total</TableHead>
                  {isEditing && <TableHead className="p-6 w-16"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx} className="border-muted hover:bg-muted/10 transition-colors">
                    <TableCell className="p-6">
                      <p className="font-black text-sm">{item.productName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-1">REF: {item.productId?.slice(-8).toUpperCase()}</p>
                    </TableCell>
                    <TableCell className="p-6 text-center">
                      <Badge variant="outline" className="px-3 py-1 font-black text-[10px] border-muted-foreground/20">{item.size}</Badge>
                    </TableCell>
                    <TableCell className="p-6 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-3">
                          <Button variant="outline" size="icon" onClick={() => updateItemQuantity(idx, item.quantity - 1)} className="h-7 w-7 rounded-full border-muted-foreground/20"><Minus className="h-3 w-3" /></Button>
                          <span className="w-6 font-black text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateItemQuantity(idx, item.quantity + 1)} className="h-7 w-7 rounded-full border-muted-foreground/20"><Plus className="h-3 w-3" /></Button>
                        </div>
                      ) : <span className="font-black text-sm">{item.quantity}</span>}
                    </TableCell>
                    <TableCell className="p-6 text-right text-sm font-medium">৳{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="p-6 text-right font-black text-sm text-primary">৳{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                    {isEditing && (
                      <TableCell className="p-6 text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-12 flex flex-col items-end space-y-4">
            <div className="flex gap-12 text-sm font-black text-muted-foreground uppercase tracking-widest px-6">
              <span>Manifest Subtotal</span>
              <span className="text-foreground">৳{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex gap-12 text-sm font-black text-green-600 uppercase tracking-widest px-6">
                <span>Adjustment (Discount)</span>
                <span>-৳{discount.toLocaleString()}</span>
              </div>
            )}
            <Separator className="w-64 bg-muted" />
            <div className="flex gap-12 items-end px-6">
              <span className="text-xl font-black uppercase tracking-widest text-primary">Final Balance</span>
              <span className="text-4xl font-black text-primary tracking-tighter">৳{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        {isEditing && (
          <div className="p-8 bg-muted/20 border-t flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
              <X className="w-4 h-4 mr-2" /> Cancel Changes
            </Button>
            <Button onClick={handleSave} disabled={isPending} className="h-12 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Commit Full Update</>}
            </Button>
          </div>
        )}

        {!isEditing && (
          <div className="p-12 pt-0 text-center opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Savior Management Systems • Secure Transaction Verified</p>
          </div>
        )}
      </Card>
    </div>
  );
}
