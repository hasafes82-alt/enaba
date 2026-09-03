export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-40 animate-pulse rounded bg-border" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
            <div className="h-4 w-40 animate-pulse rounded bg-border" />
            <div className="h-3 w-56 animate-pulse rounded bg-border" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-border" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded-lg bg-border" />
              <div className="h-10 flex-1 animate-pulse rounded-lg bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
