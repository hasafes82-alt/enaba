"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "دليل المحامين" },
  { href: "/board", label: "لوحة طلبات الإنابة" },
  { href: "/perks", label: "عروض الزملاء" },
  { href: "/forms", label: "مكتبة النماذج" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 p-1.5 shadow-sm">
            <Image
              src="/brand/icon-mark-transparent.png"
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="font-logo text-2xl font-bold leading-none text-gold-600">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-white/90 hover:text-gold-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/join"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            انضم للدليل
          </Link>
          <Link
            href="/board/new"
            className="rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-700"
          >
            أضف طلب إنابة مستعجل
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-white/10 bg-navy-900 px-4 py-3 md:hidden"
          aria-label="التنقل الرئيسي (جوال)"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="rounded-lg border border-white/20 px-3 py-3 text-center font-semibold text-white hover:bg-white/10"
            onClick={() => setMenuOpen(false)}
          >
            انضم للدليل
          </Link>
          <Link
            href="/board/new"
            className="rounded-lg bg-gold-600 px-3 py-3 text-center font-semibold text-white hover:bg-gold-700"
            onClick={() => setMenuOpen(false)}
          >
            أضف طلب إنابة مستعجل
          </Link>
        </nav>
      )}
    </header>
  );
}
