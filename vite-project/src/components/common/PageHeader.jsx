import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';

export const PageHeader = ({ 
  title,
  subtitle,
  icon: Icon,
  color = "blue",
  actionText,
  actionLink,
  onAction,
  backLink,
  onBack,
  children
}) => {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    red: "text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/30",
    purple: "text-purple-600 dark:text-purple-500 bg-purple-100 dark:bg-purple-900/30",
    orange: "text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-900/30",
    green: "text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/30"
  };

  const buttonColors = {
    blue: "hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    red: "hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    purple: "hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
    orange: "hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
    green: "hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        )}
        {backLink && (
          <Link
            to={backLink}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
        )}
        {Icon && (
          <div className={`p-3 ${colorClasses[color]} rounded-2xl transition-colors`}>
            <Icon size={28} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {children}
        
        {actionText && (onAction || actionLink) && (
          onAction ? (
            <button
              onClick={onAction}
              className={`bg-gray-900 dark:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest ${buttonColors[color]} transition-all shadow-lg`}
            >
              <Plus size={18} />
              {actionText}
            </button>
          ) : (
            <Link
              to={actionLink}
              className={`bg-gray-900 dark:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest ${buttonColors[color]} transition-all shadow-lg`}
            >
              <Plus size={18} />
              {actionText}
            </Link>
          )
        )}
      </div>
    </div>
  );
};
