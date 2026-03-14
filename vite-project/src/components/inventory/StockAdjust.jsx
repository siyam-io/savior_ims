import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useUpdateInventory } from '../../hooks/useInventory';
import { useCategories, useSubCategories } from '../../hooks/useCategories';
import FilterBar from '../common/FilterBar';
import Pagination from '../common/Pagination';
import { TableSkeleton } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { 
  Loader2, ShoppingCart, X, MinusCircle, Image as ImageIcon, Package, ChevronDown 
} from 'lucide-react';

const StockAdjust = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    category: '',
    subCategory: ''
  });

  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [adjustment, setAdjustment] = useState({ sizeId: '', quantity: 1 });

  const { data: response, isPending: isLoading, isError, error, refetch } = useProducts(filters);
  const { data: categories } = useCategories();
  const { data: subCategories } = useSubCategories();
  const updateStockMutation = useUpdateInventory();

  const products = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };
  const hasActiveFilters = filters.search || filters.category || filters.subCategory;

  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const nextFilters = { ...prev, [field]: value };
      if (field !== 'page') nextFilters.page = 1;
      if (field === 'category') nextFilters.subCategory = '';
      return nextFilters;
    });
  };

  const handleSellProduct = (e) => {
    e.preventDefault();
    if (!adjustment.sizeId) return alert("Select a size first");

    const selectedSize = selectedProduct.inventory.find(inv => inv.size?._id === adjustment.sizeId);
    if (adjustment.quantity > selectedSize.quantity) {
      return alert(`Insufficient stock! ${selectedSize.label} only has ${selectedSize.quantity} left.`);
    }

    updateStockMutation.mutate({
      productId: selectedProduct._id,
      sizeId: adjustment.sizeId,
      quantity: Number(adjustment.quantity),
      type: 'out' 
    }, {
      onSuccess: () => {
        setSelectedProduct(null);
        setAdjustment({ sizeId: '', quantity: 1 });
      }
    });
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 20, search: '', category: '', subCategory: '' });
  };

  // Table columns configuration (desktop only)
  const tableColumns = [
    { header: "Product Details", width: "col-span-4" },
    { header: "Stock by Size", width: "col-span-3" },
    { header: "Global", width: "col-span-2 text-center" },
    { header: "Action", width: "col-span-3 text-right" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-6 sm:pb-10 px-3 sm:px-4 transition-colors duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3 uppercase tracking-tighter">
          <ShoppingCart className="text-red-600 dark:text-red-500" size={24} sm:size={32} /> Sales Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Real-time inventory deduction and sales tracking</p>
      </div>

      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleClearFilters}
        categories={categories?.data}
        subCategories={subCategories?.data}
        accentColor="red"
        searchPlaceholder="Name or fabric..."
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Table Header - hidden on mobile */}
        <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
          {tableColumns.map((col, idx) => (
            <div key={idx} className={`${col.width} ${col.width.includes('text-right') ? 'text-right' : col.width.includes('text-center') ? 'text-center' : 'text-left'}`}>
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                {col.header}
              </span>
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
          {isLoading ? (
            <TableSkeleton 
              rows={8} 
              columns={4}
              hasImage={true}
              className="p-4 sm:p-6"
            />
          ) : isError ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-flex p-3 sm:p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <Package size={24} sm:size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">Error Loading Products</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                {error?.message || 'Something went wrong'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-xs font-black uppercase tracking-widest"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 sm:p-16">
              <EmptyState 
                type="inventory"
                title={hasActiveFilters ? "No matching products" : "No Products Available"}
                message={hasActiveFilters 
                  ? "Try adjusting your filters to see more products" 
                  : "Add products to inventory before processing sales."}
                actionText={hasActiveFilters ? "Clear Filters" : "Add Product"}
                actionLink={hasActiveFilters ? undefined : "/products/new"}
                onAction={hasActiveFilters ? handleClearFilters : undefined}
                color="red"
                icon={Package}
              />
            </div>
          ) : (
            products.map((p) => (
              <div key={p._id} className="group">
                {/* Mobile Card Layout (visible on small screens) */}
                <div className="block sm:hidden p-4 space-y-3 hover:bg-red-50/20 dark:hover:bg-red-900/10 transition-all">
                  {/* Product header with image and details */}
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
                      {p.image ? (
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="m-auto mt-4 text-gray-200 dark:text-slate-600" size={24}/>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight mb-1 line-clamp-2">
                        {p.productName}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[8px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-black uppercase">
                          {p.category?.name}
                        </span>
                        <span className="text-[8px] text-gray-300 dark:text-slate-600 font-bold uppercase tracking-tighter">
                          {p.subCategory?.name}
                        </span>
                      </div>
                    </div>
                    {/* Global Stock Badge for mobile */}
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest inline-block ${
                        p.totalStock < 5 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'bg-gray-900 dark:bg-slate-700 text-white dark:text-gray-100'
                      }`}>
                        {p.totalStock} PCS
                      </span>
                    </div>
                  </div>

                  {/* Stock by Size */}
                  <div>
                    <div className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Sizes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.inventory?.map((inv) => (
                        <div key={inv.size?._id} className={`px-2.5 py-1 rounded-lg border text-[9px] font-black ${
                          inv.quantity <= 0 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-300 dark:text-red-400 border-red-50 dark:border-red-900/30' 
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700'
                        }`}>
                          {inv.size?.label}: {inv.quantity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sell Button */}
                  <button 
                    onClick={() => setSelectedProduct(p)}
                    disabled={p.totalStock <= 0}
                    className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-black text-xs uppercase hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all disabled:opacity-20 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <MinusCircle size={14} /> Sell Item
                  </button>
                </div>

                {/* Desktop Layout (visible on sm and up) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-6 hover:bg-red-50/20 dark:hover:bg-red-900/10 transition-all items-center">
                  {/* Product Details - col-span-4 */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <ImageIcon className="m-auto mt-4 text-gray-200 dark:text-slate-600" size={24}/>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight mb-1.5 line-clamp-1">
                          {p.productName}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-black uppercase">
                            {p.category?.name}
                          </span>
                          <span className="text-[9px] text-gray-300 dark:text-slate-600 font-bold uppercase tracking-tighter">
                            {p.subCategory?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock by Size - col-span-3 */}
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.inventory?.map((inv) => (
                        <div key={inv.size?._id} className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${
                          inv.quantity <= 0 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-300 dark:text-red-400 border-red-50 dark:border-red-900/30' 
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700'
                        }`}>
                          {inv.size?.label}: {inv.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Global Stock - col-span-2 text-center */}
                  <div className="col-span-2 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest inline-block ${
                      p.totalStock < 5 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-gray-900 dark:bg-slate-700 text-white dark:text-gray-100'
                    }`}>
                      {p.totalStock} PCS
                    </span>
                  </div>
                  
                  {/* Action - col-span-3 text-right */}
                  <div className="col-span-3 text-right">
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      disabled={p.totalStock <= 0}
                      className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all disabled:opacity-20 flex items-center gap-2 ml-auto active:scale-90"
                    >
                      <MinusCircle size={14} /> Sell Item
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <Pagination meta={meta} onPageChange={(p) => handleFilterChange('page', p)} accentColor="red" />
        )}
      </div>

      {/* SELL MODAL - fully responsive */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-900/80 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[48px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-transparent dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 sm:p-10 bg-red-600 dark:bg-red-700 text-white relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 hover:bg-white/20 rounded-full transition-all">
                <X size={20}/>
              </button>
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/20 overflow-hidden border border-white/30 backdrop-blur-md flex-shrink-0">
                  {selectedProduct.image ? <img src={selectedProduct.image} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto mt-5 sm:mt-6 text-white/50" size={24} sm:size={32}/>}
                </div>
                <div>
                  <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tighter leading-tight line-clamp-2">{selectedProduct.productName}</h3>
                  <p className="text-[8px] sm:text-[10px] opacity-70 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1">Stock Out Authorization</p>
                </div>
              </div>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSellProduct} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4 ml-1">1. Select Size Variant</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedProduct.inventory.map((inv) => (
                    <button
                      key={inv.size?._id}
                      type="button"
                      disabled={inv.quantity <= 0}
                      onClick={() => setAdjustment({ ...adjustment, sizeId: inv.size?._id })}
                      className={`py-3 sm:py-4 rounded-xl sm:rounded-[20px] border-2 text-[10px] sm:text-[11px] font-black transition-all flex flex-col items-center disabled:opacity-30 ${
                        adjustment.sizeId === inv.size?._id 
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 shadow-inner' 
                          : 'border-gray-50 dark:border-slate-800 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-slate-700'
                      }`}
                    >
                      {inv.size?.label}
                      <span className="text-[8px] sm:text-[9px] opacity-60 mt-1 font-bold">Qty: {inv.quantity}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 sm:mb-4 ml-1">2. Quantity to Deduct</label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-950/50 p-2 sm:p-3 rounded-xl sm:rounded-[24px] border border-gray-100 dark:border-slate-800 transition-colors">
                   <button type="button" onClick={() => setAdjustment(a => ({...a, quantity: Math.max(1, a.quantity - 1)}))} className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl sm:rounded-2xl shadow-sm font-black text-lg sm:text-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/40 transition-all active:scale-90 border border-transparent dark:border-slate-700">-</button>
                   <input type="number" min="1" value={adjustment.quantity} onChange={(e) => setAdjustment({ ...adjustment, quantity: Number(e.target.value) })} className="bg-transparent text-gray-900 dark:text-white text-center font-black text-2xl sm:text-3xl outline-none w-16 sm:w-20" />
                   <button type="button" onClick={() => setAdjustment(a => ({...a, quantity: a.quantity + 1}))} className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl sm:rounded-2xl shadow-sm font-black text-lg sm:text-xl hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/40 transition-all active:scale-90 border border-transparent dark:border-slate-700">+</button>
                </div>
              </div>

              <button type="submit" disabled={updateStockMutation.isPending || !adjustment.sizeId} className="w-full py-4 sm:py-5 rounded-xl sm:rounded-[24px] font-black text-xs uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-3 shadow-2xl bg-gray-900 dark:bg-blue-600 hover:bg-red-600 dark:hover:bg-red-600 disabled:opacity-50 active:scale-95">
                {updateStockMutation.isPending ? <Loader2 size={16} sm:size={18} className="animate-spin" /> : <MinusCircle size={16} sm:size={18} />}
                Confirm Dispatch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAdjust;