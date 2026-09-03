import type { Metadata } from "next";
import { Aref_Ruqaa, Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { LegalBanner } from "@/components/layout/LegalBanner";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "600"],
  display: "swap",
});

/** خط الشعار فقط ("إنابة" في الهيدر) — طابع خط الرقعة الفخم من الهوية البصرية. */
const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "إنابة — دليل الإنابات القضائية للمحامين بمصر",
    template: "%s | إنابة",
  },
  description:
    "دليل مهني مجاني لربط المحامين المصريين لتبادل الإنابات القضائية: حضور جلسات، تصوير أوراق، إيداع صحف دعاوى، وإنذارات على يد محضر — في كل محافظات مصر.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${ibmPlexSansArabic.variable} ${arefRuqaa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-navy-900 font-sans">
        <Header />
        <LegalBanner />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
