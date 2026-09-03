export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="h-6 w-56 animate-pulse rounded bg-border" />
        <div className="h-28 w-full animate-pulse rounded-xl bg-border" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-6 w-56 animate-pulse rounded bg-border" />
        <div className="h-28 w-full animate-pulse rounded-xl bg-border" />
      </div>
    </main>
  );
}
