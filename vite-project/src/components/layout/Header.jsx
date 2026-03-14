import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Link } from 'react-router-dom'; // Link ইমপোর্ট করা হলো

const Header = ({ setIsOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = usePermissions();

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-500 lg:hidden hover:text-blue-600 transition-colors">
          <Menu size={24}/>
        </button>
        <h2 className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] hidden sm:block">Control Center</h2>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-inner"
        >
          {theme === 'dark' ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} />}
        </button>

        <div className="h-8 w-px bg-gray-100 dark:bg-slate-800 mx-2" />

        {/* 🔥 Profile Link */}
        <Link to="/profile" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[10px] font-bold text-blue-500 uppercase">{user?.role?.name || 'Loading...'}</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200 dark:shadow-none transition-transform group-hover:scale-105">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;