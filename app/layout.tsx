import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
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
      className={`${cairo.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-navy-900 font-sans">
        {children}
      </body>
    </html>
  );
}
