export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="h-8 w-64 animate-pulse rounded bg-border" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-border" />
        ))}
      </div>
    </main>
  );
}
