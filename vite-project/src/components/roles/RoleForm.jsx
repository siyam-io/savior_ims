import React, { useState, useEffect } from 'react';
import { useRole, useUpdateRole, useCreateRole } from '../../hooks/useRoles';
import { useParams, useNavigate } from 'react-router-dom';
import { PERMISSION_MATRIX } from '../../constants/permissions';
import { 
  Shield, Save, ArrowLeft, Loader2, 
  CheckSquare, Square, ShieldCheck, Fingerprint
} from 'lucide-react';

const RoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const { data: roleResponse } = useRole(id);
  const updateRoleMutation = useUpdateRole();
  const createRoleMutation = useCreateRole();

  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (isEditMode && roleResponse?.data) {
      setName(roleResponse.data.name);
      setSelectedPermissions(roleResponse.data.permissions || []);
    }
  }, [isEditMode, roleResponse]);

  const togglePermission = (val) => {
    setSelectedPermissions(prev => 
      prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
    );
  };

  const toggleModule = (features) => {
    const featureValues = features.map(f => f.value);
    const allSelected = featureValues.every(v => selectedPermissions.includes(v));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !featureValues.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...featureValues])]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, permissions: selectedPermissions };
    const options = { onSuccess: () => navigate('/roles') };
    
    isEditMode 
      ? updateRoleMutation.mutate({ id, ...payload }, options) 
      : createRoleMutation.mutate(payload, options);
  };

  const isPending = updateRoleMutation.isPending || createRoleMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 transition-colors duration-300">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/roles')} 
        className="mb-8 flex items-center gap-2 text-gray-400 dark:text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-orange-600 dark:hover:text-orange-500 transition-all"
      >
        <ArrowLeft size={16} /> Back to Security Clearances
      </button>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* --- Header Section --- */}
        <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-10 bg-orange-600 dark:bg-orange-700 text-white flex flex-col md:flex-row items-center gap-8 transition-colors">
            <div className="w-24 h-24 rounded-[32px] bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Fingerprint size={44} />
            </div>
            <div className="flex-1 w-full space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">
                {isEditMode ? 'Modify Security Role' : 'Initialize New Access'}
              </h2>
              <div className="relative">
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Role Name (e.g. Inventory Manager)"
                  className="w-full bg-transparent border-b-2 border-white/20 px-0 py-2 text-xl font-bold text-white placeholder:text-white/40 focus:border-white outline-none transition-all"
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Security Protocol Identifier</p>
            </div>
          </div>

          {/* --- Matrix Body --- */}
          <div className="p-10 space-y-10 bg-gray-50/30 dark:bg-slate-950/30 transition-colors">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <ShieldCheck size={16} /> Authorization Matrix
              </h3>
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-4 py-1.5 rounded-full uppercase transition-colors">
                {selectedPermissions.length} Permissions Active
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {PERMISSION_MATRIX.map((module, idx) => {
                const moduleValues = module.features.map(f => f.value);
                const isAllSelected = moduleValues.every(v => selectedPermissions.includes(v));

                return (
                  <div key={idx} className="bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden hover:border-orange-200 dark:hover:border-orange-900/50 transition-all group">
                    {/* Module Header */}
                    <div className="bg-gray-50/50 dark:bg-slate-800/50 px-10 py-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-wider">{module.moduleName}</h4>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">{module.page}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => toggleModule(module.features)}
                        className={`text-[9px] font-black uppercase px-6 py-2.5 rounded-full border transition-all ${
                          isAllSelected 
                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100 dark:shadow-none' 
                            : 'bg-white dark:bg-slate-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700/50'
                        }`}
                      >
                        {isAllSelected ? 'Revoke All' : 'Grant Full Module Access'}
                      </button>
                    </div>

                    {/* Features Grid */}
                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {module.features.map((feature) => {
                        const isActive = selectedPermissions.includes(feature.value);
                        return (
                          <button
                            key={feature.value}
                            type="button"
                            onClick={() => togglePermission(feature.value)}
                            className={`flex items-center gap-4 p-5 rounded-[24px] border-2 text-left transition-all group/btn ${
                              isActive 
                                ? 'border-orange-600 bg-orange-50/30 dark:bg-orange-900/10' 
                                : 'border-gray-50 dark:border-slate-800/50 bg-gray-50/20 dark:bg-slate-800/20 hover:border-gray-100 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className={`shrink-0 transition-transform group-active/btn:scale-75 ${
                              isActive ? 'text-orange-600 dark:text-orange-500' : 'text-gray-200 dark:text-slate-600'
                            }`}>
                              {isActive ? <CheckSquare size={24} fill="currentColor" className="text-orange-50 dark:text-slate-900" /> : <Square size={24} />}
                            </div>
                            <span className={`text-[11px] font-black uppercase leading-tight tracking-tight ${
                              isActive ? 'text-orange-900 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {feature.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- Submission Action --- */}
        <div className="sticky bottom-10 flex justify-center pt-6">
          <button 
            type="submit" disabled={isPending}
            className="bg-gray-900 dark:bg-orange-600 text-white px-16 py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 dark:hover:bg-orange-700 transition-all shadow-2xl hover:shadow-orange-200 dark:shadow-none active:scale-95 flex items-center gap-4 disabled:opacity-70"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isEditMode ? 'Commit Matrix Changes' : 'Deploy Security Protocol'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;