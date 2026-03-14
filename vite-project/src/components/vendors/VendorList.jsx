import React from 'react';
import { Link } from 'react-router-dom';
import { useVendors, useDeleteVendor } from '../../hooks/useVendors';
import { Store, Plus, Edit, Trash2, Loader2, AlertCircle, Mail } from 'lucide-react';

const VendorList = () => {
  const { data: vendors, isPending: isLoading, isError, error } = useVendors();
  const deleteMutation = useDeleteVendor();

  const handleDelete = (id) => {
    if (window.confirm('Delete this vendor?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={32} /></div>;

  const vendorData = vendors?.data || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
            <Store size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Vendors</h1>
        </div>
        <Link 
          to="/vendors/new" 
          className="flex items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 shadow-sm text-sm font-medium transition-colors"
        >
          <Plus size={18} /> Add Vendor
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800/80">
          <thead className="bg-gray-50 dark:bg-slate-950/50 transition-colors">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800/50 bg-white dark:bg-slate-900 transition-colors">
            {vendorData.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <Store className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-600 mb-3" />
                  <p>No vendors found.</p>
                </td>
              </tr>
            ) : (
              vendorData.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{vendor.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 transition-colors">
                      <Mail size={12}/> {vendor.contactEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      vendor.status === 'active' 
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                        : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700'
                    } transition-colors`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/vendors/${vendor._id}/edit`} 
                        className="p-2 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(vendor._id)} 
                        disabled={deleteMutation.isPending} 
                        className="p-2 text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === vendor._id 
                          ? <Loader2 size={18} className="animate-spin text-red-600 dark:text-red-400" /> 
                          : <Trash2 size={18} />
                        }
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
  );
};

export default VendorList;