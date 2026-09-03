import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-900 text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE_NAME} — دليل مهني مجاني لربط المحامين المصريين.
        </p>
        <nav className="flex items-center gap-4" aria-label="روابط قانونية">
          <Link href="/legal/terms" className="hover:text-gold-600">
            شروط الاستخدام
          </Link>
          <Link href="/legal/privacy" className="hover:text-gold-600">
            سياسة الخصوصية
          </Link>
        </nav>
      </div>
    </footer>
  );
}
