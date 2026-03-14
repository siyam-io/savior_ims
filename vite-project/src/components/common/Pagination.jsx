import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ meta, onPageChange, accentColor = "red" }) => {
  if (!meta || meta.totalPages <= 1) return null;

  const activeText = accentColor === 'red' 
    ? 'text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' 
    : 'text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
    
  const hoverClass = accentColor === 'red' 
    ? 'hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400' 
    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400';

  return (
    <div className="px-8 py-6 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between rounded-b-[40px] transition-colors duration-300">
      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">
        Showing {meta.total > 0 ? meta.page * 1 : 0} of {meta.total} results
      </p>
      
      <div className="flex items-center gap-3">
        <button 
          disabled={meta.page === 1} 
          onClick={() => onPageChange(meta.page - 1)}
          className={`p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 shadow-sm disabled:opacity-30 ${hoverClass} transition-all`}
        >
          <ChevronLeft size={18}/>
        </button>
        
        <div className="flex items-center gap-2 mx-1">
          <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">Page</span>
          <span className={`text-xs font-black ${activeText} bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border transition-colors`}>
            {meta.page} / {meta.totalPages}
          </span>
        </div>

        <button 
          disabled={meta.page === meta.totalPages} 
          onClick={() => onPageChange(meta.page + 1)}
          className={`p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 shadow-sm disabled:opacity-30 ${hoverClass} transition-all`}
        >
          <ChevronRight size={18}/>
        </button>
      </div>
    </div>
  );
};

export default Pagination;