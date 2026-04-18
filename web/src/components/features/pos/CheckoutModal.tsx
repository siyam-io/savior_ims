'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCouriers } from '@/hooks/useCouriers';
import { 
  User, 
  Phone, 
  MapPin, 
  Truck, 
  Tag, 
  ClipboardList, 
  Bike,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function CheckoutModal({ isOpen, onClose, totalAmount, onSubmit, isPending }: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [discount, setDiscount] = useState('0');
  const [courierId, setCourierId] = useState('');
  const [verificationCall, setVerificationCall] = useState<boolean>(false);
  
  const { data: couriers } = useCouriers();

  const discountValue = parseFloat(discount) || 0;
  const finalAmount = totalAmount - discountValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customerName,
      customerPhone,
      customerAddress,
      orderNote,
      riderNote,
      discount: discountValue,
      courierId: courierId || undefined,
      verificationCall,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
        <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-primary-foreground/80" />
                Finalize Order
              </DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-primary-foreground/70 font-bold text-xs uppercase tracking-widest">
              Review logistics and customer information
            </p>
          </div>
          {/* Abstract background elements */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
        </div>

        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit} id="checkout-form" className="p-8 space-y-8">
            {/* Customer Information Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <User className="h-3 w-3" /> Customer Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cust-name" className="text-xs font-bold ml-1">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="cust-name"
                      required 
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)} 
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-none focus:ring-primary"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cust-phone" className="text-xs font-bold ml-1">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="cust-phone"
                      required 
                      value={customerPhone} 
                      onChange={e => setCustomerPhone(e.target.value)} 
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-none focus:ring-primary"
                      placeholder="+880..."
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cust-addr" className="text-xs font-bold ml-1">Delivery Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                  <Textarea 
                    id="cust-addr"
                    required 
                    value={customerAddress} 
                    onChange={e => setCustomerAddress(e.target.value)} 
                    className="pl-10 min-h-[100px] rounded-2xl bg-muted/30 border-none focus:ring-primary pt-3"
                    placeholder="Enter complete shipping address..."
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-muted/50" />

            {/* Logistics & Payment Section */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Truck className="h-3 w-3" /> Logistics & Offers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold ml-1">Courier Service</Label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select 
                      value={courierId} 
                      onValueChange={setCourierId}
                      disabled={!couriers || couriers.length === 0}
                    >
                      <SelectTrigger className="pl-10 h-12 rounded-xl bg-muted/30 border-none focus:ring-primary shadow-none">
                        <SelectValue placeholder={!couriers || couriers.length === 0 ? "Loading couriers..." : "Select courier"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-muted shadow-2xl">
                        {couriers?.map(c => (
                          <SelectItem key={c._id} value={c._id} className="rounded-xl">
                            {c.name} (৳{c.charge})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-xs font-bold ml-1">Applied Discount (৳)</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="discount"
                      type="number" 
                      min="0" 
                      value={discount} 
                      onChange={e => setDiscount(e.target.value)} 
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-none focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="order-note" className="text-xs font-bold ml-1">Internal Note</Label>
                  <div className="relative">
                    <ClipboardList className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      id="order-note"
                      value={orderNote} 
                      onChange={e => setOrderNote(e.target.value)} 
                      className="pl-10 h-24 rounded-2xl bg-muted/30 border-none focus:ring-primary pt-2.5"
                      placeholder="Internal staff notes..."
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="rider-note" className="text-xs font-bold ml-1">Rider Instructions</Label>
                    <div className="relative">
                      <Bike className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea 
                        id="rider-note"
                        value={riderNote} 
                        onChange={e => setRiderNote(e.target.value)} 
                        className="pl-10 h-24 rounded-2xl bg-muted/30 border-none focus:ring-primary pt-2.5"
                        placeholder="Special instructions for rider..."
                      />
                    </div>
                  </div>
                  <div className="space-y-3 bg-muted/30 p-4 rounded-2xl border border-muted-foreground/10">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Verification Call Required?</Label>
                    <div className="flex gap-6 mt-1 ml-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="verification"
                          checked={verificationCall === true}
                          onChange={() => setVerificationCall(true)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                        <span className="text-xs font-bold group-hover:text-primary transition-colors">Yes, Call Now</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="verification"
                          checked={verificationCall === false}
                          onChange={() => setVerificationCall(false)}
                          className="w-4 h-4 accent-primary cursor-pointer"
                        />
                        <span className="text-xs font-bold group-hover:text-primary transition-colors">No (Default)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="p-8 bg-muted/20 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Final Payable Amount</p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-3xl font-black text-primary">৳{finalAmount.toLocaleString()}</span>
              {discountValue > 0 && (
                <BadgeCheck className="h-6 w-6 text-green-500" />
              )}
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 md:flex-none h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border-muted-foreground/20 active:scale-95 transition-all"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              form="checkout-form"
              disabled={isPending}
              className="flex-1 md:flex-none h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Checkout'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border border-green-500/20 ${className}`}>
      Discount Applied
    </div>
  );
}
