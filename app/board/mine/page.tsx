import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyAssignments, getMyRequests } from "@/lib/data/my-requests";
import { MyRequestCard } from "@/components/board/MyRequestCard";
import { MyAssignmentCard } from "@/components/board/MyAssignmentCard";

export const metadata = { title: "طلباتي واستجاباتي" };

export default async function MyBoardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/join?redirectedFrom=/board/mine");

  const [myRequests, myAssignments] = await Promise.all([
    getMyRequests(user.id),
    getMyAssignments(user.id),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-navy-900">طلباتي كطالب إنابة</h1>
        {myRequests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-navy-700">
            لم تنشر أي طلب إنابة بعد.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {myRequests.map((r) => (
              <MyRequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-navy-900">إنابات مُسنَدة إليّ</h2>
        {myAssignments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-navy-700">
            لا توجد إنابات مُسنَدة إليك بعد.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {myAssignments.map((a) => (
              <MyAssignmentCard key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
