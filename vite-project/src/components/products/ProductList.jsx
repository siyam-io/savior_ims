import React, { useState } from 'react';
import { useProducts, useDeleteProduct } from '../../hooks/useProducts';
import { useCategories, useSubCategories } from '../../hooks/useCategories';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../constants/permissions';
import { Link } from 'react-router-dom';
import FilterBar from '../common/FilterBar';
import Pagination from '../common/Pagination';
import { PageHeader } from '../common/PageHeader';
import { SpinnerLoader, CardGridSkeleton } from '../common/LoadingState';
import { EmptyState, FilteredEmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';
import { Package, Eye, Edit, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

const ProductList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    category: '',
    subCategory: ''
  });

  const { data: response, isPending: isLoading, isError, error, refetch } = useProducts(filters);
  const { data: categories } = useCategories();
  const { data: subCategories } = useSubCategories();
  const { hasPermission } = usePermissions();
  
  const deleteMutation = useDeleteProduct();

  const products = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1, total: 0 };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [field]: value, 
      page: field === 'page' ? value : 1,
      ...(field === 'category' && { subCategory: '' }) 
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure? This product will be permanently removed from the catalog.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 20, search: '', category: '', subCategory: '' });
  };

  // Check if filters are active
  const hasActiveFilters = filters.search || filters.category || filters.subCategory;

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 transition-colors duration-300">
      
      {/* HEADER */}
      <PageHeader
        title="Central Catalog"
        subtitle="Manage your products and inventory visibility"
        icon={Package}
        color="blue"
        actionText="New Product"
        actionLink="/products/new"
      />

      {/* FILTERS */}
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleClearFilters}
        categories={categories?.data}
        subCategories={subCategories?.data}
        accentColor="blue"
      />

      {/* PRODUCT GRID */}
      {isLoading ? (
        <CardGridSkeleton count={6} columns={3} />
      ) : products.length === 0 ? (
        hasActiveFilters ? (
          <FilteredEmptyState 
            type="products" 
            color="blue" 
            onClearFilters={handleClearFilters}
          />
        ) : (
          <EmptyState 
            type="products"
            title="No Products Found"
            message="Get started by adding your first product to the catalog."
            actionText="Add Product"
            actionLink="/products/new"
            color="blue"
          />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all group relative">
              
              {/* Product Image Area */}
              <div className="aspect-[4/3] bg-gray-50 dark:bg-slate-800 relative overflow-hidden transition-colors">
                {product.image ? (
                  <img src={product.image} alt={product.productName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-slate-600">
                    <ImageIcon size={48} strokeWidth={1} />
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2">No Visual Available</span>
                  </div>
                )}
                
                <div className="absolute top-4 right-4">
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                    product.totalStock > 10 
                      ? 'bg-green-500 text-white dark:bg-green-900/80 dark:text-green-100' 
                      : 'bg-red-500 text-white dark:bg-red-900/80 dark:text-red-100'
                  }`}>
                    {product.totalStock} IN STOCK
                  </span>
                </div>
              </div>

              {/* Product Details Area */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg uppercase leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-[10px] font-bold text-gray-500 dark:text-gray-300 rounded uppercase transition-colors">
                      {product.category?.name}
                    </span>
                    <span className="text-gray-300 dark:text-slate-700">&bull;</span>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">
                      {product.subCategory?.name}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-slate-800 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Base Price</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white transition-colors">
                      ৳{product.price}
                    </span>
                  </div>
                  
                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <Link to={`/products/${product._id}`} 
                      className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                      <Eye size={18} />
                    </Link>
                    
                    {hasPermission(PERMISSIONS.EDIT_PRODUCT) && (
                      <Link to={`/products/${product._id}/edit`} 
                        className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                        <Edit size={18} />
                      </Link>
                    )}
                    
                    {hasPermission(PERMISSIONS.DELETE_PRODUCT) && (
                      <button 
                        onClick={() => handleDelete(product._id)}
                        disabled={deleteMutation.isPending}
                        className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {products.length > 0 && (
        <div className="flex justify-center pt-10">
          <Pagination meta={meta} onPageChange={(p) => handleFilterChange('page', p)} accentColor="blue" />
        </div>
      )}
    </div>
  );
};

export default ProductList;