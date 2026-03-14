import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onReset, 
  categories = [], 
  subCategories = [], 
  showCategory = true,
  searchPlaceholder = "Search...",
  accentColor = "red" // 'red' for sales, 'blue' for catalog
}) => {
  const activeSubCategories = subCategories.filter(
    sub => sub.parentCategory?._id === filters.category
  );

  const ringClass = accentColor === 'red' ? 'focus:ring-red-500' : 'focus:ring-blue-500';
  const iconClass = accentColor === 'red' ? 'group-focus-within:text-red-600 dark:group-focus-within:text-red-500' : 'group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500';
  const buttonClass = accentColor === 'red' ? 'hover:bg-red-600 dark:hover:bg-red-600' : 'hover:bg-blue-600 dark:hover:bg-blue-600';

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end transition-colors duration-300">
      {/* Search */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Live Search</label>
        <div className="relative group">
          <Search className={`absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 ${iconClass} transition-colors`} size={18} />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            className={`pl-12 w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-transparent dark:border-slate-800 py-3 text-sm font-bold focus:ring-2 ${ringClass} outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600`}
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {showCategory && (
        <>
          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Category</label>
            <select 
              className={`w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-transparent dark:border-slate-800 py-3 px-4 text-sm font-bold focus:ring-2 ${ringClass} outline-none transition-colors`}
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <option value="" className="text-gray-500">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id} className="text-gray-900 dark:text-white">{c.name}</option>)}
            </select>
          </div>

          {/* Sub-Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Sub-Category</label>
            <select 
              disabled={!filters.category}
              className={`w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-transparent dark:border-slate-800 py-3 px-4 text-sm font-bold focus:ring-2 ${ringClass} outline-none disabled:opacity-40 transition-all`}
              value={filters.subCategory}
              onChange={(e) => onFilterChange('subCategory', e.target.value)}
            >
              <option value="" className="text-gray-500">{filters.category ? "All Sub-Categories" : "Select Category First"}</option>
              {activeSubCategories.map(s => <option key={s._id} value={s._id} className="text-gray-900 dark:text-white">{s.name}</option>)}
            </select>
          </div>
        </>
      )}

      {/* Reset Button */}
      <button 
        onClick={onReset}
        className={`bg-gray-900 dark:bg-slate-800 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${buttonClass} transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none`}
      >
        <RotateCcw size={14} /> Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;