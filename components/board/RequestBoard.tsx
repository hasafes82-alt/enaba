"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RequestCard } from "@/components/board/RequestCard";
import type { BoardRequest } from "@/lib/data/requests";
import type { Database } from "@/types/database";

interface RequestBoardProps {
  initialRequests: BoardRequest[];
  isAuthenticated: boolean;
  courtNames: Record<number, string>;
  governorateNames: Record<number, string>;
}

type DelegationRequestRow = Database["public"]["Tables"]["delegation_requests"]["Row"];

export function RequestBoard({
  initialRequests,
  isAuthenticated,
  courtNames,
  governorateNames,
}: RequestBoardProps) {
  const [requests, setRequests] = useState(initialRequests);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("board-delegation-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "delegation_requests" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as DelegationRequestRow;
            if (row.status !== "open" && row.status !== "assigned") return;
            setRequests((prev) => [
              {
                ...row,
                court_name: courtNames[row.court_id] ?? null,
                governorate_name: governorateNames[row.governorate_id] ?? null,
              },
              ...prev.filter((r) => r.id !== row.id),
            ]);
          } else if (payload.eventType === "UPDATE") {
            const row = payload.new as DelegationRequestRow;
            setRequests((prev) => {
              if (row.status !== "open" && row.status !== "assigned") {
                return prev.filter((r) => r.id !== row.id);
              }
              return prev.map((r) =>
                r.id === row.id
                  ? {
                      ...r,
                      ...row,
                      court_name: courtNames[row.court_id] ?? r.court_name,
                      governorate_name: governorateNames[row.governorate_id] ?? r.governorate_name,
                    }
                  : r,
              );
            });
          } else if (payload.eventType === "DELETE") {
            const oldRow = payload.old as Partial<DelegationRequestRow>;
            setRequests((prev) => prev.filter((r) => r.id !== oldRow.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courtNames, governorateNames]);

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <ClipboardList className="h-10 w-10 text-navy-700/50" aria-hidden="true" />
        <p className="font-medium text-navy-900">لا توجد طلبات إنابة مفتوحة حاليًا</p>
        <p className="text-sm text-navy-700">كن أول من ينشر طلبًا، أو تابع اللوحة — الطلبات الجديدة تظهر هنا فورًا.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} isAuthenticated={isAuthenticated} />
      ))}
    </div>
  );
}
