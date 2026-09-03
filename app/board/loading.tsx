import { RequestBoardSkeleton } from "@/components/board/RequestBoardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="h-8 w-72 animate-pulse rounded bg-border" />
      <RequestBoardSkeleton />
    </main>
  );
}
