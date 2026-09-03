import { SearchX } from "lucide-react";
import { LawyerCard } from "@/components/lawyer/LawyerCard";
import { AdSlot } from "@/components/ads/AdSlot";
import type { DirectoryLawyer } from "@/lib/data/lawyers";
import type { Governorate } from "@/lib/data/reference";
import type { Ad } from "@/lib/data/ads";

interface LawyerGridProps {
  lawyers: DirectoryLawyer[];
  governorates: Governorate[];
  inFeedAd?: Ad | null;
  governorateId?: number;
}

/** كل رابع بطاقة إعلان مُقحَمة بين النتائج — SPEC.md §10. */
const AD_INTERVAL = 4;

export function LawyerGrid({ lawyers, governorates, inFeedAd, governorateId }: LawyerGridProps) {
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

  const items: React.ReactNode[] = [];
  lawyers.forEach((lawyer, index) => {
    items.push(
      <LawyerCard key={lawyer.id} lawyer={lawyer} governorate={governorateById.get(lawyer.governorate_id)} />,
    );
    const isLast = index === lawyers.length - 1;
    if (inFeedAd && (index + 1) % AD_INTERVAL === 0 && !isLast) {
      items.push(<AdSlot key={`ad-${index}`} ad={inFeedAd} governorateId={governorateId} />);
    }
  });

  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{items}</div>;
}
