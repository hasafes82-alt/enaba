import { DELEGATION_TYPE_LABELS } from "@/lib/constants";
import { formatArabicDate } from "@/lib/date";
import { ReviewForm } from "@/components/board/ReviewForm";
import type { MyAssignment } from "@/lib/data/my-requests";

const STATUS_LABELS: Record<MyAssignment["status"], string> = {
  open: "مفتوح",
  assigned: "بانتظار التنفيذ",
  completed: "مكتمل",
  cancelled: "مُغلَق",
  expired: "منتهٍ",
};

export function MyAssignmentCard({ assignment }: { assignment: MyAssignment }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-navy-900">
          {DELEGATION_TYPE_LABELS[assignment.delegation_type]} — {assignment.court_name}
        </h3>
        <span className="rounded-full bg-navy-900/5 px-2 py-0.5 text-xs font-medium text-navy-900">
          {STATUS_LABELS[assignment.status]}
        </span>
      </div>
      <p className="text-xs text-navy-700">
        جلسة {formatArabicDate(assignment.session_date)} · الطالب: {assignment.requester_name ?? "—"}
      </p>

      {assignment.status === "completed" && !assignment.already_reviewed && (
        <ReviewForm
          requestId={assignment.id}
          revieweeId={assignment.requester_id}
          revieweeLabel={assignment.requester_name ?? "الزميل"}
        />
      )}
    </article>
  );
}
