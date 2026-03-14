import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendor, useUpdateVendor, useCreateVendor } from '../../hooks/useVendors';
import { Store, Mail, Save, Loader2, ArrowLeft } from 'lucide-react';

const VendorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const { data: vendorData, isPending: isLoadingVendor } = useVendor(id);
  const updateMutation = useUpdateVendor();
  const createMutation = useCreateVendor();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isEditMode && vendorData?.data) {
      setName(vendorData.data.name);
      setEmail(vendorData.data.contactEmail);
    }
  }, [isEditMode, vendorData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, contactEmail: email };
    
    if (isEditMode) {
      updateMutation.mutate({ id, ...payload }, {
        onSuccess: () => navigate('/vendors'),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate('/vendors'),
      });
    }
  };

  const isPending = updateMutation.isPending || createMutation.isPending;

  if (isEditMode && isLoadingVendor) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={32} /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/vendors')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{isEditMode ? 'Edit Vendor' : 'Add Vendor'}</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Vendor Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="pl-10 block w-full bg-transparent text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-700 py-2.5 sm:text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600" 
                placeholder="Acme Corp" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Contact Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full bg-transparent text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-700 py-2.5 sm:text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600" 
                placeholder="contact@vendor.com" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-800 transition-colors">
            <button 
              type="button" 
              onClick={() => navigate('/vendors')} 
              className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending} 
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-sm"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorForm;