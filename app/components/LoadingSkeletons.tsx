import React from 'react'

export const LoadingSkeletons = {
  // VTU Page Skeleton
  VTUPage: () => (
    <div className="animate-pulse space-y-8">
      {/* Hero Skeleton */}
      <div className="text-center space-y-4">
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mx-auto" />
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto" />
      </div>

      {/* Form Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 space-y-6">
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1"
            />
          ))}
        </div>
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  ),

  // Blog Card Skeleton
  BlogCard: () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  ),

  // Generic Card Skeleton
  Card: () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  ),

  // List Skeleton
  List: ({ items = 3 }: { items?: number }) => (
    <div className="space-y-4">
      {[...Array(items)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
}
