'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  Store,
  ShoppingCart,
  ListOrdered,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  Truck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'POS Terminal', href: '/pos', icon: ShoppingCart },
  { name: 'My Sales', href: '/orders/my', icon: ShoppingBag },
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'All Orders', href: '/orders', icon: ListOrdered, adminOnly: true },
  { name: 'Products', href: '/products', icon: Package, adminOnly: true },
  { name: 'Categories', href: '/categories', icon: Tags, adminOnly: true },
  { name: 'Outlets', href: '/outlets', icon: Store, adminOnly: true },
  { name: 'Employees', href: '/employees', icon: Users, adminOnly: true },
  { name: 'Couriers', href: '/couriers', icon: Truck, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setRole(JSON.parse(user).role);
      } catch (e) {
        console.error("User parsing error", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const filteredMenu = menuItems.filter(item => {
    if (!item.adminOnly) return true;
    if (!mounted) return false;
    return role === 'admin';
  });

  const NavContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64 border-r bg-background'}`}>
      <div className="p-6 flex items-center justify-between border-b bg-card/50">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Package className="w-6 h-6" />
          Savior IMS
        </h1>
        <ThemeToggle />
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenu.map((item) => {
          // 1. চেক করবে পাথ একদম হুবহু মিলে কি না
          // 2. অথবা চেক করবে এটি একটি সাব-রাউট কি না (যেমন /products/add) 
          // 3. কিন্তু যদি মেনুতে অন্য কোনো 'দীর্ঘতর' (more specific) পাথ থাকে যা বর্তমান পাথের সাথে মিলে, তবে এটি একটিভ হবে না।
          const isActive = pathname === item.href || (
            item.href !== '/' && 
            pathname.startsWith(item.href) && 
            !filteredMenu.some(m => m.href.length > item.href.length && pathname.startsWith(m.href))
          );

          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative ${
                isActive 
                  ? 'bg-[#0F0F0F] text-white shadow-xl scale-[1.02]' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="flex-1">{item.name}</span>
              
              {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start gap-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 shadow-sm z-30">
        <NavContent />
      </aside>

      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <NavContent mobile />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold">Savior IMS</h1>
        <div className="w-10" /> {/* Spacer to keep title centered */}
      </div>
    </>
  );
}