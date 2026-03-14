import React from 'react';
import { Loader2, Package, Users, ShoppingCart, Tags, Ruler, Store, Shield } from 'lucide-react';

// Spinner Loader
export const SpinnerLoader = ({ size = 40, color = "blue", text = "Loading..." }) => {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-500",
    red: "text-red-600 dark:text-red-500",
    purple: "text-purple-600 dark:text-purple-500",
    orange: "text-orange-600 dark:text-orange-500",
    green: "text-green-600 dark:text-green-500",
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      <Loader2 className={`animate-spin ${colorClasses[color] || colorClasses.blue}`} size={size} />
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse text-sm">{text}</p>
    </div>
  );
};

// Full Page Loader
export const FullPageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">{text}</p>
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, hasImage = false, className = "p-5" }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={`grid grid-cols-12 gap-4 ${className} animate-pulse`}>
          {Array.from({ length: columns }).map((_, colIndex) => {
            // For image column (first column when hasImage is true)
            if (hasImage && colIndex === 0) {
              return (
                <div key={colIndex} className="col-span-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-slate-800"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              );
            }
            
            // Calculate column span based on index for consistent layout
            let colSpan = "col-span-1";
            if (colIndex === 0) colSpan = "col-span-2";
            if (colIndex === 1) colSpan = "col-span-2";
            if (colIndex === 2) colSpan = "col-span-1";
            if (colIndex === 3) colSpan = "col-span-2";
            if (colIndex === 4) colSpan = "col-span-1";
            if (colIndex === 5) colSpan = "col-span-1";
            if (colIndex === 6) colSpan = "col-span-1";
            if (colIndex === 7) colSpan = "col-span-2";
            
            return (
              <div key={colIndex} className={`${colSpan}`}>
                <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded"></div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

// Card Grid Skeleton
export const CardGridSkeleton = ({ count = 6, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-gray-200 dark:bg-slate-800"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Page Header Skeleton
export const PageHeaderSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-gray-100 dark:border-slate-800 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
          <div>
            <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-64"></div>
          </div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-xl w-32"></div>
      </div>
    </div>
  );
};

// Add Chart Skeleton
export const ChartSkeleton = ({ type = 'doughnut', height = 'h-64' }) => {
  return (
    <div className={`${height} w-full flex items-center justify-center`}>
      <div className="relative w-48 h-48">
        {/* Doughnut chart skeleton */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-slate-800 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-900"></div>
        {type === 'doughnut' && (
          <div className="absolute inset-8 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

// Add Stats Card Skeleton (if not already present)
export const StatsCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
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
};
