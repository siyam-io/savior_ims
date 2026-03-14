import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '../../hooks/useUsers'; 
import { Link } from 'react-router-dom';
import FilterBar from '../common/FilterBar';
import Pagination from '../common/Pagination';
import { 
  Users, UserPlus, Eye, Edit, Loader2, 
  Mail, ShieldCheck, Store, Trash2 
} from 'lucide-react';

const UserList = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '' });
  const { data: response, isPending: isLoading } = useUsers(filters);
  const deleteUserMutation = useDeleteUser(); 

  const users = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1 };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: field === 'page' ? value : 1 }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <div className="p-40 flex justify-center">
      <Loader2 className="animate-spin text-purple-600 dark:text-purple-500" size={48} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 transition-colors duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter transition-colors">
          <Users className="text-purple-600 dark:text-purple-500" size={32} /> User Directory
        </h1>
        <Link 
          to="/users/new" 
          className="bg-gray-900 dark:bg-purple-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase hover:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-lg dark:shadow-none active:scale-95"
        >
          <UserPlus size={18} /> New User
        </Link>
      </div>

      {/* FILTERS */}
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() => setFilters({ page: 1, limit: 10, search: '' })}
        showCategory={false}
        accentColor="purple"
        searchPlaceholder="Search by name or email..."
      />

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800/80">
            <thead className="bg-gray-50/50 dark:bg-slate-950/50 transition-colors">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Assigned Vendors</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-purple-50/20 dark:hover:bg-slate-800/40 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black border-2 border-white dark:border-slate-800 shadow-sm shrink-0 transition-colors">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight transition-colors">{user.name}</div>
                        <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck size={10} /> 
                          {typeof user.role === 'object' ? user.role.name : user.role || 'Member'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 transition-colors">
                      <Mail size={14} className="text-gray-300 dark:text-slate-600" /> {user.email}
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {user.vendors?.length > 0 ? (
                        user.vendors.map((vendor) => (
                          <span 
                            key={vendor._id} 
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[8px] font-black rounded uppercase tracking-tighter border border-gray-200 dark:border-slate-700 transition-colors"
                          >
                            <Store size={8} /> {vendor.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[8px] text-gray-300 dark:text-slate-600 font-bold uppercase italic tracking-widest">Global Access</span>
                      )}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase border ${
                      user.status === 'active' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30'
                    }`}>
                      {user.status || 'Active'}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/users/${user._id}`} 
                        className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all"
                      >
                        <Eye size={18}/>
                      </Link>
                      <Link 
                        to={`/users/${user._id}/edit`} 
                        className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all"
                      >
                        <Edit size={18}/>
                      </Link>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        disabled={deleteUserMutation.isPending}
                        className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all disabled:opacity-30"
                      >
                        {deleteUserMutation.isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18}/>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <Pagination 
          meta={meta} 
          onPageChange={(p) => handleFilterChange('page', p)} 
          accentColor="purple" 
        />
      </div>
    </div>
  );
};

export default UserList;