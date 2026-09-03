import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList, Flag, Gift, Megaphone, ShieldCheck } from "lucide-react";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const ADMIN_NAV = [
  { href: "/admin/verifications", label: "طلبات التوثيق", icon: ShieldCheck },
  { href: "/admin/requests", label: "طلبات الإنابة", icon: ClipboardList },
  { href: "/admin/perks", label: "العروض", icon: Gift },
  { href: "/admin/ads", label: "الإعلانات", icon: Megaphone },
  { href: "/admin/reports", label: "البلاغات", icon: Flag },
];

/**
 * فحص صلاحية إضافي على مستوى الصفحة — الطبقة الثانية بعد proxy.ts والطبقة
 * الثالثة قبل RLS (SPEC.md §7: "المطلوب طبقتان مستقلتان" — هذه تحصين إضافي
 * لا يعوّض عنهما).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/join?redirectedFrom=/admin");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("lawyer_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    redirect("/join");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:flex-row">
      <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto sm:w-56 sm:flex-col" aria-label="تنقل الإدارة">
        {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-surface hover:text-navy-900"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
