import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Users, ShoppingCart, Tags, Ruler, Store, 
  Shield, AlertCircle, Inbox, Plus, Search 
} from 'lucide-react';

const iconMap = {
  products: Package,
  users: Users,
  inventory: ShoppingCart,
  categories: Tags,
  sizes: Ruler,
  vendors: Store,
  roles: Shield,
  default: Inbox
};

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/30"
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-100 dark:border-red-900/30"
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-900/30"
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-900/30"
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-900/30"
  },
  gray: {
    bg: "bg-gray-50 dark:bg-slate-900/50",
    text: "text-gray-400 dark:text-slate-500",
    border: "border-gray-100 dark:border-slate-800"
  }
};

export const EmptyState = ({ 
  type = "default",
  title = "No items found",
  message = "Get started by creating your first item.",
  actionText = "Create New",
  actionLink = "#",
  onAction,
  icon: CustomIcon,
  color = "blue",
  showAction = true,
  filtered = false
}) => {
  const Icon = CustomIcon || iconMap[type] || iconMap.default;
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`
      bg-white dark:bg-slate-900 p-12 rounded-[32px] text-center 
      border-2 border-dashed ${colors.border} transition-colors
    `}>
      <div className={`inline-flex p-4 ${colors.bg} rounded-2xl mb-4`}>
        <Icon size={48} className={colors.text} strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {message}
      </p>
      
      {showAction && (
        filtered ? (
          <button
            onClick={onAction || (() => window.history.back())}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-slate-800 text-white rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 transition-all text-xs font-black uppercase tracking-widest shadow-lg"
          >
            <Search size={16} />
            Clear Filters
          </button>
        ) : (
          onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-all text-xs font-black uppercase tracking-widest shadow-lg"
            >
              <Plus size={16} />
              {actionText}
            </button>
          ) : (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-all text-xs font-black uppercase tracking-widest shadow-lg"
            >
              <Plus size={16} />
              {actionText}
            </Link>
          )
        )
      )}
    </div>
  );
};

// Table Empty State
export const TableEmptyState = ({ 
  colSpan = 5,
  message = "No data available",
  icon: Icon = Inbox,
  color = "gray"
}) => {
  const colors = colorMap[color] || colorMap.gray;

  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center justify-center">
          <Icon size={48} className={colors.text} strokeWidth={1} />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
            {message}
          </p>
        </div>
      </td>
    </tr>
  );
};

// Filtered Empty State
export const FilteredEmptyState = ({ 
  onClearFilters,
  type = "default",
  color = "blue"
}) => {
  const Icon = iconMap[type] || iconMap.default;
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-800">
      <div className={`inline-flex p-3 ${colors.bg} rounded-xl mb-4`}>
        <Search size={32} className={colors.text} />
      </div>
      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No matching results</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Try adjusting your filters or search terms
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2.5 bg-gray-900 dark:bg-slate-800 text-white rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 transition-all text-xs font-black uppercase tracking-widest"
      >
        Clear All Filters
      </button>
    </div>
  );
};
