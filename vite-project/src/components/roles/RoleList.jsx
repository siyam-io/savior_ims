import React, { useState } from 'react';
import { useRoles, useDeleteRole } from '../../hooks/useRoles';
import { Link } from 'react-router-dom';
import FilterBar from '../common/FilterBar';
import Pagination from '../common/Pagination';
import { Shield, ShieldPlus, Edit, Trash2, Loader2, Fingerprint, Lock } from 'lucide-react';

const RoleList = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });
  const { data: response, isPending: isLoading } = useRoles(filters);
  const deleteRoleMutation = useDeleteRole();

  const roles = response?.data || []; 
  const meta = response?.meta || { page: 1, totalPages: 1 };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: field === 'page' ? value : 1 }));
  };

  if (isLoading) return <div className="p-40 flex justify-center"><Loader2 className="animate-spin text-orange-600" size={48} /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter transition-colors">
          <Shield className="text-orange-600 dark:text-orange-500" size={32} /> Access Control
        </h1>
        <Link to="/roles/new" className="bg-gray-900 dark:bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase hover:bg-orange-600 dark:hover:bg-orange-700 transition-all shadow-lg dark:shadow-none">
          <ShieldPlus size={18} /> Define New Role
        </Link>
      </div>

      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() => setFilters({ page: 1, limit: 10, search: '' })}
        showCategory={false}
        accentColor="orange"
        searchPlaceholder="Search roles..."
      />

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800/80">
          <thead className="bg-gray-50/50 dark:bg-slate-950/50 transition-colors">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Role Definition</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Permissions</th>
              <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Level</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
            {roles.map((role) => (
              <tr key={role._id} className="hover:bg-orange-50/20 dark:hover:bg-slate-800/30 transition-all group">
                <td className="px-8 py-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-500 transition-colors">
                    <Fingerprint size={20} />
                  </div>
                  <div className="font-black text-gray-900 dark:text-white uppercase text-sm transition-colors">{role.name}</div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-1 flex-wrap">
                    {role.permissions?.slice(0, 3).map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-[9px] font-black text-gray-500 dark:text-gray-400 rounded uppercase transition-colors">
                        {typeof p === 'object' ? p.name : p}
                      </span>
                    ))}
                    {role.permissions?.length > 3 && (
                      <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 self-center ml-1">
                        +{role.permissions.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <Lock size={16} className={role.name?.toLowerCase().includes('admin') ? "text-red-500 dark:text-red-400 mx-auto" : "text-gray-200 dark:text-slate-600 mx-auto"} />
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/roles/${role._id}/edit`} className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => {
                        if (window.confirm('Are you sure you want to delete this role?')) {
                          deleteRoleMutation.mutate(role._id);
                        }
                      }} 
                      className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onPageChange={(p) => handleFilterChange('page', p)} accentColor="orange" />
      </div>
    </div>
  );
};

export default RoleList;