import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getCourts, getGovernorates } from "@/lib/data/reference";
import { NewRequestForm } from "@/components/board/NewRequestForm";

export const metadata = {
  title: "طرح طلب إنابة جديد",
};

export default async function NewRequestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/join?redirectedFrom=/board/new");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("lawyer_profiles")
    .select("verification_status")
    .eq("id", user.id)
    .single();

  if (profile?.verification_status !== "verified") {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-lg font-semibold text-navy-900">حسابك قيد المراجعة</p>
        <p className="mt-2 text-navy-700">
          لازم يكتمل توثيق حسابك أولًا قبل نشر طلبات إنابة (عادةً خلال 24 ساعة).
        </p>
      </main>
    );
  }

  const [governorates, courts] = await Promise.all([getGovernorates(), getCourts()]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-center text-2xl font-bold text-navy-900">طرح طلب إنابة جديد</h1>
      <NewRequestForm governorates={governorates} courts={courts} />
    </main>
  );
}
