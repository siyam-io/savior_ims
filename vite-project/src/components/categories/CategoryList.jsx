import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCategories, useDeleteCategory, useSubCategories, useDeleteSubCategory } from '../../hooks/useCategories';
import { Tags, Plus, Trash2, Loader2, Layers, ChevronRight } from 'lucide-react';

const CategoryList = () => {
  const [activeTab, setActiveTab] = useState('main');

  const { data: categories, isPending: isLoadingMain } = useCategories();
  const { data: subCategories, isPending: isLoadingSub } = useSubCategories();
  
  const deleteMainMutation = useDeleteCategory();
  const deleteSubMutation = useDeleteSubCategory();

  const groupedSubCategories = useMemo(() => {
    const subData = subCategories?.data || [];
    return subData.reduce((acc, sub) => {
      const parentName = sub.parentCategory?.name || 'Uncategorized';
      if (!acc[parentName]) acc[parentName] = [];
      acc[parentName].push(sub);
      return acc;
    }, {});
  }, [subCategories]);

  const handleDeleteMain = (id) => {
    if (window.confirm('Delete this main category? (This will NOT delete sub-categories but they will become orphaned)')) {
      deleteMainMutation.mutate(id);
    }
  };

  const handleDeleteSub = (id) => {
    if (window.confirm('Delete this sub-category?')) {
      deleteSubMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl transition-colors">
            <Tags size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Taxonomy Control</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Structure your product hierarchy</p>
          </div>
        </div>
        <Link
          to="/categories/new"
          className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-200 dark:shadow-none"
        >
          <Plus size={16} /> New Entry
        </Link>
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-slate-900/50 p-1.5 rounded-xl w-fit border border-transparent dark:border-slate-800">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'main' 
              ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Tags size={14} /> Main
        </button>
        <button
          onClick={() => setActiveTab('sub')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
            activeTab === 'sub' 
              ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Layers size={14} /> Sub-Categories
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <table className="min-w-full">
          <thead className="bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800 transition-colors">
            <tr>
              <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                {activeTab === 'main' ? 'Category Name' : 'Hierarchy & Label'}
              </th>
              <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/80">
            {activeTab === 'main' ? (
              isLoadingMain ? (
                <tr><td colSpan="2" className="py-20"><Loader2 className="mx-auto animate-spin text-blue-600" size={32} /></td></tr>
              ) : (
                categories?.data?.map((cat) => (
                  <tr key={cat._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-bold text-gray-900 dark:text-white uppercase text-sm tracking-tight">{cat.name}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDeleteMain(cat._id)} 
                        className="p-2 text-gray-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              isLoadingSub ? (
                <tr><td colSpan="2" className="py-20"><Loader2 className="mx-auto animate-spin text-blue-600" size={32} /></td></tr>
              ) : (
                Object.entries(groupedSubCategories).map(([parentName, items]) => (
                  <React.Fragment key={parentName}>
                    {/* Group Header Row */}
                    <tr className="bg-gray-50/80 dark:bg-slate-800/50 transition-colors">
                      <td colSpan="2" className="px-8 py-3 border-y border-gray-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                          <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            {parentName}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {/* Sub-Category Rows */}
                    {items.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-12 py-4">
                          <div className="flex items-center gap-3">
                            <ChevronRight size={14} className="text-gray-300 dark:text-slate-600" />
                            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{sub.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteSub(sub._id)} 
                            className="p-2 text-gray-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )
            )}
          </tbody>
        </table>
        
        {/* Empty State */}
        {((activeTab === 'main' && !isLoadingMain && categories?.data?.length === 0) || 
          (activeTab === 'sub' && !isLoadingSub && Object.keys(groupedSubCategories).length === 0)) && (
          <div className="py-20 text-center text-gray-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest">
            No Records Found
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;