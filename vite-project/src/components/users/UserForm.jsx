import React, { useState, useEffect } from 'react';
import { useUser, useUpdateUser, useCreateUser } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';
import { useVendors } from '../../hooks/useVendors';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, UserPlus, ArrowLeft, Loader2, Mail, User as UserIcon, Lock, Shield, Store, Check } from 'lucide-react';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: userResponse } = useUser(id);
  const { data: rolesResponse } = useRoles();
  const { data: vendorsResponse } = useVendors();
  
  const updateUserMutation = useUpdateUser();
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    vendors: [],
    status: 'active'
  });

  useEffect(() => {
    if (isEditMode && userResponse?.data) {
      const u = userResponse.data;
      setFormData({
        name: u.name || '',
        email: u.email || '',
        password: '', 
        role: u.role?._id || u.role || '',
        vendors: u.vendors?.map(v => v._id || v) || [],
        status: u.status || 'active'
      });
    }
  }, [isEditMode, userResponse]);

  const toggleVendor = (vendorId) => {
    setFormData(prev => ({
      ...prev,
      vendors: prev.vendors.includes(vendorId)
        ? prev.vendors.filter(id => id !== vendorId)
        : [...prev.vendors, vendorId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateUserMutation.mutate({ id, ...formData }, {
        onSuccess: () => navigate('/users'),
      });
    } else {
      createUserMutation.mutate(formData, {
        onSuccess: () => navigate('/users'),
      });
    }
  };

  const isPending = updateUserMutation.isPending || createUserMutation.isPending;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 transition-colors duration-300">
      <button onClick={() => navigate('/users')} className="mb-8 flex items-center gap-2 text-gray-400 dark:text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-purple-600 dark:hover:text-purple-500 transition-all">
        <ArrowLeft size={16} /> Back to Staff Directory
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header Section */}
        <div className="p-10 bg-purple-600 dark:bg-purple-700 text-white flex flex-col md:flex-row items-center gap-8 transition-colors">
          <div className="w-24 h-24 rounded-[32px] bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
            <UserIcon size={44} />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">
              {isEditMode ? 'Modify Staff Profile' : 'Register New Staff Member'}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Identity & Access Control Protocol</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side: Credentials */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-4">1. Account Credentials</h3>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" size={20} />
                  <input
                    type="text" required
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-transparent dark:border-slate-800 font-bold focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" size={20} />
                  <input
                    type="email" required
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-transparent dark:border-slate-800 font-bold focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {!isEditMode && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Initial Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" size={20} />
                    <input
                      type="password" required
                      placeholder="Min 6 characters"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-transparent dark:border-slate-800 font-bold focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Assigned Role</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" size={20} />
                  <select
                    required
                    className="w-full pl-12 pr-10 py-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white border border-transparent dark:border-slate-800 font-bold focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all outline-none appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="" className="text-gray-500">Select Security Role</option>
                    {rolesResponse?.data?.map(role => (
                      <option key={role._id} value={role._id} className="text-gray-900 dark:text-white">{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Vendor Access */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-4">2. Vendor Access Rights</h3>
            
            <div className="space-y-4">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Select one or more vendors this user will manage:</p>
              <div className="bg-gray-50/50 dark:bg-slate-950/30 rounded-[32px] p-6 h-[340px] overflow-y-auto border-2 border-dashed border-gray-100 dark:border-slate-800 custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">
                  {vendorsResponse?.data?.length > 0 ? (
                    vendorsResponse.data.map(vendor => (
                      <button
                        key={vendor._id}
                        type="button"
                        onClick={() => toggleVendor(vendor._id)}
                        className={`flex items-center justify-between p-5 rounded-2xl transition-all group/btn ${
                          formData.vendors.includes(vendor._id)
                            ? 'bg-purple-600 dark:bg-purple-600 text-white shadow-xl shadow-purple-200 dark:shadow-none ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-slate-900'
                            : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 hover:border-purple-200 dark:hover:border-purple-500/50 border-2 border-transparent shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Store size={18} className={formData.vendors.includes(vendor._id) ? 'text-white' : 'text-purple-300 dark:text-purple-500/50'} />
                          <span className="font-black text-xs uppercase tracking-tight">{vendor.name}</span>
                        </div>
                        {formData.vendors.includes(vendor._id) && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <Check size={14} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-slate-600 py-10">
                      <Store size={40} strokeWidth={1} className="mb-2" />
                      <p className="text-[10px] font-bold uppercase">No Vendors Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Button */}
          <div className="lg:col-span-2 pt-6 border-t border-gray-100 dark:border-slate-800">
            <button 
              type="submit" 
              disabled={isPending} 
              className="w-full py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-3 shadow-2xl bg-gray-900 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 disabled:opacity-50 active:scale-95 hover:shadow-purple-200 dark:hover:shadow-none"
            >
              {isPending ? <Loader2 size={20} className="animate-spin" /> : isEditMode ? <Save size={20} /> : <UserPlus size={20} />}
              {isEditMode ? 'Commit Account Changes' : 'Initialize Staff Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;