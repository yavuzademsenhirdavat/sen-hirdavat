import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Şen Hırdavat — Bursa Nalbur & Hırdavat",
  description: "Bursa Osmangazi'de hırdavat, nalbur, el aletleri ve yapı malzemeleri. Online sipariş ve aynı gün teslimat.",
  keywords: "hırdavat, nalbur, bursa, el aletleri, yapı malzemeleri, vida, somun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${barlow.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
