'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useOutlets } from '@/hooks/useOutlets';
import { usePlaceOrder } from '@/hooks/useOrders';
import { ShoppingBag, ShoppingCart, Loader2, Store, PackageX, Zap, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductCard } from '@/components/features/pos/ProductCard';
import { CartItem } from '@/components/features/pos/CartItem';
import { VariantDialog } from '@/components/features/pos/VariantDialog';
import { CheckoutModal } from '@/components/features/pos/CheckoutModal';
import { ProductSearchFilter } from '@/components/features/products/ProductSearchFilter';
import { Product, PlaceOrderInput } from '@/types';

interface CartItemType {
  productId: string;
  name: string;
  size: string;
  outletId: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export default function POSTerminal() {
  const [selectedOutlet, setSelectedOutlet] = useState<string>('');
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: outlets } = useOutlets();
  const { data: products, isLoading } = useProducts({ outletId: selectedOutlet });
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const availableOutlets = outlets || [];

  useEffect(() => {
    if (!selectedOutlet && availableOutlets.length > 0) {
      setSelectedOutlet(availableOutlets[0]._id);
    }
  }, [availableOutlets, selectedOutlet]);

  const openAddToCartModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const addToCart = (size: string) => {
    if (!selectedProduct || !size || !selectedOutlet) return;

    const stockEntry = selectedProduct.stock?.find(
      (s: any) => s.size === size
    );
    const availableStock = stockEntry ? stockEntry.quantity : 0;

    const existingQtyInCart = cart.find(
      item => item.productId === selectedProduct._id && item.size === size
    )?.quantity || 0;

    if (existingQtyInCart + 1 > availableStock) {
      alert('Insufficient stock available');
      return;
    }

    setCart(prev => {
      const existing = prev.find(
        item => item.productId === selectedProduct._id && item.size === size
      );
      if (existing) {
        return prev.map(item =>
          item.productId === selectedProduct._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: selectedProduct._id,
          name: selectedProduct.name,
          size,
          outletId: selectedOutlet,
          quantity: 1,
          unitPrice: selectedProduct.price,
          image: selectedProduct.visuals[0],
        },
      ];
    });
    setIsModalOpen(false);
  };

  const updateQuantity = (idx: number, delta: number) => {
    const item = cart[idx];
    if (delta > 0) {
      const product = products?.find(p => p._id === item.productId);
      const stockEntry = product?.stock?.find(
        (s: any) => s.size === item.size
      );
      if (item.quantity + 1 > (stockEntry?.quantity || 0)) {
        alert('Stock limit reached');
        return;
      }
    }

    setCart(prev => {
      const newCart = [...prev];
      const newQty = newCart[idx].quantity + delta;
      if (newQty <= 0) {
        newCart.splice(idx, 1);
      } else {
        newCart[idx].quantity = newQty;
      }
      return newCart;
    });
  };

  const removeItem = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCheckout = () => {
    if (cart.length === 0 || !selectedOutlet) return;
    setShowCheckoutModal(true);
  };

  const onCheckoutSubmit = (customerData: any) => {
    const orderItems = cart.map(item => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    const finalOrderData: PlaceOrderInput = {
      items: orderItems,
      outletId: selectedOutlet,
      ...customerData
    };

    placeOrder(
      finalOrderData,
      {
        onSuccess: () => {
          setCart([]);
          setShowCheckoutModal(false);
          alert('Order placed successfully!');
        },
        onError: (err: any) => {
          alert(err.response?.data?.error || 'Failed to place order');
        },
      }
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const CartContent = () => (
    <div className="flex flex-col h-full bg-background/80 backdrop-blur-xl">
      <div className="p-6 border-b flex items-center justify-between bg-muted/20">
        <div>
          <h2 className="text-xl font-black tracking-tight">Order Manifest</h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            {cart.length} items in bucket
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCart([])} 
          className="text-muted-foreground hover:text-destructive rounded-xl"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 opacity-20 grayscale">
              <ShoppingBag className="w-20 h-20 mb-4" />
              <p className="font-black uppercase tracking-widest text-sm">Bucket is Empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <CartItem 
                key={`${item.productId}-${item.size}`} 
                item={item} 
                onUpdateQty={(d) => updateQuantity(idx, d)} 
                onRemove={() => removeItem(idx)} 
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-6 bg-muted/30 border-t space-y-4">
        <div className="flex justify-between items-end px-2">
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payable Amount</span>
          <span className="text-3xl font-black text-primary tracking-tighter">৳{totalAmount.toLocaleString()}</span>
        </div>
        <Button 
          onClick={handleCheckout}
          disabled={cart.length === 0 || isPending}
          className="w-full h-14 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-all"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Order'}
        </Button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen lg:h-[calc(100vh-2rem)] bg-[#F8FAFC] dark:bg-background lg:m-4 lg:rounded-[2.5rem] lg:border lg:shadow-2xl overflow-hidden">
      {/* Refined Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-card/50 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="hidden sm:block text-left">
            <h1 className="text-lg font-black tracking-tight leading-none">Savior POS</h1>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Terminal V2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center bg-muted/50 p-1 rounded-2xl border">
             {availableOutlets.map(o => (
               <button 
                key={o._id}
                onClick={() => setSelectedOutlet(o._id)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${selectedOutlet === o._id ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
               >
                 {o.name}
               </button>
             ))}
           </div>
           
           {/* Mobile Outlet Select */}
           <div className="md:hidden">
             <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                <SelectTrigger className="rounded-xl font-bold bg-background h-10 border-muted-foreground/20">
                  <SelectValue placeholder="Outlet" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl">
                  {availableOutlets.map((outlet) => (
                    <SelectItem key={outlet._id} value={outlet._id} className="rounded-xl">{outlet.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>

           {/* Mobile Cart Trigger */}
           <Sheet>
              <SheetTrigger asChild>
                <Button className="lg:hidden h-10 w-10 rounded-xl relative p-0 shadow-lg shadow-primary/20">
                  <ShoppingBag className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-in zoom-in">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="p-0 w-full sm:max-w-md border-none">{CartContent()}</SheetContent>
           </Sheet>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Grid Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 no-scrollbar bg-muted/5">
          <ProductSearchFilter 
             outletId={selectedOutlet} 
             onAddToCart={openAddToCartModal}
          />
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[400px] border-l bg-card/30 backdrop-blur-sm shadow-2xl z-10">
          {CartContent()}
        </aside>
      </div>

      <VariantDialog
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={addToCart}
      />
      <CheckoutModal 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        totalAmount={totalAmount}
        onSubmit={onCheckoutSubmit}
        isPending={isPending}
      />
    </div>
  );
}
