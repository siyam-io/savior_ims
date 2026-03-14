import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useProduct } from '../../hooks/useProducts';
import { useProductInventoryLogs } from '../../hooks/useInventory';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: productData, isLoading: productLoading } = useProduct(id);
  const { data: logsData, isLoading: logsLoading } = useProductInventoryLogs(id);

  const product = productData?.data;
  const logs = logsData?.data || [];

  if (productLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#030712]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-[#030712] min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/products')}
          className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          {product.productName}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 transition-colors">
            {product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className="w-full aspect-square object-cover rounded-xl mb-4 border border-gray-100 dark:border-slate-800"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 dark:bg-slate-800 rounded-xl mb-4 flex items-center justify-center">
                 <Package size={48} className="text-gray-300 dark:text-slate-600" />
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">Price</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">৳{product.price}</p>
              </div>
              
              <div>
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">Fabric</p>
                <p className="font-bold text-gray-900 dark:text-gray-200">{product.fabric || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">Vendor</p>
                <p className="font-bold text-gray-900 dark:text-gray-200">{product.vendor?.name}</p>
              </div>
              
              <div>
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase">Category</p>
                <p className="font-bold text-gray-900 dark:text-gray-200">{product.category?.name}</p>
              </div>
            </div>

            {/* Current Stock */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-gray-900 dark:text-white mb-3">Current Stock</h3>
              <div className="space-y-2">
                {product?.inventory.map((item) => (
                  <div key={item?.size?._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{item?.size?.label}</span>
                    <span className="font-black text-gray-900 dark:text-white">{item?.quantity} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Logs */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-blue-600 dark:text-blue-500" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Inventory Movement History</h2>
            </div>

            {logsLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No inventory movements recorded for this product</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log._id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {log.type === 'in' ? (
                          <span className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <ArrowUpRight size={16} className="text-green-600 dark:text-green-400" />
                          </span>
                        ) : (
                          <span className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <ArrowDownLeft size={16} className="text-red-600 dark:text-red-400" />
                          </span>
                        )}
                        <span className={`text-sm font-black ${
                          log.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {log.type === 'in' ? '+' : '-'}{log.quantity} units
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy • hh:mm a')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mt-4">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg text-center">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Size</p>
                        <p className="font-black text-gray-900 dark:text-white">{log.size?.label}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg text-center">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Previous</p>
                        <p className="font-black text-gray-700 dark:text-gray-300">{log.previousStock}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg text-center">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">New</p>
                        <p className="font-black text-gray-900 dark:text-white">{log.newStock}</p>
                      </div>
                    </div>
                    
                    {log.note && (
                      <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-slate-800">
                        <span className="font-bold text-gray-700 dark:text-gray-300 mr-2">Note:</span> {log.note}
                      </p>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700/50 flex justify-end">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                         Executed by: <span className="text-gray-700 dark:text-gray-300">{log.user?.name || 'System'}</span>
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;