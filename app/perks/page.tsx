import { Gift } from "lucide-react";

export const metadata = {
  title: "عروض ومزايا الزملاء",
};

export default function PerksPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <Gift className="h-10 w-10 text-gold-600" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-navy-900">عروض ومزايا الزملاء</h1>
      <p className="max-w-md text-navy-700">
        خصومات على بدل وأرواب المحاماة، المكتبات القانونية، وأجهزة المكاتب — قريبًا، وفق المرحلة
        الثانية من خارطة الطريق (SPEC.md §15).
      </p>
    </main>
  );
}
