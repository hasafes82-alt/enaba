export function LawyerGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="جارٍ التحميل">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-border" />
            <div className="h-5 w-14 animate-pulse rounded-full bg-border" />
          </div>
          <div className="h-3 w-40 animate-pulse rounded bg-border" />
          <div className="h-3 w-full animate-pulse rounded bg-border" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-border" />
          <div className="mt-1 flex gap-2">
            <div className="h-10 flex-1 animate-pulse rounded-lg bg-border" />
            <div className="h-10 flex-1 animate-pulse rounded-lg bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
