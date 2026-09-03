import { SearchX } from "lucide-react";
import { LawyerCard } from "@/components/lawyer/LawyerCard";
import type { DirectoryLawyer } from "@/lib/data/lawyers";
import type { Governorate } from "@/lib/data/reference";

interface LawyerGridProps {
  lawyers: DirectoryLawyer[];
  governorates: Governorate[];
}

export function LawyerGrid({ lawyers, governorates }: LawyerGridProps) {
  if (lawyers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <SearchX className="h-10 w-10 text-navy-700/50" aria-hidden="true" />
        <p className="font-medium text-navy-900">لا يوجد محامون مطابقون لهذا البحث حاليًا</p>
        <p className="text-sm text-navy-700">جرّب توسيع نطاق البحث، أو كن أول من ينضم من هذه المحافظة.</p>
      </div>
    );
  }

  const governorateById = new Map(governorates.map((g) => [g.id, g]));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lawyers.map((lawyer) => (
        <LawyerCard
          key={lawyer.id}
          lawyer={lawyer}
          governorate={governorateById.get(lawyer.governorate_id)}
        />
      ))}
    </div>
  );
}
