import React from 'react';
import { Link } from 'react-router-dom';
import { useSizes, useDeleteSize } from '../../hooks/useSizes';
import { Ruler, Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';

const SizeList = () => {
  const { data: sizes, isPending: isLoading, isError, error } = useSizes();
  const deleteSizeMutation = useDeleteSize();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this size?')) {
      deleteSizeMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-500 animate-spin" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">Loading sizes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 my-4 transition-colors">
        <AlertCircle className="text-red-500 dark:text-red-400 mt-0.5" size={18} />
        <div className="text-sm text-red-700 dark:text-red-400">
          <p className="font-bold">Error loading sizes</p>
          <p>{error?.response?.data?.message || error.message}</p>
        </div>
      </div>
    );
  }

  const sizeData = sizes?.data || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
            <Ruler size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Universal Sizes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Global variants available for all products</p>
          </div>
        </div>
        <Link
          to="/sizes/new"
          className="flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-all shadow-sm text-sm font-medium"
        >
          <Plus size={18} />
          Add Size
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800/80">
            <thead className="bg-gray-50 dark:bg-slate-950/50 transition-colors">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size Label
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800/50 bg-white dark:bg-slate-900 transition-colors">
              {sizeData.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Ruler className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-600 mb-3" />
                    <p>No sizes found.</p>
                  </td>
                </tr>
              ) : (
                sizeData.map((size) => (
                  <tr key={size._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{size.label}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/sizes/${size._id}/edit`}
                          className="p-2 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(size._id)}
                          disabled={deleteSizeMutation.isPending}
                          className="p-2 text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                        >
                          {deleteSizeMutation.isPending && deleteSizeMutation.variables === size._id ? (
                            <Loader2 size={18} className="animate-spin text-red-600 dark:text-red-400" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeList;