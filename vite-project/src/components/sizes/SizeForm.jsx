import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSize, useUpdateSize, useCreateSize } from '../../hooks/useSizes';
import { Ruler, Save, Loader2, ArrowLeft } from 'lucide-react';

const SizeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [label, setLabel] = useState('');
  
  const { data: sizeData, isPending: isLoadingSize } = useSize(id);
  const updateSizeMutation = useUpdateSize();
  const createSizeMutation = useCreateSize();

  useEffect(() => {
    if (id && sizeData?.data) {
      setLabel(sizeData.data.label);
    }
  }, [id, sizeData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { label };
    
    if (id) {
      updateSizeMutation.mutate({ id, ...payload }, {
        onSuccess: () => navigate('/sizes'),
      });
    } else {
      createSizeMutation.mutate(payload, {
        onSuccess: () => navigate('/sizes'),
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/sizes')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{id ? 'Edit' : 'Add Universal'} Size</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 space-y-4 transition-colors">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size Label</label>
          <div className="relative">
            <Ruler className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="pl-10 block w-full bg-transparent text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-700 py-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="e.g. Small, Large, 42, 32"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">This size will be available for all products (Shirts, Pants, etc.)</p>
        </div>

        <button
          type="submit"
          disabled={createSizeMutation.isPending || updateSizeMutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-medium disabled:opacity-70 transition-colors shadow-sm"
        >
          {(createSizeMutation.isPending || updateSizeMutation.isPending) ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Universal Size
        </button>
      </form>
    </div>
  );
};

export default SizeForm;