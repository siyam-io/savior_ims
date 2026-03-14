import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Download,
  RefreshCw,
  Package,
  User,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  X
} from 'lucide-react';
import { useInventoryLogs } from '../../hooks/useInventory';
import { useProducts } from '../../hooks/useProducts';
import { useVendors } from '../../hooks/useVendors';
import { useSizes } from '../../hooks/useSizes';
import Pagination from '../common/Pagination';
import { TableSkeleton } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { format } from 'date-fns';

const InventoryLogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    productId: '',
    sizeId: '',
    startDate: '',
    endDate: '',
    type: '',
    search: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const { data: logsData, isLoading, isError, error, refetch } = useInventoryLogs(filters, currentPage, limit);
  const { data: productsData } = useProducts({ limit: 100 });
  const { data: vendorsData } = useVendors();
  const { data: sizesData } = useSizes();

  const logs = logsData?.data || [];
  const meta = logsData?.meta || { total: 0, page: 1, totalPages: 1 };
  const products = productsData?.data || [];
  const sizes = sizesData?.data || [];

  const hasActiveFilters = filters.productId || filters.sizeId || filters.type || filters.search || filters.startDate || filters.endDate;

  const clearFilters = () => {
    setFilters({
      productId: '',
      sizeId: '',
      startDate: '',
      endDate: '',
      type: '',
      search: ''
    });
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const applyDateRange = () => {
    setFilters(prev => ({
      ...prev,
      startDate: dateRange.start,
      endDate: dateRange.end
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTypeBadge = (type) => {
    return type === 'in' 
      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50' 
      : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50';
  };

  const getTypeIcon = (type) => {
    return type === 'in' 
      ? <ArrowUpRight size={14} className="text-green-600 dark:text-green-400" />
      : <ArrowDownLeft size={14} className="text-red-600 dark:text-red-400" />;
  };

  const formatQuantity = (log) => {
    const sign = log.type === 'in' ? '+' : '-';
    return `${sign}${log.quantity}`;
  };

  // Table columns configuration
  const tableColumns = [
    { header: "Date & Time", width: "col-span-2" },
    { header: "Product", width: "col-span-2" },
    { header: "Size", width: "col-span-1" },
    { header: "Type", width: "col-span-2" },
    { header: "Qty", width: "col-span-1" },
    { header: "Prev", width: "col-span-1" },
    { header: "New", width: "col-span-1" },
    { header: "User", width: "col-span-2" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                Inventory Logs
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track all stock movements and adjustments
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-gray-600 dark:text-gray-300"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border transition-all ${
                showFilters 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter size={20} />
            </button>
            <button className="px-6 py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm">
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Movements</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{meta.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm">
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Stock In</p>
            <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">
              {logs.filter(l => l.type === 'in').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm">
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Stock Out</p>
            <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-2">
              {logs.filter(l => l.type === 'out').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm">
            <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Net Adjusted Qty</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">
              {logs.reduce((acc, l) => acc + l.quantity, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 mb-6 animate-in slide-in-from-top-4 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Filter Logs</h3>
            <button
              onClick={clearFilters}
              className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <X size={14} />
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2">PRODUCT</label>
              <select
                value={filters.productId}
                onChange={(e) => handleFilterChange('productId', e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              >
                <option value="">All Products</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2">SIZE</label>
              <select
                value={filters.sizeId}
                onChange={(e) => handleFilterChange('sizeId', e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              >
                <option value="">All Sizes</option>
                {sizes.map(size => (
                  <option key={size._id} value={size._id}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2">MOVEMENT TYPE</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              >
                <option value="">All Types</option>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2">DATE RANGE</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="flex-1 p-3 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="flex-1 p-3 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                />
                <button
                  onClick={applyDateRange}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-black shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search logs by product name, user, or note..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-4 pl-12 bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-5 bg-gray-50/80 dark:bg-slate-950/50 border-b border-gray-200 dark:border-slate-800 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
          {tableColumns.map((col, idx) => (
            <div key={idx} className={col.width}>
              {col.header}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100 dark:divide-slate-800/80">
          {isLoading ? (
            <TableSkeleton 
              rows={10} 
              columns={8}
              className="p-5"
            />
          ) : isError ? (
            <div className="p-16 text-center">
              <div className="inline-flex p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <Clock size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Error Loading Logs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {error?.message || 'Something went wrong'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-xs font-black uppercase tracking-widest"
              >
                Try Again
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-16">
              <EmptyState 
                type="inventory"
                title={hasActiveFilters ? "No matching logs found" : "No Inventory Logs"}
                message={hasActiveFilters 
                  ? "Try adjusting your filters to see more results" 
                  : "Inventory movements will appear here when stock is adjusted."}
                actionText={hasActiveFilters ? "Clear Filters" : undefined}
                onAction={hasActiveFilters ? clearFilters : undefined}
                color="blue"
                icon={Clock}
              />
            </div>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="grid grid-cols-12 gap-4 p-5 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors items-center">
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-200 truncate">
                      {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-6">
                    {format(new Date(log.createdAt), 'hh:mm a')}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-200 truncate" title={log.product?.productName}>
                      {log.product?.productName || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 font-black text-gray-700 dark:text-gray-300 rounded uppercase tracking-widest">
                    {log.size?.label || 'N/A'}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getTypeBadge(log.type)}`}>
                    {getTypeIcon(log.type)}
                    {log.type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                </div>
                
                <div className="col-span-1">
                  <span className={`text-sm font-black ${
                    log.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatQuantity(log)}
                  </span>
                </div>
                
                <div className="col-span-1">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{log.previousStock}</span>
                </div>
                
                <div className="col-span-1">
                  <span className="text-sm font-black text-gray-900 dark:text-white">{log.newStock}</span>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <User size={12} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-200 truncate">
                      {log.user?.name || 'System'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && meta && meta.totalPages > 1 && (
          <Pagination 
            meta={meta} 
            onPageChange={handlePageChange}
            accentColor="blue"
          />
        )}
      </div>

      {/* Results Summary */}
      {!isLoading && logs.length > 0 && (
        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-right">
          Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, meta.total)} of {meta.total} entries
        </div>
      )}
    </div>
  );
};

export default InventoryLogs;
