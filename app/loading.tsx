import { LawyerGridSkeleton } from "@/components/lawyer/LawyerGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="h-8 w-72 animate-pulse rounded bg-border" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="h-11 animate-pulse rounded-lg bg-border" />
        <div className="h-11 animate-pulse rounded-lg bg-border" />
        <div className="h-11 animate-pulse rounded-lg bg-border" />
      </div>
      <LawyerGridSkeleton />
    </main>
  );
}
