import React from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeletonCard() {
  return (
    <div 
      className="group flex flex-col h-full border border-[#3D2B1F]/10 p-4 bg-[#FAF7F2] relative overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle shimmer gradient layer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#3D2B1F]/[0.03] to-transparent pointer-events-none" />

      {/* Image Skeleton with subtle inner badge & logo silhouette */}
      <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-[#3D2B1F]/5 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-[#3D2B1F]/10 flex items-center justify-center opacity-40">
          <div className="w-6 h-6 rounded-full bg-[#3D2B1F]/10 animate-pulse" />
        </div>
        {/* Subtle bottom line inside image */}
        <div className="absolute bottom-3 left-4 right-4 h-1 bg-[#3D2B1F]/5" />
      </div>

      {/* Details Skeleton */}
      <div className="flex flex-col flex-grow text-center items-center">
        {/* Title skeleton */}
        <div className="h-5 bg-[#3D2B1F]/10 w-4/5 mb-2.5 rounded-none animate-pulse" />
        <div className="h-3.5 bg-[#3D2B1F]/10 w-3/5 mb-3.5 rounded-none animate-pulse" />

        {/* Description line skeleton */}
        <div className="space-y-1.5 w-full px-2 mb-4">
          <div className="h-2.5 bg-[#3D2B1F]/5 w-full rounded-none animate-pulse" />
          <div className="h-2.5 bg-[#3D2B1F]/5 w-4/5 mx-auto rounded-none animate-pulse" />
        </div>

        {/* Price skeleton with warm accent tone */}
        <div className="mt-auto pt-2">
          <div className="h-4 bg-[#B48C44]/25 w-20 mx-auto rounded-none animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12" role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeletonCard key={`product-skeleton-${index}`} />
      ))}
      <span className="sr-only">Loading products...</span>
    </div>
  );
}
