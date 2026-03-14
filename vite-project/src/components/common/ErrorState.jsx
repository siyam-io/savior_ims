import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ 
  error, 
  onRetry,
  title = "Something went wrong",
  color = "red"
}) => {
  const colorClasses = {
    red: {
      bg: "bg-red-50 dark:bg-red-900/10",
      border: "border-red-200 dark:border-red-900/30",
      text: "text-red-700 dark:text-red-400",
      icon: "text-red-500 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/10",
      border: "border-orange-200 dark:border-orange-900/30",
      text: "text-orange-700 dark:text-orange-400",
      icon: "text-orange-500 dark:text-orange-400",
      button: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800"
    }
  };

  const colors = colorClasses[color] || colorClasses.red;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-2xl p-8 my-4`}>
      <div className="flex flex-col items-center text-center">
        <AlertCircle className={colors.icon} size={48} strokeWidth={1.5} />
        <h3 className={`text-lg font-black mt-4 ${colors.text}`}>{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md">
          {error?.response?.data?.message || error?.message || "An unexpected error occurred"}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`mt-6 px-6 py-3 ${colors.button} text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all`}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
