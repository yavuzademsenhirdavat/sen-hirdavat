import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Şen Hırdavat — Bursa Nalbur & Hırdavat",
  description: "Bursa Osmangazi'de hırdavat, nalbur, el aletleri ve yapı malzemeleri. Online sipariş ve aynı gün teslimat.",
  keywords: "hırdavat, nalbur, bursa, el aletleri, yapı malzemeleri, vida, somun",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col text-[#2c2a28]" style={{ background: '#f5f5f5', fontFamily: 'var(--font-montserrat), sans-serif', fontSize: 13 }}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
