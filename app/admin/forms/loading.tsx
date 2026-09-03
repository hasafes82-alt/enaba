export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="h-6 w-32 animate-pulse rounded bg-border" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-border" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-6 w-32 animate-pulse rounded bg-border" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-border" />
      </div>
    </div>
  );
}
