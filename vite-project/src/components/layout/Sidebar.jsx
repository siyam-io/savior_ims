import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../constants/permissions';
import { 
  LayoutDashboard, 
  X, 
  Package, 
  Tags, 
  Ruler, 
  Store, 
  Users, 
  ShieldCheck, 
  History, 
  ShoppingCart
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { hasPermission } = usePermissions();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/",
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    {
      title: "My Profile",
      icon: <Users size={18} />,
      path: "/profile",
    },
    {
      title: "Products",
      icon: <Package size={18} />,
      path: "/products",
      permission: PERMISSIONS.VIEW_PRODUCTS
    },
    {
      title: "Stock Adjust",
      icon: <ShoppingCart size={18} />,
      path: "/inventory",
      permission: PERMISSIONS.VIEW_INVENTORY
    },
    {
      title: "Inventory Logs",
      icon: <History size={18} />,
      path: "/inventory-logs",
      permission: PERMISSIONS.VIEW_INVENTORY
    },
    {
      title: "Categories",
      icon: <Tags size={18} />,
      path: "/categories",
      permission: PERMISSIONS.VIEW_CATEGORIES
    },
    {
      title: "Sizes",
      icon: <Ruler size={18} />,
      path: "/sizes",
      permission: PERMISSIONS.VIEW_SIZES
    },
    {
      title: "Vendors",
      icon: <Store size={18} />,
      path: "/vendors",
      permission: PERMISSIONS.VIEW_VENDORS
    },
    {
      title: "Staffs",
      icon: <Users size={18} />,
      path: "/users",
      permission: PERMISSIONS.VIEW_USERS
    },
    {
      title: "Roles & Access",
      icon: <ShieldCheck size={18} />,
      path: "/roles",
      permission: PERMISSIONS.VIEW_ROLES
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsOpen(false)} 
      />

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0f172a] border-r border-gray-100 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header/Logo */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                <LayoutDashboard className="text-white" size={22} />
              </div>
              <span className="font-black text-xl tracking-tighter text-gray-900 dark:text-white uppercase">Savior</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-red-500 transition-colors">
              <X size={20}/>
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              // পারমিশন না থাকলে দেখাবে না
              if (item.permission && !hasPermission(item.permission)) return null;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  <span className="opacity-80">{item.icon}</span>
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6">
             <div className="bg-gray-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-gray-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest text-center">Savior IMS v2.0</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;