export function RequestBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="جارٍ التحميل">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
          <div className="h-4 w-36 animate-pulse rounded bg-border" />
          <div className="h-3 w-24 animate-pulse rounded bg-border" />
          <div className="h-3 w-28 animate-pulse rounded bg-border" />
          <div className="h-3 w-full animate-pulse rounded bg-border" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-border" />
        </div>
      ))}
    </div>
  );
}
