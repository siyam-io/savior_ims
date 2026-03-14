import React, { useState, lazy, Suspense } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Eye,
  Edit,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  X,
  Loader2
} from 'lucide-react';
import { 
  useDashboardStats, 
  useBestSelling, 
  useWorstSelling, 
  useStockAnalysis, 
  useCategoryDistribution 
} from '../../hooks/useDashbord';
import { useVendors } from '../../hooks/useVendors';
import { useCategories } from '../../hooks/useCategories';
import { format } from 'date-fns';
import { 
  CardGridSkeleton, 
  TableSkeleton, 
  ChartSkeleton 
} from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';

// Lazy load Chart.js components to reduce initial bundle size
const Doughnut = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Doughnut })));

// ChartJS registration moved to a separate file or kept here
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('month');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: statsData, isLoading: statsLoading, isError: statsError, error: statsErrorData, refetch: refetchStats } = useDashboardStats({
    dateRange,
    vendorId: selectedVendor,
    categoryId: selectedCategory
  });

  const { data: bestSellingData, isLoading: bestSellingLoading, isError: bestSellingError } = useBestSelling({
    vendorId: selectedVendor,
    categoryId: selectedCategory
  }, 5);

  const { data: worstSellingData, isLoading: worstSellingLoading, isError: worstSellingError } = useWorstSelling({
    vendorId: selectedVendor,
    categoryId: selectedCategory
  }, 5);

  const { data: bestStockData, isLoading: bestStockLoading, isError: bestStockError } = useStockAnalysis('best-stock', {
    vendorId: selectedVendor,
    categoryId: selectedCategory
  });

  const { data: lowStockData, isLoading: lowStockLoading, isError: lowStockError } = useStockAnalysis('low-stock', {
    vendorId: selectedVendor,
    categoryId: selectedCategory
  });

  const { data: noStockData, isLoading: noStockLoading, isError: noStockError } = useStockAnalysis('no-stock', {
    vendorId: selectedVendor,
    categoryId: selectedCategory
  });

  const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useCategoryDistribution();

  const { data: vendorsData } = useVendors();
  const { data: categoriesData } = useCategories();

  const vendors = vendorsData?.data || [];
  const categories = categoriesData?.data || [];
  const stats = statsData?.data?.stats || {};
  const recentActivities = statsData?.data?.recentActivities || [];

  const hasActiveFilters = selectedVendor !== 'all' || selectedCategory !== 'all' || searchTerm;

  const categoryChartData = {
    labels: categoryData?.data?.map(item => item.name) || [],
    datasets: [
      {
        data: categoryData?.data?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  const handleClearFilters = () => {
    setSelectedVendor('all');
    setSelectedCategory('all');
    setSearchTerm('');
    setShowFilters(false);
  };

  // Stats Cards Skeleton
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 dark:bg-slate-800 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Alerts Skeleton
  const AlertsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-gray-200 dark:bg-slate-800 rounded"></div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Recent Activities Skeleton
  const ActivitiesSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-950/50 rounded-xl animate-pulse">
          <div className="w-6 h-6 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-800 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="w-16 h-5 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter transition-colors">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
              Welcome back! Here's what's happening with your inventory today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl border transition-all ${
                showFilters 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter size={18} />
            </button>

            <button 
              onClick={() => refetchStats()}
              className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-gray-600 dark:text-gray-300"
            >
              <RefreshCw size={18} />
            </button>

            <button className="px-4 py-2 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mt-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 animate-in slide-in-from-top-4 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2">VENDOR</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option value="all">All Vendors</option>
                  {vendors.map(v => (
                    <option key={v._id} value={v._id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2">CATEGORY</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 mb-2">SEARCH</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid - with skeleton loading */}
        {statsLoading ? (
          <StatsSkeleton />
        ) : statsError ? (
          <div className="mt-6">
            <ErrorState 
              error={statsErrorData} 
              onRetry={refetchStats}
              title="Failed to load dashboard stats"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Products</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{stats.totalProducts || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Package className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Stock</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{stats.totalStock?.toLocaleString() || 0}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <ShoppingCart className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Sales</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">৳{stats.totalSales?.toLocaleString() || 0}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <DollarSign className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Active Vendors</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{stats.totalVendors || 0}</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <BarChart3 className="text-orange-600 dark:text-orange-400" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-200 dark:border-orange-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-orange-600 dark:text-orange-500" size={20} />
                  <div>
                    <p className="text-xs font-black text-orange-800 dark:text-orange-500 uppercase">Low Stock Alert</p>
                    <p className="text-xl font-black text-orange-900 dark:text-orange-400">{stats.lowStockCount || 0} products</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="text-red-600 dark:text-red-500" size={20} />
                  <div>
                    <p className="text-xs font-black text-red-800 dark:text-red-500 uppercase">Out of Stock</p>
                    <p className="text-xl font-black text-red-900 dark:text-red-400">{stats.noStockCount || 0} products</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-blue-600 dark:text-blue-500" size={20} />
                  <div>
                    <p className="text-xs font-black text-blue-800 dark:text-blue-500 uppercase">Recent Activities</p>
                    <p className="text-xl font-black text-blue-900 dark:text-blue-400">{recentActivities.length} updates</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Grid for Chart & Recent Activities side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Category Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Category Distribution</h3>
            <PieChart size={18} className="text-gray-400 dark:text-gray-500" />
          </div>
          <div className="h-64">
            {categoryLoading ? (
              <ChartSkeleton type="doughnut" />
            ) : categoryError ? (
              <div className="h-full flex items-center justify-center text-red-500 dark:text-red-400">
                Failed to load chart
              </div>
            ) : categoryData?.data?.length > 0 ? (
              <Suspense fallback={<ChartSkeleton type="doughnut" />}>
                <Doughnut data={categoryChartData} options={chartOptions} />
              </Suspense>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                No category data
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 transition-colors shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">Recent Activities</h3>
          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 max-h-64 pr-2">
            {statsLoading ? (
              <ActivitiesSkeleton />
            ) : recentActivities.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-gray-500 py-10 h-full flex items-center justify-center">
                No recent activities
              </p>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-950/50 rounded-xl transition-colors">
                  {activity.type === 'in' ? (
                    <ArrowUpRight size={16} className="text-green-600 dark:text-green-500" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-600 dark:text-red-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {activity.product?.productName} - {activity.quantity} units
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.user?.name} • {format(new Date(activity.createdAt), 'MMM dd, hh:mm a')}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-full ${
                    activity.type === 'in' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {activity.type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-slate-800 overflow-x-auto custom-scrollbar pb-2">
        {['overview', 'best-selling', 'worst-selling', 'best-stock', 'low-stock', 'no-stock'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600 dark:border-blue-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Contents / Data Tables */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            <DataTable
              title="Best Selling Products"
              icon={<TrendingUp size={18} className="text-green-600 dark:text-green-500" />}
              products={bestSellingData?.data || []}
              loading={bestSellingLoading}
              error={bestSellingError}
              type="best-selling"
            />
            <DataTable
              title="Low Stock Alert"
              icon={<AlertTriangle size={18} className="text-orange-600 dark:text-orange-500" />}
              products={lowStockData?.data || []}
              loading={lowStockLoading}
              error={lowStockError}
              type="low-stock"
              warning={true}
            />
            <DataTable
              title="Out of Stock"
              icon={<Package size={18} className="text-red-600 dark:text-red-500" />}
              products={noStockData?.data || []}
              loading={noStockLoading}
              error={noStockError}
              type="no-stock"
              empty={true}
            />
          </>
        )}

        {activeTab === 'best-selling' && (
          <DataTable
            title="Best Selling Products"
            icon={<TrendingUp size={18} className="text-green-600 dark:text-green-500" />}
            products={bestSellingData?.data || []}
            loading={bestSellingLoading}
            error={bestSellingError}
            type="best-selling"
            fullWidth
          />
        )}

        {activeTab === 'worst-selling' && (
          <DataTable
            title="Worst Selling Products"
            icon={<TrendingDown size={18} className="text-red-600 dark:text-red-500" />}
            products={worstSellingData?.data || []}
            loading={worstSellingLoading}
            error={worstSellingError}
            type="worst-selling"
            fullWidth
          />
        )}

        {activeTab === 'best-stock' && (
          <DataTable
            title="Highest Stock Products"
            icon={<Package size={18} className="text-blue-600 dark:text-blue-500" />}
            products={bestStockData?.data || []}
            loading={bestStockLoading}
            error={bestStockError}
            type="best-stock"
            fullWidth
          />
        )}

        {activeTab === 'low-stock' && (
          <DataTable
            title="Low Stock Products"
            icon={<AlertTriangle size={18} className="text-orange-600 dark:text-orange-500" />}
            products={lowStockData?.data || []}
            loading={lowStockLoading}
            error={lowStockError}
            type="low-stock"
            warning={true}
            fullWidth
          />
        )}

        {activeTab === 'no-stock' && (
          <DataTable
            title="Out of Stock Products"
            icon={<Package size={18} className="text-red-600 dark:text-red-500" />}
            products={noStockData?.data || []}
            loading={noStockLoading}
            error={noStockError}
            type="no-stock"
            empty={true}
            fullWidth
          />
        )}
      </div>
    </div>
  );
};

// --- DATA TABLE SUB-COMPONENT --- //
const DataTable = ({ 
  title, 
  icon, 
  products, 
  loading,
  error,
  type,
  warning = false,
  empty = false,
  fullWidth = false
}) => {
  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600 dark:text-red-400';
    if (stock < 10) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStockBg = (stock) => {
    if (stock === 0) return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    if (stock < 10) return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
    return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
  };

  const calculateTotalStock = (product) => {
    if (product.totalStock) return product.totalStock;
    return product.inventory?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  };

  // Border logic based on warning/empty state
  let containerBorderClass = 'border-gray-200 dark:border-slate-800';
  let headerBorderClass = 'border-gray-100 dark:border-slate-800';
  let badgeClass = 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300';

  if (warning) {
    containerBorderClass = 'border-orange-200 dark:border-orange-900/30';
    headerBorderClass = 'border-orange-100 dark:border-orange-900/20';
    badgeClass = 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
  } else if (empty) {
    containerBorderClass = 'border-red-200 dark:border-red-900/30';
    headerBorderClass = 'border-red-100 dark:border-red-900/20';
    badgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }

  // Loading state - show table skeleton
  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${containerBorderClass} overflow-hidden shadow-sm transition-colors`}>
        <div className={`p-6 border-b ${headerBorderClass}`}>
          <div className="flex items-center gap-2">
            {icon}
            <div className="h-5 w-40 bg-gray-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
          </div>
        </div>
        <TableSkeleton 
          rows={5} 
          columns={type.includes('selling') ? 8 : 6}
          hasImage={true}
          className="p-4"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${containerBorderClass} overflow-hidden shadow-sm`}>
        <div className={`p-6 border-b ${headerBorderClass}`}>
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{title}</h3>
          </div>
        </div>
        <div className="p-12 text-center">
          <AlertTriangle size={32} className="mx-auto text-red-500 dark:text-red-400 mb-2" />
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Failed to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${containerBorderClass} overflow-hidden shadow-sm transition-colors`}>
      <div className={`p-6 border-b ${headerBorderClass} flex items-center justify-between transition-colors`}>
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{title}</h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${badgeClass}`}>
            {products.length} items
          </span>
        </div>
        <button className="text-[10px] uppercase tracking-widest font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          View All →
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-950/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Product</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Category</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Price</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Stock</th>
              {type.includes('selling') && (
                <>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Sold</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Revenue</th>
                </>
              )}
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Vendor</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
            {products.length === 0 ? (
              <tr>
                <td colSpan={type.includes('selling') ? 8 : 6} className="px-6 py-12 text-center">
                  <Package size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No products found</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const productData = product.product || product;
                const totalStock = calculateTotalStock(productData);
                const soldQuantity = product.totalSold || 0;
                const revenue = product.totalRevenue || 0;

                return (
                  <tr key={productData._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-slate-700">
                          {productData.image ? (
                            <img src={productData.image} alt={productData.productName} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-full h-full p-2 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{productData.productName}</p>
                          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{productData.fabric || 'No fabric'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded font-black uppercase tracking-widest">
                        {productData.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-900 dark:text-white">৳{productData.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${getStockColor(totalStock)}`}>
                          {totalStock}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStockBg(totalStock)}`}>
                          {totalStock === 0 ? 'Out' : totalStock < 10 ? 'Low' : 'Good'}
                        </span>
                      </div>
                    </td>
                    {type.includes('selling') && (
                      <>
                        <td className="px-6 py-4">
                          <span className="font-black text-gray-900 dark:text-white">{soldQuantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-gray-900 dark:text-white text-green-600 dark:text-green-400">৳{revenue.toLocaleString()}</span>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        {productData.vendor?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => window.location.href = `/products/${productData._id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => window.location.href = `/products/${productData._id}/edit`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => window.location.href = `/inventory/adjust/${productData._id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Adjust Stock"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
