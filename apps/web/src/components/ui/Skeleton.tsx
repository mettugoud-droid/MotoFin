export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] ${className}`}
    />
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-5 w-48" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-5 w-32 mt-4" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-14 rounded-xl mt-4" />
    </div>
  );
}
