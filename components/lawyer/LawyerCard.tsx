import { Star, MapPin, ShieldCheck } from "lucide-react";
import { REGISTRATION_DEGREE_LABELS } from "@/lib/constants";
import type { DirectoryLawyer } from "@/lib/data/lawyers";
import type { Governorate } from "@/lib/data/reference";
import { ContactButtons } from "@/components/lawyer/ContactButtons";

interface LawyerCardProps {
  lawyer: DirectoryLawyer;
  governorate: Governorate | undefined;
}

export function LawyerCard({ lawyer, governorate }: LawyerCardProps) {
  const visibleCourts = lawyer.courts.slice(0, 3);
  const extraCourtsCount = lawyer.courts.length - visibleCourts.length;
  const primaryCourtName = lawyer.courts[0]?.name_ar ?? "محكمتك";

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-navy-900">{lawyer.full_name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-gold-100 px-2 py-0.5 font-medium text-gold-700">
              {REGISTRATION_DEGREE_LABELS[lawyer.registration_degree]}
            </span>
            <span className="flex items-center gap-1 text-navy-700">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {governorate?.name_ar ?? "—"}
            </span>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-verified/10 px-2 py-1 text-xs font-semibold text-verified">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          موثّق
        </span>
      </div>

      {lawyer.courts.length > 0 && (
        <p className="text-sm text-navy-700">
          <span className="font-medium text-navy-900">المحاكم: </span>
          {visibleCourts.map((c) => c.name_ar).join("، ")}
          {extraCourtsCount > 0 && ` و${extraCourtsCount} غيرها`}
        </p>
      )}

      {lawyer.bio && <p className="line-clamp-2 text-sm text-navy-700">{lawyer.bio}</p>}

      <div className="flex items-center gap-3 text-sm text-navy-700">
        {lawyer.avg_rating !== null && (
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-gold-600 text-gold-600" aria-hidden="true" />
            {lawyer.avg_rating.toFixed(1)}
            <span className="text-navy-700/70">({lawyer.ratings_count})</span>
          </span>
        )}
        <span>{lawyer.completed_count} مهمة منفَّذة</span>
      </div>

      <ContactButtons lawyerId={lawyer.id} courtName={primaryCourtName} />
    </article>
  );
}
