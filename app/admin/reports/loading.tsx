export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-32 animate-pulse rounded bg-border" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-border" />
        ))}
      </div>
    </div>
  );
}
