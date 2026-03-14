import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories, useCreateCategory, useCreateSubCategory } from '../../hooks/useCategories';
import { Tags, Loader2, Save, ArrowLeft } from 'lucide-react';

const CategoryForm = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('main'); // 'main' or 'sub'
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');

  const { data: categories } = useCategories();
  const createMainMutation = useCreateCategory();
  const createSubMutation = useCreateSubCategory();

  const mainCategories = categories?.data || [];
  const isPending = createMainMutation.isPending || createSubMutation.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'main') {
      createMainMutation.mutate({ name }, {
        onSuccess: () => navigate('/categories')
      });
    } else {
      if (!parentId) return alert("Please select a parent category");
      createSubMutation.mutate({ name, parentCategory: parentId }, {
        onSuccess: () => navigate('/categories')
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/categories')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Add Category</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="type" value="main" 
                  checked={type === 'main'} onChange={() => setType('main')} 
                  className="text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600"
                />
                <span className="text-sm text-gray-800 dark:text-gray-200">Main Category</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="type" value="sub" 
                  checked={type === 'sub'} onChange={() => setType('sub')} 
                  className="text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600"
                />
                <span className="text-sm text-gray-800 dark:text-gray-200">Sub-Category</span>
              </label>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tags size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="pl-10 block w-full rounded-lg bg-transparent border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white py-2.5 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder={type === 'main' ? "e.g. SHIRTS" : "e.g. Polo Shirts"}
              />
            </div>
          </div>

          {/* Parent Category Dropdown */}
          {type === 'sub' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent Category</label>
              <select
                required value={parentId} onChange={(e) => setParentId(e.target.value)}
                className="block w-full rounded-lg bg-transparent border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white py-2.5 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              >
                <option value="" className="text-gray-500">Select a main category...</option>
                {mainCategories.map(cat => (
                  <option key={cat._id} value={cat._id} className="text-gray-900 dark:text-white">{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 transition-colors">
            <button
              type="button" onClick={() => navigate('/categories')}
              className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isPending}
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 text-sm font-medium disabled:opacity-70 transition-colors shadow-sm"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;