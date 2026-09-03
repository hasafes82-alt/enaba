import { getCourts, getGovernorates } from "@/lib/data/reference";
import { JoinFlow } from "@/components/join/JoinFlow";

export const metadata = {
  title: "انضم إلى دليل إنابة",
  description: "سجّل رقم هاتفك وأكمل ملفك الشخصي للظهور في دليل المحامين ونشر طلبات الإنابة.",
};

export default async function JoinPage() {
  const [governorates, courts] = await Promise.all([getGovernorates(), getCourts()]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-12">
      <JoinFlow governorates={governorates} courts={courts} />
    </main>
  );
}
